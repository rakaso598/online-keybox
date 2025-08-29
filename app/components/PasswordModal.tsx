'use client';

import { useState } from 'react';

interface PasswordModalProps {
  isNewBox: boolean;
  onSubmit: (password: string) => void;
  onClose: () => void;
}

export default function PasswordModal({ isNewBox, onSubmit, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('암호를 입력해주세요.');
      return;
    }

    if (isNewBox) {
      if (password !== confirmPassword) {
        setError('암호가 일치하지 않습니다.');
        return;
      }
      if (password.length < 4) {
        setError('암호는 최소 4자 이상이어야 합니다.');
        return;
      }
    }

    setError('');
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {isNewBox ? '🔓' : '🔐'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isNewBox ? '새 박스 암호 설정' : '박스 암호 입력'}
          </h2>
          <p className="text-gray-600">
            {isNewBox
              ? '이 박스를 사용하기 위한 암호를 설정해주세요.'
              : '박스에 접근하기 위한 암호를 입력해주세요.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              암호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              placeholder="암호를 입력하세요"
              autoFocus
            />
          </div>

          {isNewBox && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                암호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                placeholder="암호를 다시 입력하세요"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isNewBox ? '설정' : '열기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
