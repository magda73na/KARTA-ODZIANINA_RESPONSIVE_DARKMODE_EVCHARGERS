import { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  revealThreshold?: number;
  onReveal?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ScratchCard({
  width = 300,
  height = 200,
  coverColor = 'hsl(var(--primary))',
  revealThreshold = 50,
  onReveal,
  children,
  className,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Fill with cover color
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);

    // Add decorative pattern
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎲 Zdrap i wygraj! 🎲', width / 2, height / 2 - 10);
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Przeciągnij palcem lub myszką', width / 2, height / 2 + 20);
  }, [width, height, coverColor]);

  // Calculate scratched percentage
  const calculateScratchedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparent++;
      }
    }

    return (transparent / total) * 100;
  }, [width, height]);

  // Scratch function
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    const percent = calculateScratchedPercent();
    setScratchedPercent(percent);

    if (percent >= revealThreshold && !isRevealed) {
      setIsRevealed(true);
      // Animate full reveal
      ctx.clearRect(0, 0, width, height);
      onReveal?.();
    }
  }, [isRevealed, calculateScratchedPercent, revealThreshold, width, height, onReveal]);

  // Get position from event
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  }, [getPosition, scratch]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  }, [isDrawing, getPosition, scratch]);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-lg select-none",
        className
      )}
      style={{ width, height }}
    >
      {/* Prize content underneath */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30"
        aria-hidden={!isRevealed}
      >
        {children}
      </div>

      {/* Scratch canvas on top */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 cursor-crosshair touch-none transition-opacity duration-500",
          isRevealed && "opacity-0 pointer-events-none"
        )}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        aria-label="Zdrapka - przeciągnij aby zdrapać"
        role="img"
      />

      {/* Progress indicator */}
      {!isRevealed && scratchedPercent > 0 && (
        <div 
          className="absolute bottom-2 left-2 right-2 h-1 bg-background/30 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <div 
            className="h-full bg-background transition-all duration-200"
            style={{ width: `${Math.min(100, (scratchedPercent / revealThreshold) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
