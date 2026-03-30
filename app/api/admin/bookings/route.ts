import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const checkIn = searchParams.get('checkIn');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};

    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
      ];
    }
    if (email) query.email = { $regex: email, $options: 'i' };
    if (phone) query.phone = { $regex: phone, $options: 'i' };
    if (checkIn) query.checkIn = { $gte: new Date(checkIn), $lt: new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)) };
    
    if (startDate && endDate) {
      query.checkIn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error: any) {
    console.error('Admin bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
