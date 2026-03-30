import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic'
import Room from '@/lib/models/Room';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rooms = await Room.find({});
    return NextResponse.json({ success: true, rooms });
  } catch (error: any) {
    console.error('Room fetch error:', error);
    return NextResponse.json({ message: 'Failed to retrieve room spectrum' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { roomId, totalRooms, availableRooms } = data;
    
    if (!roomId) return NextResponse.json({ message: 'Room ID required' }, { status: 400 });

    await connectDB();
    const room = await Room.findOneAndUpdate(
      { roomId },
      { 
        totalRooms: Math.max(0, totalRooms || 0), 
        availableRooms: Math.max(0, availableRooms || 0) 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    console.error('Room update error:', error);
    return NextResponse.json({ message: 'Failed to update inventory' }, { status: 500 });
  }
}
