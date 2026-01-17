export interface TemplateSlot {
  x: number; // Percentage 0-1
  y: number; // Percentage 0-1
  w: number; // Percentage 0-1
  h: number; // Percentage 0-1
  rotation?: number; 
  borderRadius?: string; 
  zIndex?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowBlur?: number;
}

export interface Template {
  id: string;
  name: string;
  slots: TemplateSlot[];
  category?: 'mosaic' | 'artistic';
}

// --- STYLES ---

const MOSAIC_STYLE = { 
  borderWidth: 0, 
  borderColor: 'transparent', 
  shadowBlur: 0, 
  borderRadius: '0', 
  rotation: 0 
};

const ARTISTIC_STYLE = {
  borderWidth: 6,
  borderColor: '#ffffff',
  shadowBlur: 15,
  borderRadius: '50%',
};

// --- RANDOM HELPER ---
let seed = 42;
function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// ==========================================
// 1. MOSAIC GENERATOR (Existing)
// ==========================================

function splitRect(rect: {x:number, y:number, w:number, h:number}, isVertical: boolean, ratio: number) {
    if (isVertical) {
        return [
            { ...rect, w: rect.w * ratio },
            { ...rect, x: rect.x + rect.w * ratio, w: rect.w * (1 - ratio) }
        ];
    } else {
        return [
            { ...rect, h: rect.h * ratio },
            { ...rect, y: rect.y + rect.h * ratio, h: rect.h * (1 - ratio) }
        ];
    }
}

function generateMosaics(countPerLevel: number): Template[] {
    const generated: Template[] = [];
    
    // Grids
    [2, 3, 4, 5].forEach(size => {
        const slots = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                slots.push({ x: c/size, y: r/size, w: 1/size, h: 1/size, ...MOSAIC_STYLE });
            }
        }
        generated.push({ id: `grid-${size}x${size}`, name: `${size}x${size} Grid`, slots, category: 'mosaic' });
    });

    // Algorithmic Split
    for (let n = 2; n <= 10; n++) {
        for (let i = 0; i < countPerLevel; i++) {
            let rects = [{ x: 0, y: 0, w: 1, h: 1 }];
            for (let split = 0; split < n - 1; split++) {
                rects.sort((a, b) => (b.w * b.h) - (a.w * a.h));
                const targetIndex = 0; 
                const target = rects[targetIndex];
                rects.splice(targetIndex, 1);
                const isVertical = target.w > target.h ? true : (target.h > target.w ? false : random() > 0.5);
                const snapRatios = [0.333, 0.5, 0.666];
                const ratio = random() > 0.3 ? snapRatios[Math.floor(random() * snapRatios.length)] : 0.3 + (random() * 0.4);
                const [r1, r2] = splitRect(target, isVertical, ratio);
                rects.push(r1, r2);
            }
            generated.push({
                id: `gen-mos-${n}-${i}`,
                name: `Mosaic ${n}-${i + 1}`,
                slots: rects.map(r => ({ ...r, ...MOSAIC_STYLE })),
                category: 'mosaic'
            });
        }
    }
    return generated;
}

// ==========================================
// 2. ARTISTIC GENERATOR (New - 150+ Items)
// ==========================================

function generateFlowers(): Template[] {
    const templates: Template[] = [];
    
    // Simple Flowers (1 center + N around)
    for (let n = 3; n <= 12; n++) {
        const slots: TemplateSlot[] = [];
        // Center
        slots.push({ x: 0.3, y: 0.3, w: 0.4, h: 0.4, zIndex: 20, ...ARTISTIC_STYLE });
        
        // Petals
        const radius = 0.35;
        const size = 0.25;
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2;
            slots.push({
                x: 0.5 + Math.cos(angle) * radius - size/2,
                y: 0.5 + Math.sin(angle) * radius - size/2,
                w: size,
                h: size,
                zIndex: 10,
                ...ARTISTIC_STYLE
            });
        }
        templates.push({ id: `art-flower-${n}`, name: `Flower ${n}`, slots, category: 'artistic' });
    }

    // Double Layer Flowers
    for (let n = 5; n <= 10; n++) {
        const slots: TemplateSlot[] = [];
        // Center
        slots.push({ x: 0.35, y: 0.35, w: 0.3, h: 0.3, zIndex: 30, ...ARTISTIC_STYLE });
        
        // Inner Petals
        const r1 = 0.25;
        const s1 = 0.2;
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2;
            slots.push({
                x: 0.5 + Math.cos(angle) * r1 - s1/2,
                y: 0.5 + Math.sin(angle) * r1 - s1/2,
                w: s1,
                h: s1,
                zIndex: 20,
                ...ARTISTIC_STYLE
            });
        }

        // Outer Petals
        const r2 = 0.4;
        const s2 = 0.25;
        for (let i = 0; i < n; i++) {
             // Offset angle for second layer
            const angle = ((i + 0.5) / n) * Math.PI * 2;
            slots.push({
                x: 0.5 + Math.cos(angle) * r2 - s2/2,
                y: 0.5 + Math.sin(angle) * r2 - s2/2,
                w: s2,
                h: s2,
                zIndex: 10,
                ...ARTISTIC_STYLE
            });
        }
        templates.push({ id: `art-dbl-flower-${n}`, name: `Dbl Flower ${n}`, slots, category: 'artistic' });
    }

    return templates;
}

