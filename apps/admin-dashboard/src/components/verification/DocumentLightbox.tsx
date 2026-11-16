import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222026]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#ECECF0] flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECF0] bg-[#F6F6F8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FCE8A3] text-[#8A6500] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#222026]">{documentName}</h3>
              {documentNumber && (
                <p className="text-xs text-[#8A8A93] font-mono">Doc ID: {documentNumber}</p>
              )}
            </div>
          </div>

          {/* Controls: Zoom, Rotate, Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.25, 2.5))}
              className="p-2 rounded-xl text-[#222026] hover:bg-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
              className="p-2 rounded-xl text-[#222026] hover:bg-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 rounded-xl text-[#222026] hover:bg-white transition-colors"
              title="Rotate 90deg"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 ml-2 rounded-xl text-[#222026] hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-[#222026]/5 flex items-center justify-center min-h-[350px]">
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
        <div className="px-6 py-3 border-t border-[#ECECF0] bg-white flex items-center justify-between text-xs text-[#8A8A93]">
          <span>Zoom: {Math.round(scale * 100)}% | Rotation: {rotation}°</span>
          <span className="text-[#8A6500] font-medium bg-[#FCE8A3] px-2.5 py-0.5 rounded-full">
            Official Fillcart Partner Verification Node
          </span>
        </div>
      </div>
    </div>
  );
};
