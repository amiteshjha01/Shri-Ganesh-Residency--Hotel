import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic'
import Booking from '@/lib/models/Booking';
import Room from '@/lib/models/Room';
import { sendBookingEmails } from '@/lib/email';
import { ROOMS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const { 
      name, phone, email, 
      checkIn, checkOut, 
      guests, roomId, totalAmount 
    } = data;

    if (!name || !phone || !email || !checkIn || !checkOut || !guests || !roomId || !totalAmount) {
      return NextResponse.json({ message: 'Missing required configuration' }, { status: 400 });
    }

    const roomRef = ROOMS.find(r => r.id.toString() === roomId.toString());
    if (!roomRef) return NextResponse.json({ message: 'Invalid room identity' }, { status: 400 });

    const roomDoc = await Room.findOneAndUpdate(
      { 
        roomId: roomId.toString(), 
        availableRooms: { $gt: 0 },
        isAvailable: true 
      },
      { $inc: { availableRooms: -1 } },
      { new: true }
    );

    if (!roomDoc) {
      return NextResponse.json({ 
        message: 'This room category is currently fully committed or unavailable.' 
      }, { status: 400 });
    }

    const tokenAmount = 500;
    const remainingAmount = totalAmount - tokenAmount;

    const booking = new Booking({
      name, phone, email,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      roomName: roomRef.name,
      roomId: roomId.toString(),
      totalAmount,
      tokenAmount,
      remainingAmount,
      finalAmount: totalAmount,
      addonTotal: 0,
      addons: [],
      paymentStatus: 'token_paid',
      bookingStatus: 'confirmed'
    });

    await booking.save();
    await sendBookingEmails(booking);

    return NextResponse.json({ 
      success: true, 
      bookingId: booking._id,
      message: 'Booking successfully registered.' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Core Booking Error:', error);
    return NextResponse.json({ message: 'Internal transaction failure' }, { status: 500 });
  }
}
