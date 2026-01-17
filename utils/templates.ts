export interface TemplateSlot {
  x: number; // Percentage 0-1
  y: number; // Percentage 0-1
  w: number; // Percentage 0-1
  h: number; // Percentage 0-1
  rotation?: number; // Degrees
  borderRadius?: string; // '50%' or '20px'
  zIndex?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowBlur?: number;
}

export interface Template {
  id: string;
  name: string;
  slots: TemplateSlot[];
}

// --- STYLES ---
const S_POLAROID = { borderWidth: 12, borderColor: '#fff', shadowBlur: 25, borderRadius: '2px' };
const S_MINIMAL = { borderWidth: 0, shadowBlur: 5, borderRadius: '0' };
const S_FILM = { borderWidth: 8, borderColor: '#111', shadowBlur: 10, borderRadius: '4px' };
const S_ROUNDED = { borderWidth: 6, borderColor: '#fff', shadowBlur: 15, borderRadius: '30px' };
const S_CIRCLE = { borderWidth: 6, borderColor: '#fff', shadowBlur: 15, borderRadius: '50%' };
const S_CARD = { borderWidth: 6, borderColor: '#fff', shadowBlur: 10, borderRadius: '0' };

export const TEMPLATES: Template[] = [
  // ==============================
  // 1. POLAROID & SCRAPBOOK (1-8)
  // ==============================
  {
    id: 'p-duo-love',
    name: 'Polaroid Duo',
    slots: [
      { x: 0.15, y: 0.15, w: 0.5, h: 0.6, rotation: -8, zIndex: 1, ...S_POLAROID },
      { x: 0.4, y: 0.25, w: 0.5, h: 0.6, rotation: 12, zIndex: 2, ...S_POLAROID },
    ]
  },
  {
    id: 'p-trio-scatter',
    name: 'Scattered Trio',
    slots: [
      { x: 0.05, y: 0.1, w: 0.4, h: 0.5, rotation: -15, zIndex: 1, ...S_POLAROID },
      { x: 0.55, y: 0.05, w: 0.4, h: 0.5, rotation: 10, zIndex: 2, ...S_POLAROID },
      { x: 0.3, y: 0.45, w: 0.45, h: 0.5, rotation: 2, zIndex: 3, ...S_POLAROID },
    ]
  },
  {
    id: 'p-quad-messy',
    name: 'Messy Quad',
    slots: [
      { x: 0.1, y: 0.05, w: 0.35, h: 0.45, rotation: -6, zIndex: 1, ...S_POLAROID },
      { x: 0.55, y: 0.1, w: 0.35, h: 0.45, rotation: 8, zIndex: 2, ...S_POLAROID },
      { x: 0.15, y: 0.5, w: 0.35, h: 0.45, rotation: 4, zIndex: 3, ...S_POLAROID },
      { x: 0.5, y: 0.55, w: 0.35, h: 0.45, rotation: -12, zIndex: 4, ...S_POLAROID },
    ]
  },
  {
    id: 'p-stack-5',
    name: 'The Stack (5)',
    slots: [
      { x: 0.25, y: 0.15, w: 0.5, h: 0.6, rotation: -15, zIndex: 1, ...S_POLAROID },
      { x: 0.25, y: 0.15, w: 0.5, h: 0.6, rotation: 12, zIndex: 2, ...S_POLAROID },
      { x: 0.25, y: 0.15, w: 0.5, h: 0.6, rotation: -5, zIndex: 3, ...S_POLAROID },
      { x: 0.25, y: 0.15, w: 0.5, h: 0.6, rotation: 8, zIndex: 4, ...S_POLAROID },
      { x: 0.25, y: 0.15, w: 0.5, h: 0.6, rotation: 0, zIndex: 5, ...S_POLAROID },
    ]
  },
  {
    id: 'p-fan-deck',
    name: 'Card Fan',
    slots: [
      { x: 0.3, y: 0.2, w: 0.4, h: 0.6, rotation: -20, zIndex: 1, ...S_CARD },
      { x: 0.3, y: 0.2, w: 0.4, h: 0.6, rotation: -10, zIndex: 2, ...S_CARD },
      { x: 0.3, y: 0.2, w: 0.4, h: 0.6, rotation: 0, zIndex: 3, ...S_CARD },
      { x: 0.3, y: 0.2, w: 0.4, h: 0.6, rotation: 10, zIndex: 4, ...S_CARD },
      { x: 0.3, y: 0.2, w: 0.4, h: 0.6, rotation: 20, zIndex: 5, ...S_CARD },
    ]
  },
  {
    id: 'p-clothesline',
    name: 'Clothesline',
    slots: [
      { x: 0.02, y: 0.2, w: 0.3, h: 0.4, rotation: 5, ...S_POLAROID },
      { x: 0.35, y: 0.25, w: 0.3, h: 0.4, rotation: -3, ...S_POLAROID },
      { x: 0.68, y: 0.2, w: 0.3, h: 0.4, rotation: 8, ...S_POLAROID },
    ]
  },
  {
    id: 'p-wall',
    name: 'Gallery Wall',
    slots: [
      { x: 0.05, y: 0.05, w: 0.28, h: 0.4, rotation: -2, ...S_POLAROID },
      { x: 0.36, y: 0.05, w: 0.28, h: 0.4, rotation: 1, ...S_POLAROID },
      { x: 0.67, y: 0.05, w: 0.28, h: 0.4, rotation: -1, ...S_POLAROID },
      { x: 0.05, y: 0.5, w: 0.28, h: 0.4, rotation: 2, ...S_POLAROID },
      { x: 0.36, y: 0.5, w: 0.28, h: 0.4, rotation: -2, ...S_POLAROID },
      { x: 0.67, y: 0.5, w: 0.28, h: 0.4, rotation: 1, ...S_POLAROID },
    ]
  },
  {
    id: 'p-collage-mix',
    name: 'Scrapbook Mix',
    slots: [
      { x: 0.05, y: 0.05, w: 0.5, h: 0.6, rotation: -4, zIndex: 1, ...S_POLAROID },
      { x: 0.5, y: 0.3, w: 0.45, h: 0.4, rotation: 6, zIndex: 2, ...S_POLAROID },
      { x: 0.1, y: 0.6, w: 0.4, h: 0.35, rotation: 3, zIndex: 3, ...S_POLAROID },
    ]
  },

  // ==============================
  // 2. FILM & CINEMA (9-14)
  // ==============================
  {
    id: 'f-strip-vert',
    name: 'Film Strip (V)',
    slots: [
      { x: 0.3, y: 0.02, w: 0.4, h: 0.3, rotation: 0, ...S_FILM },
      { x: 0.3, y: 0.34, w: 0.4, h: 0.3, rotation: 0, ...S_FILM },
      { x: 0.3, y: 0.66, w: 0.4, h: 0.3, rotation: 0, ...S_FILM },
    ]
  },
  {
    id: 'f-strip-horiz',
    name: 'Film Strip (H)',
    slots: [
      { x: 0.02, y: 0.3, w: 0.3, h: 0.4, rotation: 0, ...S_FILM },
      { x: 0.34, y: 0.3, w: 0.3, h: 0.4, rotation: 0, ...S_FILM },
      { x: 0.66, y: 0.3, w: 0.3, h: 0.4, rotation: 0, ...S_FILM },
    ]
  },
  {
    id: 'f-tilted-strip',
    name: 'Cinema Tilt',
    slots: [
      { x: 0.1, y: 0.1, w: 0.35, h: 0.35, rotation: -15, ...S_FILM },
      { x: 0.35, y: 0.35, w: 0.35, h: 0.35, rotation: -15, ...S_FILM },
      { x: 0.6, y: 0.6, w: 0.35, h: 0.35, rotation: -15, ...S_FILM },
    ]
  },
  {
    id: 'f-double-feature',
    name: 'Double Feature',
    slots: [
      { x: 0.1, y: 0.15, w: 0.5, h: 0.7, rotation: -5, zIndex: 1, ...S_FILM },
      { x: 0.4, y: 0.15, w: 0.5, h: 0.7, rotation: 5, zIndex: 2, ...S_FILM },
    ]
  },
  {
    id: 'f-quad-grid',
    name: 'Film Grid 4',
    slots: [
      { x: 0.05, y: 0.05, w: 0.42, h: 0.42, ...S_FILM },
      { x: 0.53, y: 0.05, w: 0.42, h: 0.42, ...S_FILM },
      { x: 0.05, y: 0.53, w: 0.42, h: 0.42, ...S_FILM },
      { x: 0.53, y: 0.53, w: 0.42, h: 0.42, ...S_FILM },
    ]
  },
  {
    id: 'f-scatter-5',
    name: 'Film Scatter',
    slots: [
      { x: 0.1, y: 0.1, w: 0.3, h: 0.3, rotation: -10, ...S_FILM },
      { x: 0.6, y: 0.1, w: 0.3, h: 0.3, rotation: 10, ...S_FILM },
      { x: 0.35, y: 0.35, w: 0.3, h: 0.3, rotation: 0, zIndex: 5, ...S_FILM },
      { x: 0.1, y: 0.6, w: 0.3, h: 0.3, rotation: 10, ...S_FILM },
      { x: 0.6, y: 0.6, w: 0.3, h: 0.3, rotation: -10, ...S_FILM },
    ]
  },

  // ==============================
  // 3. ELEGANT / MAGAZINE (15-24)
  // ==============================
  {
    id: 'm-hero-overlap',
    name: 'Editorial Hero',
    slots: [
      { x: 0, y: 0, w: 0.6, h: 1, ...S_MINIMAL },
      { x: 0.5, y: 0.2, w: 0.4, h: 0.3, zIndex: 2, ...S_CARD },
      { x: 0.5, y: 0.55, w: 0.4, h: 0.3, zIndex: 3, ...S_CARD },
    ]
  },
  {
    id: 'm-classic-3',
    name: 'Classic Three',
    slots: [
      { x: 0.05, y: 0.1, w: 0.55, h: 0.8, zIndex: 1, ...S_CARD },
      { x: 0.55, y: 0.05, w: 0.4, h: 0.4, zIndex: 2, ...S_CARD },
      { x: 0.55, y: 0.55, w: 0.4, h: 0.4, zIndex: 3, ...S_CARD },
    ]
  },
  {
    id: 'm-central-focus',
    name: 'Center Focus',
    slots: [
      { x: 0.2, y: 0.15, w: 0.6, h: 0.7, zIndex: 10, ...S_CARD },
      { x: 0.05, y: 0.25, w: 0.3, h: 0.5, rotation: -5, zIndex: 1, ...S_MINIMAL },
      { x: 0.65, y: 0.25, w: 0.3, h: 0.5, rotation: 5, zIndex: 2, ...S_MINIMAL },
    ]
  },
  {
    id: 'm-grid-offset',
    name: 'Offset Grid',
    slots: [
      { x: 0.1, y: 0.05, w: 0.35, h: 0.4, ...S_CARD },
      { x: 0.55, y: 0.15, w: 0.35, h: 0.4, ...S_CARD },
      { x: 0.1, y: 0.5, w: 0.35, h: 0.4, ...S_CARD },
      { x: 0.55, y: 0.6, w: 0.35, h: 0.4, ...S_CARD },
    ]
  },
  {
    id: 'm-panoramic-split',
    name: 'Pano Split',
    slots: [
      { x: 0.05, y: 0.2, w: 0.28, h: 0.6, borderRadius: '50px', ...S_MINIMAL },
      { x: 0.36, y: 0.15, w: 0.28, h: 0.7, borderRadius: '50px', ...S_MINIMAL },
      { x: 0.67, y: 0.2, w: 0.28, h: 0.6, borderRadius: '50px', ...S_MINIMAL },
    ]
  },
  {
    id: 'm-diamond-4',
    name: 'Diamond 4',
    slots: [
      { x: 0.35, y: 0.02, w: 0.3, h: 0.3, rotation: 45, borderRadius: '15px', ...S_CARD },
      { x: 0.15, y: 0.35, w: 0.3, h: 0.3, rotation: 45, borderRadius: '15px', ...S_CARD },
      { x: 0.55, y: 0.35, w: 0.3, h: 0.3, rotation: 45, borderRadius: '15px', ...S_CARD },
      { x: 0.35, y: 0.68, w: 0.3, h: 0.3, rotation: 45, borderRadius: '15px', ...S_CARD },
    ]
  },
  {
    id: 'm-stairs',
    name: 'Step Down',
    slots: [
      { x: 0.05, y: 0.05, w: 0.25, h: 0.4, ...S_CARD },
      { x: 0.25, y: 0.2, w: 0.25, h: 0.4, zIndex: 2, ...S_CARD },
      { x: 0.45, y: 0.35, w: 0.25, h: 0.4, zIndex: 3, ...S_CARD },
      { x: 0.65, y: 0.5, w: 0.25, h: 0.4, zIndex: 4, ...S_CARD },
    ]
  },
  {
    id: 'm-overlap-3',
    name: 'Overlap 3',
    slots: [
      { x: 0.1, y: 0.1, w: 0.5, h: 0.5, zIndex: 1, ...S_CARD },
      { x: 0.3, y: 0.3, w: 0.5, h: 0.5, zIndex: 2, ...S_CARD },
      { x: 0.4, y: 0.1, w: 0.3, h: 0.3, zIndex: 3, ...S_CARD },
    ]
  },
  {
    id: 'm-mosaic-5',
    name: 'Mosaic 5',
    slots: [
      { x: 0, y: 0, w: 0.33, h: 1, ...S_MINIMAL },
      { x: 0.33, y: 0, w: 0.34, h: 0.5, ...S_MINIMAL },
      { x: 0.33, y: 0.5, w: 0.34, h: 0.5, ...S_MINIMAL },
      { x: 0.67, y: 0, w: 0.33, h: 0.33, ...S_MINIMAL },
      { x: 0.67, y: 0.33, w: 0.33, h: 0.67, ...S_MINIMAL },
    ]
  },
  {
    id: 'm-asym',
    name: 'Asymmetry',
    slots: [
      { x: 0.05, y: 0.05, w: 0.6, h: 0.6, ...S_CARD },
      { x: 0.7, y: 0.05, w: 0.25, h: 0.25, ...S_CARD },
      { x: 0.7, y: 0.35, w: 0.25, h: 0.25, ...S_CARD },
      { x: 0.05, y: 0.7, w: 0.25, h: 0.25, ...S_CARD },
      { x: 0.35, y: 0.7, w: 0.6, h: 0.25, ...S_CARD },
    ]
  },

  // ==============================
  // 4. SHAPES & GEOMETRIC (25-35)
  // ==============================
  {
    id: 's-circles-3',
    name: 'Bubble Trio',
    slots: [
      { x: 0.1, y: 0.2, w: 0.4, h: 0.4, ...S_CIRCLE },
      { x: 0.5, y: 0.2, w: 0.4, h: 0.4, ...S_CIRCLE },
      { x: 0.3, y: 0.5, w: 0.4, h: 0.4, ...S_CIRCLE },
    ]
  },
  {
    id: 's-circles-5',
    name: 'Olympic 5',
    slots: [
      { x: 0.05, y: 0.1, w: 0.3, h: 0.3, ...S_CIRCLE },
      { x: 0.35, y: 0.1, w: 0.3, h: 0.3, ...S_CIRCLE },
      { x: 0.65, y: 0.1, w: 0.3, h: 0.3, ...S_CIRCLE },
      { x: 0.2, y: 0.35, w: 0.3, h: 0.3, ...S_CIRCLE },
      { x: 0.5, y: 0.35, w: 0.3, h: 0.3, ...S_CIRCLE },
    ]
  },
  {
    id: 's-rounded-rects',
    name: 'Rounded Grid',
    slots: [
      { x: 0.05, y: 0.05, w: 0.43, h: 0.43, ...S_ROUNDED },
      { x: 0.52, y: 0.05, w: 0.43, h: 0.43, ...S_ROUNDED },
      { x: 0.05, y: 0.52, w: 0.43, h: 0.43, ...S_ROUNDED },
      { x: 0.52, y: 0.52, w: 0.43, h: 0.43, ...S_ROUNDED },
    ]
  },
  {
    id: 's-honeycomb-sim',
    name: 'Honeycomb',
    slots: [
      { x: 0.2, y: 0.05, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.5, y: 0.05, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.05, y: 0.3, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.35, y: 0.3, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.65, y: 0.3, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.2, y: 0.55, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.5, y: 0.55, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
    ]
  },
  {
    id: 's-pill-vertical',
    name: 'Pillars',
    slots: [
      { x: 0.05, y: 0.05, w: 0.2, h: 0.9, borderRadius: '100px', ...S_CARD },
      { x: 0.28, y: 0.05, w: 0.2, h: 0.9, borderRadius: '100px', ...S_CARD },
      { x: 0.52, y: 0.05, w: 0.2, h: 0.9, borderRadius: '100px', ...S_CARD },
      { x: 0.75, y: 0.05, w: 0.2, h: 0.9, borderRadius: '100px', ...S_CARD },
    ]
  },
  {
    id: 's-flower',
    name: 'Flower',
    slots: [
      { x: 0.35, y: 0.35, w: 0.3, h: 0.3, borderRadius: '50%', zIndex: 10, ...S_CARD },
      { x: 0.35, y: 0.05, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.35, y: 0.65, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.05, y: 0.35, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
      { x: 0.65, y: 0.35, w: 0.3, h: 0.3, borderRadius: '50%', ...S_CARD },
    ]
  },
  {
    id: 's-lens-overlay',
    name: 'Lens Overlay',
    slots: [
      { x: 0, y: 0, w: 1, h: 1, borderRadius: '0', borderWidth: 0 },
      { x: 0.25, y: 0.25, w: 0.5, h: 0.5, ...S_CIRCLE, borderWidth: 10, borderColor: 'rgba(255,255,255,0.4)' },
    ]
  },
  {
    id: 's-grid-circle-mix',
    name: 'Grid & Circle',
    slots: [
      { x: 0.05, y: 0.05, w: 0.4, h: 0.9, ...S_CARD },
      { x: 0.5, y: 0.05, w: 0.45, h: 0.45, ...S_CARD },
      { x: 0.5, y: 0.55, w: 0.45, h: 0.4, ...S_CIRCLE },
    ]
  },
  {
    id: 's-arch',
    name: 'Archway',
    slots: [
      { x: 0.05, y: 0.2, w: 0.2, h: 0.6, borderRadius: '100px 100px 0 0', ...S_CARD },
      { x: 0.28, y: 0.1, w: 0.2, h: 0.7, borderRadius: '100px 100px 0 0', ...S_CARD },
      { x: 0.52, y: 0.1, w: 0.2, h: 0.7, borderRadius: '100px 100px 0 0', ...S_CARD },
      { x: 0.75, y: 0.2, w: 0.2, h: 0.6, borderRadius: '100px 100px 0 0', ...S_CARD },
    ]
  },
  {
    id: 's-diagonal-pills',
    name: 'Slanted Pills',
    slots: [
      { x: 0.1, y: 0.1, w: 0.25, h: 0.6, rotation: -45, borderRadius: '50px', ...S_CARD },
      { x: 0.3, y: 0.3, w: 0.25, h: 0.6, rotation: -45, borderRadius: '50px', ...S_CARD },
      { x: 0.5, y: 0.5, w: 0.25, h: 0.6, rotation: -45, borderRadius: '50px', ...S_CARD },
    ]
  },

  // ==============================
  // 5. CHAOS & ARTISTIC (36-46)
  // ==============================
  {
    id: 'c-messy-desk-large',
    name: 'Messy Desk',
    slots: [
      { x: 0.05, y: 0.05, w: 0.4, h: 0.3, rotation: 5, ...S_POLAROID },
      { x: 0.5, y: 0.1, w: 0.4, h: 0.5, rotation: -3, ...S_POLAROID },
      { x: 0.1, y: 0.4, w: 0.5, h: 0.5, rotation: -10, zIndex: 5, ...S_POLAROID },
      { x: 0.6, y: 0.6, w: 0.3, h: 0.3, rotation: 15, ...S_POLAROID },
      { x: 0.05, y: 0.65, w: 0.3, h: 0.3, rotation: 8, ...S_POLAROID },
    ]
  },
  {
    id: 'c-spiral',
    name: 'Spiral',
    slots: [
      { x: 0.4, y: 0.4, w: 0.2, h: 0.2, rotation: 0, zIndex: 10, ...S_CARD },
      { x: 0.4, y: 0.2, w: 0.2, h: 0.2, rotation: 15, zIndex: 4, ...S_CARD },
      { x: 0.6, y: 0.4, w: 0.2, h: 0.2, rotation: 30, zIndex: 3, ...S_CARD },
      { x: 0.4, y: 0.6, w: 0.2, h: 0.2, rotation: 45, zIndex: 2, ...S_CARD },
      { x: 0.2, y: 0.4, w: 0.2, h: 0.2, rotation: 60, zIndex: 1, ...S_CARD },
    ]
  },
  {
    id: 'c-butterfly',
    name: 'Butterfly',
    slots: [
      { x: 0.1, y: 0.1, w: 0.4, h: 0.4, rotation: -15, ...S_CARD },
      { x: 0.5, y: 0.1, w: 0.4, h: 0.4, rotation: 15, ...S_CARD },
      { x: 0.1, y: 0.5, w: 0.4, h: 0.4, rotation: 15, ...S_CARD },
      { x: 0.5, y: 0.5, w: 0.4, h: 0.4, rotation: -15, ...S_CARD },
    ]
  },
  {
    id: 'c-checker-tilted',
    name: 'Tilted Checker',
    slots: [
      { x: 0.2, y: 0, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
      { x: 0.5, y: 0, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
      { x: 0.2, y: 0.3, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
      { x: 0.5, y: 0.3, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
      { x: 0.2, y: 0.6, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
      { x: 0.5, y: 0.6, w: 0.3, h: 0.3, rotation: 15, ...S_CARD },
    ]
  },
  {
    id: 'c-corner-fan',
    name: 'Corner Fan',
    slots: [
      { x: -0.1, y: -0.1, w: 0.5, h: 0.5, rotation: 0, zIndex: 5, ...S_POLAROID },
      { x: 0.2, y: 0.1, w: 0.3, h: 0.4, rotation: 10, ...S_POLAROID },
      { x: 0.4, y: 0.2, w: 0.3, h: 0.4, rotation: 20, ...S_POLAROID },
      { x: 0.6, y: 0.3, w: 0.3, h: 0.4, rotation: 30, ...S_POLAROID },
      { x: 0.7, y: 0.5, w: 0.3, h: 0.4, rotation: 40, ...S_POLAROID },
    ]
  },
  {
    id: 'c-pyramid',
    name: 'Pyramid',
    slots: [
      { x: 0.35, y: 0.05, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.2, y: 0.35, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.5, y: 0.35, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.05, y: 0.65, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.35, y: 0.65, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.65, y: 0.65, w: 0.3, h: 0.3, ...S_CARD },
    ]
  },
  {
    id: 'c-x-marks',
    name: 'The X',
    slots: [
      { x: 0.05, y: 0.05, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.65, y: 0.05, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.35, y: 0.35, w: 0.3, h: 0.3, zIndex: 10, ...S_CARD },
      { x: 0.05, y: 0.65, w: 0.3, h: 0.3, ...S_CARD },
      { x: 0.65, y: 0.65, w: 0.3, h: 0.3, ...S_CARD },
    ]
  },
  {
    id: 'c-big-little',
    name: 'Big & Little',
    slots: [
      { x: 0.05, y: 0.05, w: 0.6, h: 0.9, ...S_POLAROID },
      { x: 0.7, y: 0.05, w: 0.25, h: 0.25, rotation: 5, ...S_POLAROID },
      { x: 0.7, y: 0.35, w: 0.25, h: 0.25, rotation: -2, ...S_POLAROID },
      { x: 0.7, y: 0.65, w: 0.25, h: 0.25, rotation: 3, ...S_POLAROID },
    ]
  },
  {
    id: 'c-random-7',
    name: 'Random 7',
    slots: [
      { x: 0.1, y: 0.1, w: 0.2, h: 0.2, rotation: -10, ...S_CARD },
      { x: 0.4, y: 0.05, w: 0.2, h: 0.2, rotation: 5, ...S_CARD },
      { x: 0.7, y: 0.1, w: 0.2, h: 0.2, rotation: 10, ...S_CARD },
      { x: 0.05, y: 0.4, w: 0.2, h: 0.2, rotation: 15, ...S_CARD },
      { x: 0.75, y: 0.4, w: 0.2, h: 0.2, rotation: -5, ...S_CARD },
      { x: 0.2, y: 0.7, w: 0.2, h: 0.2, rotation: -15, ...S_CARD },
      { x: 0.5, y: 0.65, w: 0.2, h: 0.2, rotation: 0, zIndex: 10, ...S_CARD },
    ]
  },
  {
    id: 'c-insta-grid',
    name: 'Insta Grid (9)',
    slots: [
      { x: 0.1, y: 0.1, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.375, y: 0.1, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.65, y: 0.1, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.1, y: 0.375, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.375, y: 0.375, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.65, y: 0.375, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.1, y: 0.65, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.375, y: 0.65, w: 0.25, h: 0.25, ...S_MINIMAL },
      { x: 0.65, y: 0.65, w: 0.25, h: 0.25, ...S_MINIMAL },
    ]
  },
  {
    id: 'c-floating-diamonds',
    name: 'Float Diamonds',
    slots: [
      { x: 0.2, y: 0.1, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
      { x: 0.6, y: 0.1, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
      { x: 0.4, y: 0.3, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
      { x: 0.2, y: 0.5, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
      { x: 0.6, y: 0.5, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
      { x: 0.4, y: 0.7, w: 0.2, h: 0.2, rotation: 45, ...S_CARD },
    ]
  }
];