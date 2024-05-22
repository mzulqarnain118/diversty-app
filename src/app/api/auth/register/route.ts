import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { addUser } from "@/lib/prisma/user";
import { Prisma } from "@prisma/client";
import {  generateHash } from "@/utils";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const passwordPattren =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/])(?!.*\s).{8,}$/;

  const userSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        passwordPattren,
        "Password is invalid. Please enter at least 8 characters, including numbers, different case letters, and special characters."
      ),
    name: Yup.string().required("Name is Required"),
  });

  try {
    await userSchema.validate(data, { abortEarly: false });

    const hashedassword = await generateHash(data.password);
    let user: any = await addUser({ ...data, password: hashedassword });

    delete user["password"];
  
    return NextResponse.json(
      {
        success: true,
        msg: "Welcome Abord!!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const validationErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return NextResponse.json(
        { success: false, msg: "Bad Fields", errors: validationErrors },
        { status: 400 }
      );
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          msg: "Email Already exists",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
