import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: any = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (phone) query.phone = { $regex: phone, $options: 'i' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    // Generate CSV
    const csvRows = [];
    const headers = [
      'Booking ID', 'Guest Name', 'Phone', 'Email', 
      'Room', 'Check-In', 'Check-Out', 'Guests',
      'Base Total', 'Token Paid', 'Addon Total', 
      'Final Total', 'Remaining', 'Status', 'Date'
    ];
    csvRows.push(headers.join(','));

    for (const b of bookings) {
      const row = [
        b._id,
        `"${b.name}"`,
        b.phone,
        b.email,
        `"${b.roomName}"`,
        new Date(b.checkIn).toLocaleDateString(),
        new Date(b.checkOut).toLocaleDateString(),
        b.guests,
        b.totalAmount,
        b.tokenAmount,
        b.addonTotal,
        b.finalAmount,
        b.remainingAmount,
        b.bookingStatus,
        new Date(b.createdAt).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sgr_bookings_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ message: 'Export generation failed' }, { status: 500 });
  }
}
