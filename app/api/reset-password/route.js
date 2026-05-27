import crypto from "crypto";
import bcrypt from "bcrypt";

import UserModel from "@/models/User";
import connectDB from "@/config/Db";

import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();
    console.log(body)
    const { token, password } = body;

    if (!token || !password) {

      return NextResponse.json(
        {
          message:
            "Token and password required",
        },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("TOKEN:", token);
    console.log("HASHED:", hashedToken);

    const user = await UserModel.findOne({

      resetToken: hashedToken,

      resetTokenExpiry: {
        $gt: Date.now(),
      },

    });

    console.log("USER:", user);

    if (!user) {

      return NextResponse.json(
        {
          message:
            "Invalid or expired token",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message:
          "Password reset successful",
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