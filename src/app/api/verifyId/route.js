import userDetails from "@/models/details";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const { id } = body;

        // Input validation
        if (!id) {
            return NextResponse.json(
                { message: "Admission ID is required" }, 
                { status: 400 }
            );
        }

        // Sanitize input - only allow alphanumeric characters
        const sanitizedId = id.toString().trim();
        if (!/^[A-Za-z0-9]+$/.test(sanitizedId)) {
            return NextResponse.json(
                { message: "Invalid admission ID format. Only letters and numbers are allowed." }, 
                { status: 400 }
            );
        }

        if (sanitizedId.length < 3 || sanitizedId.length > 20) {
            return NextResponse.json(
                { message: "Admission ID must be between 3 and 20 characters" }, 
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user exists
        let user = await userDetails.findOne({ id: sanitizedId }).select('-_id -__v');
        
        if (!user) {
            // Create new user with a proper name (in production, this should come from a proper source)
            const newUser = new userDetails({ 
                id: sanitizedId, 
                name: `Student ${sanitizedId}`,
                parentCount: 0
            });
            user = await newUser.save();
            console.log("New user created:", sanitizedId);
        } else {
            console.log("Existing user found:", sanitizedId);
        }

        // Return user details (excluding sensitive fields)
        const userResponse = {
            id: user.id,
            name: user.name,
            parentCount: user.parentCount
        };

        return NextResponse.json({
            success: true,
            message: "ID verified successfully",
            details: userResponse
        }, { status: 200 });

    } catch (error) {
        console.error("Error in verifyId API:", error);
        
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

        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again later." }, 
            { status: 500 }
        );
    }
}