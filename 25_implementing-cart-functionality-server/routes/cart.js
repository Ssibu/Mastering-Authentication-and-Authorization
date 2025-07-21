import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  //Add your code here
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
  //Add your code here
});

export default router;
