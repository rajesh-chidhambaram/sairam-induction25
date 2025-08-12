import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import userDetails from "@/models/details";
import { connectToDatabase } from "@/lib/db";

// Helper function to verify authentication
async function verifyAuth(request) {
    const token = request.cookies.get('dashboard-token')?.value;
    
    if (!token) {
        return { authenticated: false, error: "No token provided" };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return { authenticated: false, error: "Server configuration error" };
    }

    try {
        jwt.verify(token, jwtSecret);
        return { authenticated: true };
    } catch (jwtError) {
        return { authenticated: false, error: "Invalid or expired token" };
    }
}

export async function GET(request) {
    try {
        // Verify authentication
        const auth = await verifyAuth(request);
        if (!auth.authenticated) {
            return NextResponse.json(
                { message: auth.error || "Unauthorized" }, 
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Get basic statistics
        const totalRegistrations = await userDetails.countDocuments();
        const totalWithAccompanying = await userDetails.countDocuments({ parentCount: { $gt: 0 } });
        const totalAccompanyingPeople = await userDetails.aggregate([
            { $group: { _id: null, total: { $sum: "$parentCount" } } }
        ]);

        // Get recent registrations (last 10)
        const recentRegistrations = await userDetails
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('id name parentCount createdAt updatedAt')
            .lean();

        // Get recent updates (last 10 accompanying count changes)
        const recentUpdates = await userDetails
            .find({ parentCount: { $gt: 0 } })
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('id name parentCount updatedAt')
            .lean();

        // Get statistics by accompanying count
        const countDistribution = await userDetails.aggregate([
            { $group: { _id: "$parentCount", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const stats = {
            overview: {
                totalRegistrations,
                totalWithAccompanying,
                totalAccompanyingPeople: totalAccompanyingPeople[0]?.total || 0,
                averageAccompanying: totalRegistrations > 0 
                    ? ((totalAccompanyingPeople[0]?.total || 0) / totalRegistrations).toFixed(1)
                    : 0
            },
            recentRegistrations: recentRegistrations.map(reg => ({
                id: reg.id,
                name: reg.name,
                parentCount: reg.parentCount,
                registeredAt: reg.createdAt,
                lastUpdated: reg.updatedAt
            })),
            recentUpdates: recentUpdates.map(update => ({
                id: update.id,
                name: update.name,
                parentCount: update.parentCount,
                updatedAt: update.updatedAt
            })),
            distribution: countDistribution.map(item => ({
                accompanyingCount: item._id,
                studentCount: item.count
            })),
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: stats
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        
        if (error.name === 'MongoNetworkError') {
            return NextResponse.json(
                { message: "Database connection error" }, 
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: "An unexpected error occurred" }, 
            { status: 500 }
        );
    }
}