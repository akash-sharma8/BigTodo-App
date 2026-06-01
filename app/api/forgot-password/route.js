import crypto from "crypto";
import UserModel from "@/models/User";
import connectDB from "@/config/Db";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req) {

  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({
        message:
          "No user found with this email",
      },
        { status: 404 }
      );
    }

    // generate raw token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // save in DB
    user.resetToken = hashedToken;
    console.log("TOKEN:", resetToken);
    console.log("HASHED:", hashedToken);
    user.resetTokenExpiry =
      Date.now() + 1000 * 60 * 15;

    await user.save();
    // reset URL

    const resetUrl =
      `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    // send email
    await resend.emails.send({

      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>
          Click below to reset your password
        </p>
        <a href="${resetUrl}">
          Reset Password
        </a>
      `,
    });

    return NextResponse.json(
      {
        message:
          "Reset password email sent",
      },
      { status: 200 }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}