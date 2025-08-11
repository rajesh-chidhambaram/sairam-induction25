import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Input validation
        if (!password) {
            return NextResponse.json(
                { message: "Password is required" }, 
                { status: 400 }
            );
        }

        // Check password against environment variable
        const correctPassword = process.env.DASHBOARD_PASSWORD;
        if (!correctPassword) {
            console.error("DASHBOARD_PASSWORD environment variable not set");
            return NextResponse.json(
                { message: "Server configuration error" }, 
                { status: 500 }
            );
        }

        if (password !== correctPassword) {
            return NextResponse.json(
                { message: "Invalid password" }, 
                { status: 401 }
            );
        }

        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET environment variable not set");
            return NextResponse.json(
                { message: "Server configuration error" }, 
                { status: 500 }
            );
        }

        const sessionDuration = parseInt(process.env.SESSION_DURATION_MINUTES) || 30;
        const token = jwt.sign(
            { 
                authenticated: true, 
                timestamp: Date.now() 
            }, 
            jwtSecret, 
            { expiresIn: `${sessionDuration}m` }
        );

        // Create response with httpOnly cookie
        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
            expiresIn: sessionDuration * 60 * 1000 // milliseconds
        }, { status: 200 });

        // Set httpOnly cookie
        response.cookies.set({
            name: 'dashboard-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: sessionDuration * 60 // seconds
        });

        return response;

    } catch (error) {
        console.error("Error in dashboard auth API:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred" }, 
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        // Check if user is already authenticated
        const token = request.cookies.get('dashboard-token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { authenticated: false }, 
                { status: 401 }
            );
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { authenticated: false, message: "Server configuration error" }, 
                { status: 500 }
            );
        }

        try {
            const decoded = jwt.verify(token, jwtSecret);
            return NextResponse.json({
                authenticated: true,
                expiresAt: decoded.exp * 1000 // Convert to milliseconds
            }, { status: 200 });
        } catch (jwtError) {
            // Token is invalid or expired
            const response = NextResponse.json(
                { authenticated: false, message: "Session expired" }, 
                { status: 401 }
            );
            
            // Clear the invalid cookie
            response.cookies.set({
                name: 'dashboard-token',
                value: '',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 0
            });

            return response;
        }

    } catch (error) {
        console.error("Error checking dashboard auth:", error);
        return NextResponse.json(
            { authenticated: false, message: "An unexpected error occurred" }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        // Logout - clear the cookie
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 });

        response.cookies.set({
            name: 'dashboard-token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0
        });

        return response;

    } catch (error) {
        console.error("Error in dashboard logout:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred" }, 
            { status: 500 }
        );
    }
}