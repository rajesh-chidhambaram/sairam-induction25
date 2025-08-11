import userDetails from "@/models/details";
import {connectToDatabase} from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(params) {
    const {id} = await params.json();
    console.log("ID received:", id);

    await connectToDatabase();

    // Debug log to check what userDetails is
    console.log("userDetails model:", userDetails);

    const userExists = await userDetails.exists({ id: id });
    if (userExists) {
        const existingUser = await userDetails.findOne({ id: id }, { _id: 0, __v: 0 });
        console.log("Existing user found:", existingUser);
        // return NextResponse.json({message: "User already exists"}, {status: 409});

    }else{
        const newUser = new userDetails({ id: id, name: "New User" });
        await newUser.save();
        console.log("New user created:", newUser);
    }

    try {
        const details = await userDetails.findOne({ id: id }, { _id: 0, __v: 0 });
        if (!details) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }
        
        return NextResponse.json({success: true,message: "ID received successfully", details: details}, {status: 200});
    }catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }

}