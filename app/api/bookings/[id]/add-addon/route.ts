import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const { name, price } = await req.json();

    if (!name || isNaN(price)) {
      return NextResponse.json({ message: 'Invalid addon entry' }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking reference not found' }, { status: 404 });
    }

    // Calculation logic
    const addonPrice = Number(price);
    booking.addons.push({ name, price: addonPrice, date: new Date() });
    booking.addonTotal += addonPrice;
    booking.finalAmount = booking.totalAmount + booking.addonTotal;
    booking.remainingAmount = booking.finalAmount - booking.tokenAmount;

    await booking.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Addon incorporated into booking reference',
      updatedBooking: booking
    });

  } catch (error: any) {
    console.error('Addon Integration Error:', error);
    return NextResponse.json({ message: 'Failed to update billing reference' }, { status: 500 });
  }
}