function generateSpirals(count: number): Template[] {
    const templates: Template[] = [];
    for (let i = 0; i < count; i++) {
        const numItems = 5 + Math.floor(random() * 8); // 5 to 12 items
        const slots: TemplateSlot[] = [];
        let angle = 0;
        let radius = 0.1;
        const sizeBase = 0.2;
        
        for (let j = 0; j < numItems; j++) {
            const size = sizeBase + (j * 0.01);
            slots.push({
                x: 0.5 + Math.cos(angle) * radius - size/2,
                y: 0.5 + Math.sin(angle) * radius - size/2,
                w: size,
                h: size,
                zIndex: j,
                ...ARTISTIC_STYLE
            });
            angle += 0.8 + (random() * 0.5); // Increment angle
            radius += 0.06; // Increment radius
        }
        templates.push({ id: `art-spiral-${i}`, name: `Spiral ${i+1}`, slots, category: 'artistic' });
    }
    return templates;
}

function generateBubbles(count: number): Template[] {
    const templates: Template[] = [];
    for (let i = 0; i < count; i++) {
        const numItems = 6 + Math.floor(random() * 10); // 6 to 15 items
        const slots: TemplateSlot[] = [];
        
        for (let j = 0; j < numItems; j++) {
            const size = 0.15 + (random() * 0.2); // Random size
            // Random pos concentrated in center
            const cx = 0.5 + (random() - 0.5) * 0.7;
            const cy = 0.5 + (random() - 0.5) * 0.7;
            
            slots.push({
                x: cx - size/2,
                y: cy - size/2,
                w: size,
                h: size,
                zIndex: Math.floor(random() * 10),
                ...ARTISTIC_STYLE,
                // Some might vary in border width for "Bubble" effect
                borderWidth: 4 + Math.floor(random() * 6)
            });
        }
        templates.push({ id: `art-bubble-${i}`, name: `Bubbles ${i+1}`, slots, category: 'artistic' });
    }
    return templates;
}

function generateChains(count: number): Template[] {
    const templates: Template[] = [];
    
    // Sine Wave Chains
    for (let i = 0; i < count/2; i++) {
        const numItems = 5 + i;
        const slots: TemplateSlot[] = [];
        const size = 0.25;
        for(let j=0; j<numItems; j++) {
            const progress = j / (numItems - 1);
            const x = 0.1 + (progress * 0.8) - size/2;
            const y = 0.5 + Math.sin(progress * Math.PI * 2) * 0.2 - size/2;
            slots.push({x, y, w:size, h:size, zIndex: j, ...ARTISTIC_STYLE});
        }
        templates.push({ id: `art-wave-${i}`, name: `Wave ${i+1}`, slots, category: 'artistic' });
    }

    // Circle Chains (Ring)
    for (let i = 0; i < count/2; i++) {
        const numItems = 6 + i;
        const slots: TemplateSlot[] = [];
        const size = 0.25;
        const radius = 0.35;
        for(let j=0; j<numItems; j++) {
            const angle = (j / numItems) * Math.PI * 2;
            const x = 0.5 + Math.cos(angle) * radius - size/2;
            const y = 0.5 + Math.sin(angle) * radius - size/2;
            slots.push({x, y, w:size, h:size, zIndex: j, ...ARTISTIC_STYLE});
        }
        templates.push({ id: `art-ring-${i}`, name: `Ring ${i+1}`, slots, category: 'artistic' });
    }
    
    return templates;
}

function generateCorners(count: number): Template[] {
    const templates: Template[] = [];
    for (let i = 0; i < count; i++) {
        const slots: TemplateSlot[] = [];
        // Big one in corner
        slots.push({ x: -0.1, y: -0.1, w: 0.6, h: 0.6, zIndex: 1, ...ARTISTIC_STYLE });
        // Fan out
        const numFan = 4 + Math.floor(random() * 4);
        for(let j=0; j<numFan; j++) {
             const angle = (j/numFan) * (Math.PI/2); // 0 to 90 degrees
             const dist = 0.5 + (random() * 0.2);
             const size = 0.25;
             slots.push({
                 x: Math.cos(angle) * dist - size/2,
                 y: Math.sin(angle) * dist - size/2,
                 w: size, h: size, zIndex: 5+j,
                 ...ARTISTIC_STYLE
             });
        }
        templates.push({ id: `art-corner-${i}`, name: `Corner Fan ${i+1}`, slots, category: 'artistic' });
    }
    return templates;
}

const buildCollection = () => {
    seed = 500;
    
    const mosaics = generateMosaics(20); // ~200
    
    let artistic: Template[] = [];
    artistic = artistic.concat(generateFlowers()); // ~20
    artistic = artistic.concat(generateSpirals(30)); // 30
    artistic = artistic.concat(generateBubbles(40)); // 40
    artistic = artistic.concat(generateChains(30)); // 30
    artistic = artistic.concat(generateCorners(30)); // 30
    
    return {
        mosaics,
        artistic
    };
}

const collection = buildCollection();

export const MOSAIC_TEMPLATES = collection.mosaics;
export const ARTISTIC_TEMPLATES = collection.artistic;
// Combined for default if needed, but we will use separate in App
export const TEMPLATES = [...collection.mosaics, ...collection.artistic];