import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

// 모든 박스 조회
export async function GET() {
  try {
    // 기존 박스가 있는지 확인
    const existingBoxes = await prisma.box.findMany({
      orderBy: { boxNumber: 'asc' }
    });

    // 박스가 없으면 초기 5개 박스 생성
    if (existingBoxes.length === 0) {
      const initialBoxes = [];
      for (let i = 1; i <= 5; i++) {
        const box = await prisma.box.create({
          data: {
            boxNumber: i,
            title: '',
            content: '',
            password: '',
            isUsed: false
          }
        });
        initialBoxes.push(box);
      }
      return NextResponse.json(initialBoxes);
    }

    return NextResponse.json(existingBoxes);
  } catch (error) {
    console.error('Error fetching boxes:', error);
    return NextResponse.json({ error: 'Failed to fetch boxes' }, { status: 500 });
  }
}

// 박스 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { boxNumber, title, content, password, isUsed } = body;

    // 기존 박스 정보 조회
    const existingBox = await prisma.box.findUnique({ where: { boxNumber } });
    if (!existingBox) {
      return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    }

    let passwordToSave = existingBox.password;
    // 비밀번호가 새로 들어온 경우에만 해싱
    if (password && (!existingBox.isUsed || (isUsed && password !== '***'))) {
      // password가 '***'이면 기존 비밀번호 유지(수정 아님)
      passwordToSave = await bcrypt.hash(password, 10);
    }

    const updatedBox = await prisma.box.update({
      where: { boxNumber },
      data: {
        title,
        content,
        password: passwordToSave,
        isUsed
      }
    });

    // 비밀번호 해시값은 클라이언트에 전달하지 않음
    const { password: _, ...safeBox } = updatedBox;
    return NextResponse.json(safeBox);
  } catch (error) {
    console.error('Error updating box:', error);
    return NextResponse.json({ error: 'Failed to update box' }, { status: 500 });
  }
}

// 박스 삭제 (초기화)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boxNumber = parseInt(searchParams.get('boxNumber') || '0');

    const deletedBox = await prisma.box.update({
      where: { boxNumber },
      data: {
        title: '',
        content: '',
        password: '',
        isUsed: false
      }
    });

    return NextResponse.json(deletedBox);
  } catch (error) {
    console.error('Error deleting box:', error);
    return NextResponse.json({ error: 'Failed to delete box' }, { status: 500 });
  }
}
