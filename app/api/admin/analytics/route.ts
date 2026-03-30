import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic'
import Booking from '@/lib/models/Booking';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this';

async function authenticate(req: NextRequest) {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const admin = await authenticate(req);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // 1. Revenue & Bookings per day (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
          date: { $first: "$createdAt" }
        }
      },
      { $sort: { date: 1 } },
    ]);

    // 2. Room-wise Data
    const roomData = await Booking.aggregate([
      { 
        $group: {
          _id: "$roomName",
          occupancy: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { occupancy: -1 } }
    ]);

    // Format room data for charts
    const formattedRoomData = roomData.map(item => ({
      room: item._id,
      occupancy: item.occupancy,
      revenue: item.revenue
    }));

    // Format revenue data
    const formattedRevenueData = revenueData.map(item => ({
      date: item._id,
      revenue: item.revenue,
      bookings: item.bookings
    }));

    // 3. Overall Stats
    const totalRevenue = await Booking.aggregate([
       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const stats = {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalBookings: await Booking.countDocuments(),
      recentBookings: await Booking.find().sort({ createdAt: -1 }).limit(5)
    };

    return NextResponse.json({
      success: true,
      revenueData: formattedRevenueData,
      roomData: formattedRoomData,
      stats
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
