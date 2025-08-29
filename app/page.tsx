'use client';

import { useState, useEffect } from 'react';
import BoxGrid from './components/BoxGrid';
import BoxModal from './components/BoxModal';
import PasswordModal from './components/PasswordModal';

export interface BoxData {
  id: string;
  boxNumber: number;
  title: string;
  content: string;
  password: string;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoxData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [passwordBoxNumber, setPasswordBoxNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 데이터베이스에서 박스 데이터 로드
  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/boxes');
      if (response.ok) {
        const boxesData = await response.json();
        setBoxes(boxesData);
      }
    } catch (error) {
      console.error('Failed to fetch boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 박스 클릭 핸들러
  const handleBoxClick = (box: BoxData) => {
    if (!box.isUsed) {
      // 사용 가능한 박스 - 새 암호 설정
      setPasswordBoxNumber(box.boxNumber);
      setShowPasswordModal(true);
    } else {
      // 사용 중인 박스 - 암호 입력 필요
      setPasswordBoxNumber(box.boxNumber);
      setShowPasswordModal(true);
    }
  };

  // 암호 설정/확인 후 박스 열기
  const handlePasswordSubmit = async (password: string) => {
    if (passwordBoxNumber === null) return;

    const box = boxes.find(b => b.boxNumber === passwordBoxNumber);
    if (!box) return;

    if (!box.isUsed) {
      // 새 박스 - 암호 설정
      try {
        const response = await fetch('/api/boxes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boxNumber: passwordBoxNumber,
            title: box.title,
            content: box.content,
            password,
            isUsed: true
          })
        });

        if (response.ok) {
          const updatedBox = await response.json();
          setBoxes(boxes.map(b => b.boxNumber === passwordBoxNumber ? updatedBox : b));
          setSelectedBox(updatedBox);
        }
      } catch (error) {
        console.error('Failed to update box:', error);
        alert('박스 설정에 실패했습니다.');
        return;
      }
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
    setPasswordBoxNumber(null);
  };

  // 박스 데이터 업데이트
  const handleBoxUpdate = async (updatedBox: BoxData) => {
    try {
      const response = await fetch('/api/boxes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boxNumber: updatedBox.boxNumber,
          title: updatedBox.title,
          content: updatedBox.content,
          password: updatedBox.password,
          isUsed: updatedBox.isUsed
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setBoxes(boxes.map(b => b.boxNumber === updatedBox.boxNumber ? updated : b));
        setSelectedBox(updated);
      }
    } catch (error) {
      console.error('Failed to update box:', error);
      alert('박스 업데이트에 실패했습니다.');
    }
  };

  // 박스 삭제
  const handleBoxDelete = async (boxNumber: number) => {
    try {
      const response = await fetch(`/api/boxes?boxNumber=${boxNumber}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const deletedBox = await response.json();
        setBoxes(boxes.map(b => b.boxNumber === boxNumber ? deletedBox : b));
        setSelectedBox(null);
        setShowBoxModal(false);
      }
    } catch (error) {
      console.error('Failed to delete box:', error);
      alert('박스 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <div className="text-xl text-gray-600">키스토어를 불러오는 중...</div>
        </div>
      </div>
    );
  }

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
            isNewBox={passwordBoxNumber ? !boxes.find(b => b.boxNumber === passwordBoxNumber)?.isUsed : false}
            onSubmit={handlePasswordSubmit}
            onClose={() => {
              setShowPasswordModal(false);
              setPasswordBoxNumber(null);
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
