import { UndoIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

type SignatureBlockProps = {
  setNext: Dispatch<SetStateAction<boolean>>;
};

export const SignatureBlock: React.FC<SignatureBlockProps> = ({
  setNext,
}: SignatureBlockProps) => {
  const canvasRef = useRef<SignatureCanvas | null>(null);
  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showPencil, setShowPencil] = useState(false);
  const divRef = useRef<any>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;
    const boundingRect = divRef?.current?.getBoundingClientRect();
    setPosition({
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-white">Sign below:</p>
        <UndoIcon
          className="size-10 cursor-pointer p-2 text-white/50 hover:text-white"
          onClick={() => {
            setNext(false);
            clearCanvas();
          }}
        />
      </div>
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setShowPencil(true)}
        onMouseLeave={() => setShowPencil(false)}
        onMouseDownCapture={() => setNext(true)}
        onTouchStart={() => setNext(true)} // For mobile
        ref={divRef}
        onMouseMove={handleMouseMove}
      >
        <SignatureCanvas
          ref={canvasRef}
          penColor="white"
          canvasProps={{
            className:
              'w-full h-60 sigCanvas border border-white/40 bg-white/10 rounded-xl cursor-none',
          }}
        />
        {/* pencil icon */}
        <div
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y - 30,
            opacity: showPencil ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
            height: 30,
            width: 30,
          }}
        >
          <div
            style={{
              width: 3,
              height: 3,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 1,
              left: 1,
            }}
          />
          <div
            style={{
              transform: 'rotate(45deg)',
              height: 20,
              width: 4,
              position: 'absolute',
              backgroundColor: 'white',
              bottom: 0,
              left: 8,
            }}
          />
        </div>
        {/* pencil icon */}
      </div>
    </div>
  );
};
