import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let query: any = {};
    if (session.role === 'admin') {
       // Only return admin users (hide super_admin)
       query = { role: 'admin' };
    } else {
       // Super admin sees all
    }

    const users = await User.find(query).select('-password');

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error: any) {
    console.error('List users error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
