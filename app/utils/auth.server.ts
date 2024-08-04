import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { db } from '~/utils/db.server';
import bcryptjs from 'bcryptjs'; 
const { compare } = bcryptjs;
import { getSession, commitSession, destroySession } from '~/sessions';
import { LoaderFunction, redirect } from '@remix-run/node';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedUser {
  id: string;
  name: string;
  type: string;
}

export async function createUserToken(user: User) {
  const token = jwt.sign({ id: user.id, name: user.name, type: user.type }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function verifyToken(token: string): Promise<DecodedUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as DecodedUser;
  } catch (error) {
    return null;
  }
}

export async function login(name: string, password: string): Promise<{ token: string; type: number }> {
  const user = await db.user.findUnique({ where: { name } }) as User;
  
  if (user && await compare(password, user.password)) {
    const token = await createUserToken(user); 
    return { token, type: user.type }; 
  }
  
  throw new Error('Credenciais inválidas');
}

export async function requireAuth(request: Request): Promise<DecodedUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    throw redirect("/login");
  }

  const decodedUser = await verifyToken(token);
  if (!decodedUser) {
    throw redirect("/login");
  }

  return decodedUser;
}
