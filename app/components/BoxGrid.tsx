'use client';

import { BoxData } from '../page';

interface BoxGridProps {
  boxes: BoxData[];
  onBoxClick: (box: BoxData) => void;
}

export default function BoxGrid({ boxes, onBoxClick }: BoxGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
      {boxes.map((box) => (
        <div
          key={box.id}
          onClick={() => onBoxClick(box)}
          className={`
            relative h-48 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg
            ${box.isUsed
              ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 shadow-md'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-blue-100 hover:to-blue-200'
            }
          `}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-6xl mb-4">
              {box.isUsed ? '🔒' : '📦'}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                박스 #{box.id}
              </h3>
              <div className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${box.isUsed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
                }
              `}>
                {box.isUsed ? '사용 중' : '사용 가능'}
              </div>
              {box.isUsed && box.title && (
                <p className="mt-2 text-sm text-gray-600 truncate">
                  {box.title}
                </p>
              )}
            </div>
          </div>

          {/* 장식용 요소 */}
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-white bg-opacity-60 rounded-full"></div>
          </div>
          <div className="absolute bottom-2 left-2">
            <div className="w-2 h-2 bg-white bg-opacity-40 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
