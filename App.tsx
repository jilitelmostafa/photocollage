import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CollageItem, ItemType, DragState, TransformState } from './types';
import CanvasItem from './components/CanvasItem';
import { UploadIcon, TextIcon, DownloadIcon, TrashIcon, BringFrontIcon, LayoutIcon } from './components/Icons';
import { exportCanvasToImage } from './utils/exportUtils';
import { TEMPLATES, Template } from './utils/templates';

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

const App: React.FC = () => {
  // --- State ---
  const [items, setItems] = useState<CollageItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#e0e7ff'); // Light blueish default for better white border contrast
  const [canvasSize, setCanvasSize] = useState({ width: DEFAULT_CANVAS_WIDTH, height: DEFAULT_CANVAS_HEIGHT });
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'templates'>('content');

  // --- Interaction Refs ---
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState>({ isDragging: false, startX: 0, startY: 0, initialItemX: 0, initialItemY: 0 });
  const transformState = useRef<TransformState>({
    isTransforming: false,
    actionType: null,
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialRotation: 0,
    centerX: 0,
    centerY: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const getMousePos = (e: MouseEvent | React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      rawX: e.clientX,
      rawY: e.clientY
    };
  };

  // --- Handlers: Templates ---
  const handleApplyTemplate = (template: Template) => {
    const imageItems = items.filter(i => i.type === ItemType.IMAGE);
    const otherItems = items.filter(i => i.type !== ItemType.IMAGE);
    
    if (imageItems.length === 0) {
      alert("Please upload some photos first!");
      return;
    }

    const newItems = [...otherItems];
    const slots = template.slots;
    
    imageItems.forEach((item, index) => {
      if (index < slots.length) {
        const slot = slots[index];
        newItems.push({
          ...item,
          x: slot.x * canvasSize.width,
          y: slot.y * canvasSize.height,
          width: slot.w * canvasSize.width,
          height: slot.h * canvasSize.height,
          rotation: slot.rotation || 0, // Apply rotation
          zIndex: slot.zIndex ? slot.zIndex : index + 1, // Apply custom zIndex or default
          borderRadius: slot.borderRadius || '0',
          borderWidth: slot.borderWidth || 0,
          borderColor: slot.borderColor || '#fff',
          shadowBlur: slot.shadowBlur || 0,
        });
      } else {
        // Extra images pile up in center-ish
        newItems.push({ 
          ...item, 
          x: canvasSize.width/2 - 50 + (index*10),
          y: canvasSize.height/2 - 50 + (index*10),
          zIndex: 100 + index 
        });
      }
    });

    setItems(newItems);
  };

  // --- Handlers: Add Items ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 300;
          let w = img.width;
          let h = img.height;
          const aspect = w / h;

          if (w > maxDim || h > maxDim) {
            if (w > h) { w = maxDim; h = maxDim / aspect; } 
            else { h = maxDim; w = maxDim * aspect; }
          }

          const offset = index * 20;

          const newItem: CollageItem = {
            id: uuidv4(),
            type: ItemType.IMAGE,
            src: event.target?.result as string,
            x: (canvasSize.width / 2 - w / 2) + offset, 
            y: (canvasSize.height / 2 - h / 2) + offset,
            width: w,
            height: h,
            rotation: (Math.random() * 10) - 5, // Slight random rotation for natural feel
            zIndex: items.length + index + 1,
            borderRadius: '0',
            borderWidth: 8, // Default polaroid style for new uploads
            borderColor: '#fff',
            shadowBlur: 10
          };

          setItems(prev => [...prev, newItem]);
          if (index === 0) setSelectedId(newItem.id);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddText = () => {
    const newItem: CollageItem = {
      id: uuidv4(),
      type: ItemType.TEXT,
      content: 'Double Click to Edit',
      color: '#000000',
      fontSize: 40,
      fontFamily: 'Arial',
      x: canvasSize.width / 2 - 150,
      y: canvasSize.height / 2 - 25,
      width: 300,
      height: 50,
      rotation: 0,
      zIndex: items.length + 1,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  // --- Handlers: Item Management ---
  const handleDelete = useCallback(() => {
    if (selectedId) {
      setItems(prev => prev.filter(i => i.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId]);

  const handleBringToFront = () => {
    if (!selectedId) return;
    const maxZ = Math.max(...items.map(i => i.zIndex), 0);
    setItems(prev => prev.map(i => i.id === selectedId ? { ...i, zIndex: maxZ + 1 } : i));
  };

  // --- Handlers: Mouse Interaction ---
  const handleItemMouseDown = (e: React.MouseEvent, item: CollageItem, action: 'drag' | 'resize' | 'rotate') => {
    e.preventDefault();
    setSelectedId(item.id);

    const maxZ = Math.max(...items.map(i => i.zIndex), 0);
    if(item.zIndex <= maxZ) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, zIndex: maxZ + 1 } : i));
    }

    const { rawX, rawY } = getMousePos(e);

    if (action === 'drag') {
      dragState.current = {
        isDragging: true,
        startX: rawX,
        startY: rawY,
        initialItemX: item.x,
        initialItemY: item.y,
      };
    } else {
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      
      transformState.current = {
        isTransforming: true,
        actionType: action,
        startX: rawX,
        startY: rawY,
        initialWidth: item.width,
        initialHeight: item.height,
        initialRotation: item.rotation,
        centerX,
        centerY,
      };
    }
  };

  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.current.isDragging && selectedId) {
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setItems(prev => prev.map(item => {
        if (item.id === selectedId) {
          return {
            ...item,
            x: dragState.current.initialItemX + dx,
            y: dragState.current.initialItemY + dy,
          };
        }
        return item;
      }));
    }

    if (transformState.current.isTransforming && selectedId) {
       const { actionType, startX, startY, initialWidth, initialHeight, centerX, centerY } = transformState.current;

       setItems(prev => prev.map(item => {
        if (item.id !== selectedId) return item;

        if (actionType === 'resize') {
          const currentDist = Math.hypot(e.clientX - canvasRef.current!.getBoundingClientRect().left - centerX, e.clientY - canvasRef.current!.getBoundingClientRect().top - centerY);
          const startDist = Math.hypot(startX - canvasRef.current!.getBoundingClientRect().left - centerX, startY - canvasRef.current!.getBoundingClientRect().top - centerY);
          const scale = currentDist / startDist;
          
          return {
            ...item,
            width: initialWidth * scale,
            height: initialHeight * scale,
            x: centerX - (initialWidth * scale) / 2,
            y: centerY - (initialHeight * scale) / 2,
          };
        }

        if (actionType === 'rotate') {
           const rect = canvasRef.current!.getBoundingClientRect();
           const mouseX = e.clientX - rect.left;
           const mouseY = e.clientY - rect.top;
           const angleRad = Math.atan2(mouseY - centerY, mouseX - centerX);
           let angleDeg = angleRad * (180 / Math.PI);
           angleDeg += 90; 
           return { ...item, rotation: angleDeg };
        }
        return item;
       }));
    }
  }, [selectedId]);

  const handleWindowMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    transformState.current.isTransforming = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [handleWindowMouseMove, handleWindowMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete]);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportCanvasToImage(items, canvasSize.width, canvasSize.height, backgroundColor);
      const link = document.createElement('a');
      link.download = `collage-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
       reader.onload = (event) => {
         const img = new Image();
         img.onload = () => {
           const maxDim = 300;
           let w = img.width;
           let h = img.height;
           const aspect = w / h;
           if (w > maxDim || h > maxDim) {
             if (w > h) { w = maxDim; h = maxDim / aspect; } else { h = maxDim; w = maxDim * aspect; }
           }
           const rect = canvasRef.current!.getBoundingClientRect();
           const dropX = e.clientX - rect.left - w/2;
           const dropY = e.clientY - rect.top - h/2;

           const newItem: CollageItem = {
             id: uuidv4(),
             type: ItemType.IMAGE,
             src: event.target?.result as string,
             x: dropX,
             y: dropY,
             width: w,
             height: h,
             rotation: (Math.random() * 10) - 5,
             zIndex: items.length + 1,
             borderRadius: '0',
             borderWidth: 8,
             borderColor: '#fff',
             shadowBlur: 10
           };
           setItems(prev => [...prev, newItem]);
           setSelectedId(newItem.id);
         };
         img.src = event.target?.result as string;
       };
       reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
             <span className="font-bold text-white">C</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Collage Master
          </h1>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleDownload}
             disabled={items.length === 0 || isExporting}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isExporting ? 'Exporting...' : <><DownloadIcon /> Export PNG</>}
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col z-10 shadow-xl">
          
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'content' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750' : 'text-gray-400 hover:text-white'}`}
            >
              Add Content
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'templates' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750' : 'text-gray-400 hover:text-white'}`}
            >
              Designs
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'content' ? (
              <>
                <div className="p-4 border-b border-gray-700">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Upload</h2>
                  <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                      >
                        <UploadIcon />
                        <span className="text-sm mt-2 text-gray-300 group-hover:text-white">Photos</span>
                        <input 
                          type="file" 
                          multiple // Enable multiple files
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                        />
                      </button>
                      <button 
                        onClick={handleAddText}
                        className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                      >
                        <TextIcon />
                        <span className="text-sm mt-2 text-gray-300 group-hover:text-white">Text</span>
                      </button>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-700">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Background</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-none p-0"
                        />
                        <span className="text-sm text-gray-300">{backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Canvas Size</label>
                      <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={canvasSize.width} 
                            onChange={(e) => setCanvasSize(s => ({...s, width: Number(e.target.value)}))}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                          />
                          <span className="text-gray-500">x</span>
                          <input 
                            type="number" 
                            value={canvasSize.height} 
                            onChange={(e) => setCanvasSize(s => ({...s, height: Number(e.target.value)}))}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                          />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Layers</h2>
                  <div className="space-y-1">
                      {items.length === 0 && <p className="text-sm text-gray-600 italic">No layers yet</p>}
                      {[...items].reverse().map((item, idx) => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${selectedId === item.id ? 'bg-blue-900/50 text-blue-200 border border-blue-800' : 'hover:bg-gray-700 text-gray-300'}`}
                        >
                          <span className="text-xs font-mono text-gray-500 w-4">{items.length - idx}</span>
                          {item.type === ItemType.IMAGE ? (
                            <div className="w-6 h-6 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                              <img src={(item as any).src} className="w-full h-full object-cover" alt="layer" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-900 text-xs font-bold rounded flex-shrink-0">T</div>
                          )}
                          <span className="truncate flex-1">
                            {item.type === ItemType.IMAGE ? 'Image' : (item as any).content}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">
                 <p className="text-xs text-gray-500 mb-4">Click a design to apply it to your photos.</p>
                 <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleApplyTemplate(template)}
                        className="flex flex-col items-center gap-2 group"
                      >
                         <div className="w-full aspect-square bg-gray-700 rounded border border-gray-600 group-hover:border-blue-500 group-hover:bg-gray-650 transition-all relative overflow-hidden shadow-sm">
                            {template.slots.map((s, i) => (
                              <div 
                                key={i}
                                className="absolute bg-gray-500 border border-gray-800/20"
                                style={{
                                  left: `${s.x * 100}%`,
                                  top: `${s.y * 100}%`,
                                  width: `${s.w * 100}%`,
                                  height: `${s.h * 100}%`,
                                  borderRadius: s.borderRadius || '0',
                                  transform: `rotate(${s.rotation || 0}deg)`,
                                  zIndex: s.zIndex || 1,
                                  border: s.borderWidth ? `${s.borderWidth/2}px solid #fff` : 'none' // Scaled down preview border
                                }}
                              />
                            ))}
                         </div>
                         <span className="text-xs text-gray-400 group-hover:text-white text-center">{template.name}</span>
                      </button>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-gray-900 relative overflow-auto flex items-center justify-center p-8"
          onClick={() => setSelectedId(null)}
        >
          {/* Toolbar Floating */}
          {selectedId && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-full shadow-xl px-4 py-2 flex items-center gap-3 z-30 animate-fade-in-up">
               <span className="text-xs text-gray-400 uppercase font-bold mr-2">Selected Action:</span>
               <button onClick={handleBringToFront} className="p-1.5 hover:bg-gray-700 rounded-full text-white" title="Bring to Front">
                 <BringFrontIcon />
               </button>
               <div className="w-px h-4 bg-gray-600"></div>
               <button onClick={handleDelete} className="p-1.5 hover:bg-red-900/50 hover:text-red-400 rounded-full text-white transition-colors" title="Delete">
                 <TrashIcon />
               </button>
            </div>
          )}

          {/* The Canvas */}
          <div 
            ref={canvasRef}
            className="relative shadow-2xl transition-all duration-200 ease-out checkerboard"
            style={{ 
              width: canvasSize.width, 
              height: canvasSize.height,
              backgroundColor: backgroundColor,
            }}
            onDrop={handleBgDrop}
            onDragOver={handleDragOver}
          >
            {items.map(item => (
              <CanvasItem
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onMouseDown={handleItemMouseDown}
              />
            ))}
            
            {items.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                 <div className="text-center">
                    <LayoutIcon />
                    <p className="text-gray-500 text-xl font-medium mt-2">Start Creating</p>
                    <p className="text-gray-400 text-sm mt-1">Upload photos and choose a design</p>
                 </div>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;