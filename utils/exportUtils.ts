import { CollageItem, ItemType } from '../types';

export const exportCanvasToImage = async (
  items: CollageItem[],
  width: number,
  height: number,
  backgroundColor: string
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // Draw Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Sort items by zIndex
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  for (const item of sortedItems) {
    ctx.save();
    
    // Translate to center of item to handle rotation
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((item.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // -- Draw Shadow --
    if (item.shadowBlur && item.shadowBlur > 0) {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = item.shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
    }

    // -- Draw Shape Path --
    ctx.beginPath();
    
    // Handle Border Radius
    if (item.borderRadius === '50%') {
      ctx.ellipse(
        item.x + item.width / 2, 
        item.y + item.height / 2, 
        item.width / 2, 
        item.height / 2, 
        0, 0, 2 * Math.PI
      );
    } else if (item.borderRadius && item.borderRadius !== '0') {
      const r = parseInt(item.borderRadius) || 0;
      if (ctx.roundRect) {
         ctx.roundRect(item.x, item.y, item.width, item.height, r);
      } else {
         ctx.rect(item.x, item.y, item.width, item.height);
      }
    } else {
      ctx.rect(item.x, item.y, item.width, item.height);
    }

    // -- Draw Background/Fill (important for transparency) --
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // -- Draw Image/Content clipped to shape --
    ctx.save(); 
    ctx.clip(); // Clip subsequent drawing to the path above

    if (item.type === ItemType.IMAGE) {
      const imgItem = item as any;
      const img = new Image();
      img.crossOrigin = 'anonymous'; 
      img.src = imgItem.src;
      
      await new Promise<void>((resolve, reject) => {
        if (img.complete) resolve();
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

      ctx.drawImage(img, item.x, item.y, item.width, item.height);
    } else if (item.type === ItemType.TEXT) {
      const txtItem = item as any;
      ctx.font = `${txtItem.fontSize}px ${txtItem.fontFamily}`;
      ctx.fillStyle = txtItem.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = item.x + item.width / 2;
      const textY = item.y + item.height / 2;
      ctx.fillText(txtItem.content, textX, textY, item.width);
    }
    ctx.restore(); // Remove clip

    // -- Draw Border (Stroke) --
    // We stroke *after* to cover ragged edges
    if (item.borderWidth && item.borderWidth > 0) {
      ctx.lineWidth = item.borderWidth * 2; // *2 because stroke is centered on path, we want inner
      ctx.strokeStyle = item.borderColor || '#fff';
      
      // Re-trace path for stroke since clip consumed it (or just stroke() if path persists?)
      // Path usually persists until beginPath. 
      // But let's re-do path to be safe and ensure correct z-index over image edges.
      // Actually, simple stroke on existing path:
      // However, clipping works best if we stroke inside.
      // A safe way for "Inset" border behavior like CSS box-sizing: border-box is tricky in Canvas.
      // Let's just Stroke the path.
      ctx.stroke();
    }

    ctx.restore(); // Restore global context state (rotation/translation/shadows)
  }

  return canvas.toDataURL('image/png');
};