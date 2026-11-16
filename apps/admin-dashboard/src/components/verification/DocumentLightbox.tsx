import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';

interface DocumentLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  imageUrl: string;
  documentNumber?: string;
}

export const DocumentLightbox: React.FC<DocumentLightboxProps> = ({
  isOpen,
  onClose,
  documentName,
  imageUrl,
  documentNumber,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-black/[0.08] flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary text-black flex items-center justify-center">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-black">{documentName}</h3>
              {documentNumber && (
                <p className="text-xs text-black/55 font-mono">Doc ID: {documentNumber}</p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.25, 2.5))}
              className="p-2 rounded-xl text-black hover:bg-black/[0.04] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
              className="p-2 rounded-xl text-black hover:bg-black/[0.04] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 rounded-xl text-black hover:bg-black/[0.04] transition-colors"
              title="Rotate 90deg"
            >
              <RotateCw className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={onClose}
              className="p-2 ml-2 rounded-xl text-black hover:bg-black hover:text-white transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-black/[0.02] flex items-center justify-center min-h-[350px]">
          <div
            className="transition-transform duration-200 shadow-lg rounded-2xl overflow-hidden bg-white max-w-full"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt={documentName}
              className="max-h-[60vh] object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-black/[0.08] bg-white flex items-center justify-between text-xs text-black/55">
          <span>Zoom: {Math.round(scale * 100)}% | Rotation: {rotation}°</span>
          <span className="text-black font-medium bg-secondary px-2.5 py-0.5 rounded-full">
            Official Fillcart Partner Verification Node
          </span>
        </div>
      </div>
    </div>
  );
};
