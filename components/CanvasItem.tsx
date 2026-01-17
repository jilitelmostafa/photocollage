import React from 'react';
import { CollageItem, ItemType } from '../types';
import { RotateIcon } from './Icons';

interface CanvasItemProps {
  item: CollageItem;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, item: CollageItem, action: 'drag' | 'resize' | 'rotate') => void;
}

const CanvasItem: React.FC<CanvasItemProps> = ({ item, isSelected, onMouseDown }) => {
  
  // Calculate styles based on item properties
  const hasBorder = item.borderWidth && item.borderWidth > 0;
  const hasShadow = item.shadowBlur && item.shadowBlur > 0;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: item.x,
    top: item.y,
    width: item.width,
    height: item.height,
    transform: `rotate(${item.rotation}deg)`,
    zIndex: item.zIndex,
    cursor: 'move',
    touchAction: 'none',
    userSelect: 'none',
    borderRadius: item.borderRadius || '0',
    // Apply Border
    border: hasBorder ? `${item.borderWidth}px solid ${item.borderColor || '#fff'}` : 'none',
    // Apply Shadow
    boxShadow: hasShadow ? `0 10px ${item.shadowBlur}px rgba(0,0,0,0.5)` : 'none',
    // Box sizing border-box ensures border is included in width/height
    boxSizing: 'border-box',
    overflow: 'hidden', 
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    onMouseDown(e, item, 'drag');
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, item, 'resize');
  };

  const handleRotateDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, item, 'rotate');
  };

  return (
    <div
      style={style}
      className={`group ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {item.type === ItemType.IMAGE ? (
        <img
          src={(item as any).src}
          alt="collage-item"
          className="w-full h-full object-cover pointer-events-none select-none block"
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{
            color: (item as any).color,
            fontSize: (item as any).fontSize,
            fontFamily: (item as any).fontFamily,
            lineHeight: 1,
          }}
        >
          {(item as any).content}
        </div>
      )}

      {isSelected && (
        <>
          <div
            className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-se-resize flex items-center justify-center z-50 shadow-md"
            onMouseDown={handleResizeDown}
          >
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </div>
          <div
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white text-gray-700 border border-gray-300 rounded-full cursor-grab flex items-center justify-center z-50 shadow-md active:cursor-grabbing"
            onMouseDown={handleRotateDown}
          >
             <RotateIcon />
          </div>
          <div className="absolute -top-6 left-1/2 w-px h-6 bg-blue-500 -translate-x-1/2 pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default CanvasItem;