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
    const { isAvailable } = await req.json();

    const room = await Room.findOneAndUpdate(
      { roomId: id },
      { isAvailable },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Inventory status altered for room reference ${id}`,
      updatedRoom: room
    });

  } catch (error: any) {
    console.error('Inventory toggle error:', error);
    return NextResponse.json({ message: 'Failed to update inventory status' }, { status: 500 });
  }
}
