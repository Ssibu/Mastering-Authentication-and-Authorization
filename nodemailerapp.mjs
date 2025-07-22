import { Resend } from "resend";

const resend = new Resend("re_Q6KEKoDn_Gveb78JtUkTzZWzQ3krp2E2k");

const result = await resend.emails.send({
  from: "Anurag Singh <contact@procodrr.dev>",
  to: "procodrr@gmail.com",
  subject: "Hello ProCodrr",
  html: "<p>It works!</p>",
});

console.log(result);
