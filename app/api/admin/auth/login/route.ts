import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Room from '@/lib/models/Room';
import { ROOMS } from '@/lib/constants';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this';

const DEFAULT_USERS = [
  {
    email: 'sriganeshresidencytpt@gmail.com',
    password: 'Admin@sgr.com#123456',
    role: 'admin'
  },
  {
    email: 'superadmin@sgr.com',
    password: 'Admin@171018',
    role: 'super_admin'
  }
];

async function seedInitialData() {
  // Seed Users
  for (const user of DEFAULT_USERS) {
    let dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await new User({ ...user, password: hashedPassword }).save();
    }
  }

  // Seed Rooms
  for (const room of ROOMS) {
    const exists = await Room.findOne({ roomId: room.id.toString() });
    if (!exists) {
      await new Room({
        roomId: room.id.toString(),
        name: room.name,
        isAvailable: true,
        unavailableDates: []
      }).save();
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await seedInitialData();
    
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    console.log(`Login attempt for: ${email}`);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log(`User not found: ${email}`);
      return NextResponse.json({ message: 'Invalid credentials - identity unknown' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Invalid password for: ${email}`);
      return NextResponse.json({ message: 'Invalid credentials - key mismatch' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      user: { email: user.email, role: user.role } 
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
