import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const session = await Session.findById(sessionId);
  const courseIds = session.data.cart.map(({ courseId }) => courseId);

  const courses = await Course.find({ _id: { $in: courseIds } });

  const cartCourses = courses.map((course) => {
    const { id, name, image, price } = course;

    const { quantity } = session.data.cart.find(
      ({ courseId }) => courseId === id
    );
    return {
      id,
      name,
      image,
      price,
      quantity,
    };
  });

  res.json(cartCourses);
});

// Add to cart
router.post("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.body.courseId;

  const result = await Session.updateOne(
    {
      _id: sessionId,
      "data.cart.courseId": courseId,
    },
    {
      $inc: { "data.cart.$.quantity": 1 },
    }
  );

  if (result.matchedCount === 0) {
    await Session.updateOne(
      { _id: sessionId },
      {
        $push: {
          "data.cart": { courseId, quantity: 1 },
        },
      }
    );
  }

  console.log(result);

  res.status(201).json({ message: "Course added to the cart" });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.params.courseId;

  const result = await Session.updateOne(
    { _id: sessionId },
    { $pull: { "data.cart": { courseId } } }
  );

  console.log(result);
  res.json({ message: "Cart item deleted" });
});

export default router;
