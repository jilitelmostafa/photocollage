export enum ItemType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
}

export interface BaseItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  type: ItemType;
  borderRadius?: string; 
  borderWidth?: number; // New: Border thickness
  borderColor?: string; // New: Border color
  shadowBlur?: number;  // New: Drop shadow intensity
}

export interface ImageItem extends BaseItem {
  type: ItemType.IMAGE;
  src: string;
}

export interface TextItem extends BaseItem {
  type: ItemType.TEXT;
  content: string;
  color: string;
  fontSize: number;
  fontFamily: string;
}

export type CollageItem = ImageItem | TextItem;

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialItemX: number;
  initialItemY: number;
}

export interface TransformState {
  isTransforming: boolean; 
  actionType: 'resize' | 'rotate' | null;
  startX: number;
  startY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  centerX: number;
  centerY: number;
}