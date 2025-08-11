import userDetails from "@/models/details";
import {connectToDatabase} from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(params) {
    const {id, accompanyingCount} = await params.json();
    console.log("ID received for update:", id);
    console.log("Accompanying count received:", accompanyingCount);

    await connectToDatabase();

    try {
        const user = await userDetails.findOne({ id: id });
        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        user.parentCount += accompanyingCount;
        await user.save();

        return NextResponse.json({success: true, message: "Accompanying count updated successfully", parentCount: user.parentCount}, {status: 200});
    } catch (error) {
        console.error("Error updating user details:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}