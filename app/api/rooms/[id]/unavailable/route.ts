import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/lib/models/Room';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const { from, to, reason } = await req.json();

    if (!from || !to) {
      return NextResponse.json({ message: 'Invalid temporal range' }, { status: 400 });
    }

    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return NextResponse.json({ message: 'Room identity not found' }, { status: 404 });
    }

    room.unavailableDates.push({ from: new Date(from), to: new Date(to), reason });
    await room.save();

    return NextResponse.json({ 
      success: true, 
      message: `Temporal block established for room reference ${id}`,
      updatedRoom: room
    });

  } catch (error: any) {
    console.error('Temporal block integration error:', error);
    return NextResponse.json({ message: 'Failed to establish block' }, { status: 500 });
  }
}
