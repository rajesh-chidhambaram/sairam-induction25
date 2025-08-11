import userDetails from "@/models/details";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const { id, accompanyingCount } = body;

        // Input validation
        if (!id) {
            return NextResponse.json(
                { message: "Admission ID is required" }, 
                { status: 400 }
            );
        }

        if (accompanyingCount === undefined || accompanyingCount === null) {
            return NextResponse.json(
                { message: "Accompanying count is required" }, 
                { status: 400 }
            );
        }

        // Validate accompanying count
        const count = parseInt(accompanyingCount);
        if (isNaN(count) || count < 0 || count > 10) {
            return NextResponse.json(
                { message: "Accompanying count must be a number between 0 and 10" }, 
                { status: 400 }
            );
        }

        // Sanitize ID input
        const sanitizedId = id.toString().trim();
        if (!/^[A-Za-z0-9]+$/.test(sanitizedId)) {
            return NextResponse.json(
                { message: "Invalid admission ID format" }, 
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find and update user
        const user = await userDetails.findOne({ id: sanitizedId });
        if (!user) {
            return NextResponse.json(
                { message: "User not found. Please verify your admission ID first." }, 
                { status: 404 }
            );
        }

        // Update the parent count (set to new value, don't add to existing)
        user.parentCount = count;
        const updatedUser = await user.save();

        console.log(`Updated accompanying count for ${sanitizedId}: ${count}`);

        return NextResponse.json({
            success: true,
            message: "Accompanying count updated successfully",
            parentCount: updatedUser.parentCount
        }, { status: 200 });

    } catch (error) {
        console.error("Error in updateId API:", error);
        
        // Handle specific mongoose errors
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: "Invalid data format" }, 
                { status: 400 }
            );
        }

        if (error.name === 'MongoNetworkError') {
            return NextResponse.json(
                { message: "Database connection error. Please try again later." }, 
                { status: 503 }
            );
        }

        if (error.name === 'CastError') {
            return NextResponse.json(
                { message: "Invalid admission ID format" }, 
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again later." }, 
            { status: 500 }
        );
    }
}