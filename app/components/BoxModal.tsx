'use client';

import { useState, useEffect } from 'react';
import { BoxData } from '../page';

interface BoxModalProps {
  box: BoxData;
  onUpdate: (box: BoxData) => void;
  onDelete: (boxId: number) => void;
  onClose: () => void;
}

export default function BoxModal({ box, onUpdate, onDelete, onClose }: BoxModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(box.title);
  const [content, setContent] = useState(box.content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 초기 데이터와 비교하여 변경사항 감지
  useEffect(() => {
    const hasChanges = title !== box.title || content !== box.content;
    setHasUnsavedChanges(hasChanges && isEditing);
  }, [title, content, box.title, box.content, isEditing]);

  // 처음 박스를 열었을 때 내용이 비어있으면 자동으로 편집 모드
  useEffect(() => {
    if (!box.title && !box.content) {
      setIsEditing(true);
    }
  }, [box.title, box.content]);

  const handleSave = () => {
    const updatedBox = {
      ...box,
      title: title.trim(),
      content: content.trim(),
    };
    onUpdate(updatedBox);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (confirm('정말로 이 박스의 모든 내용을 삭제하시겠습니까?')) {
      onDelete(box.id);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('저장되지 않은 변경사항이 있습니다. 그래도 나가시겠습니까?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle(box.title);
    setContent(box.content);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔐</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                박스 #{box.id}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? '편집 모드' : '읽기 모드'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="제목을 입력하세요"
                  maxLength={100}
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[48px]">
                  {title || '제목이 없습니다'}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              {isEditing ? (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="내용을 입력하세요 (최대 3000자)"
                  rows={12}
                  maxLength={3000}
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[300px] whitespace-pre-wrap">
                  {content || '내용이 없습니다'}
                </div>
              )}
              {isEditing && (
                <div className="text-right text-sm text-gray-500 mt-1">
                  {content.length}/3000
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              삭제
            </button>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    저장
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  수정
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
