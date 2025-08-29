'use client';

import { useState, useEffect } from 'react';
import BoxGrid from './components/BoxGrid';
import BoxModal from './components/BoxModal';
import PasswordModal from './components/PasswordModal';

export interface BoxData {
  id: number;
  title: string;
  content: string;
  password: string;
  isUsed: boolean;
}

export default function Home() {
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoxData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [passwordBoxId, setPasswordBoxId] = useState<number | null>(null);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedBoxes = localStorage.getItem('keystore-boxes');
    if (savedBoxes) {
      setBoxes(JSON.parse(savedBoxes));
    } else {
      // 초기 5개 박스 생성
      const initialBoxes: BoxData[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: '',
        content: '',
        password: '',
        isUsed: false,
      }));
      setBoxes(initialBoxes);
      localStorage.setItem('keystore-boxes', JSON.stringify(initialBoxes));
    }
  }, []);

  // 박스 데이터를 로컬 스토리지에 저장
  const saveBoxes = (updatedBoxes: BoxData[]) => {
    setBoxes(updatedBoxes);
    localStorage.setItem('keystore-boxes', JSON.stringify(updatedBoxes));
  };

  // 박스 클릭 핸들러
  const handleBoxClick = (box: BoxData) => {
    if (!box.isUsed) {
      // 사용 가능한 박스 - 새 암호 설정
      setPasswordBoxId(box.id);
      setShowPasswordModal(true);
    } else {
      // 사용 중인 박스 - 암호 입력 필요
      setPasswordBoxId(box.id);
      setShowPasswordModal(true);
    }
  };

  // 암호 설정/확인 후 박스 열기
  const handlePasswordSubmit = (password: string) => {
    if (passwordBoxId === null) return;

    const box = boxes.find(b => b.id === passwordBoxId);
    if (!box) return;

    if (!box.isUsed) {
      // 새 박스 - 암호 설정
      const updatedBoxes = boxes.map(b =>
        b.id === passwordBoxId
          ? { ...b, password, isUsed: true }
          : b
      );
      saveBoxes(updatedBoxes);
      setSelectedBox(updatedBoxes.find(b => b.id === passwordBoxId)!);
    } else {
      // 기존 박스 - 암호 확인
      if (box.password === password) {
        setSelectedBox(box);
      } else {
        alert('암호가 틀렸습니다.');
        return;
      }
    }

    setShowPasswordModal(false);
    setShowBoxModal(true);
    setPasswordBoxId(null);
  };

  // 박스 데이터 업데이트
  const handleBoxUpdate = (updatedBox: BoxData) => {
    const updatedBoxes = boxes.map(b =>
      b.id === updatedBox.id ? updatedBox : b
    );
    saveBoxes(updatedBoxes);
    setSelectedBox(updatedBox);
  };

  // 박스 삭제
  const handleBoxDelete = (boxId: number) => {
    const updatedBoxes = boxes.map(b =>
      b.id === boxId
        ? { ...b, title: '', content: '', password: '', isUsed: false }
        : b
    );
    saveBoxes(updatedBoxes);
    setSelectedBox(null);
    setShowBoxModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 온라인 키스토어
          </h1>
          <p className="text-gray-600">
            안전한 개인 데이터 보관함 - 각 박스에 암호를 설정하여 중요한 정보를 보호하세요
          </p>
        </header>

        <BoxGrid boxes={boxes} onBoxClick={handleBoxClick} />

        {showPasswordModal && (
          <PasswordModal
            isNewBox={passwordBoxId ? !boxes.find(b => b.id === passwordBoxId)?.isUsed : false}
            onSubmit={handlePasswordSubmit}
            onClose={() => {
              setShowPasswordModal(false);
              setPasswordBoxId(null);
            }}
          />
        )}

        {showBoxModal && selectedBox && (
          <BoxModal
            box={selectedBox}
            onUpdate={handleBoxUpdate}
            onDelete={handleBoxDelete}
            onClose={() => {
              setShowBoxModal(false);
              setSelectedBox(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
