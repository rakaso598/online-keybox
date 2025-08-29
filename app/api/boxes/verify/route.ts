import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { boxNumber, password } = await request.json();
    const box = await prisma.box.findUnique({ where: { boxNumber } });
    if (!box) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }
    const isMatch = await bcrypt.compare(password, box.password);
    if (isMatch) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
