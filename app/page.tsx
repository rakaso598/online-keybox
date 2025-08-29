'use client';

import { useState, useEffect } from 'react';
import BoxGrid from './components/BoxGrid';
import BoxModal from './components/BoxModal';
import PasswordModal from './components/PasswordModal';
import { decryptContent, encryptContent } from './components/BoxModal';

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
      // 기존 박스 - 암호 확인 (서버에 검증 요청)
      try {
        const response = await fetch('/api/boxes/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boxNumber: passwordBoxNumber, password })
        });
        if (response.ok) {
          setSelectedBox(box);
        } else {
          alert('암호가 틀렸습니다.');
          return;
        }
      } catch (error) {
        alert('암호 확인에 실패했습니다.');
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
      // 박스 비밀번호는 selectedBox에서 가져옴(이미 인증된 상태)
      const password = prompt('박스 비밀번호를 입력하세요(암호화/복호화용)');
      if (!password) return;
      const encryptedContent = await encryptContent(password, updatedBox.content);
      const response = await fetch('/api/boxes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boxNumber: updatedBox.boxNumber,
          title: updatedBox.title,
          content: encryptedContent,
          password: '***', // 비밀번호 변경 아님 표시
          isUsed: updatedBox.isUsed
        })
      });
      if (response.ok) {
        const updated = await response.json();
        // 복호화해서 보여주기
        updated.content = await decryptContent(password, updated.content);
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
          <div className="text-xl text-gray-600">키박스를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm rounded px-4 py-3 font-semibold">
              ⚠️ 이 프로젝트는 학습/실습/데모용 예제입니다. 실제 비밀번호, 개인키, 민감정보를 저장하지 마세요.<br />
              데이터는 평문으로 데이터베이스에 저장되며, 별도의 암호화/해싱/인증/인가가 적용되어 있지 않습니다.<br />
              운영자(배포자)가 모든 데이터에 접근할 수 있습니다. 데이터 유출, 손실, 해킹 등에 대해 서비스 제공자는 책임지지 않습니다.
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 온라인 키박스
          </h1>
          <p className="text-gray-600">
            임시 개인 데이터 보관함 - 각 박스에 암호를 설정하여 임의의 문자열을 저장하세요
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
