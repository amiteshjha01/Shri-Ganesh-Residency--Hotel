import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this';

export async function getAuthSession() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string, role: string };
    return decoded;
  } catch (err) {
    return null;
  }
}
