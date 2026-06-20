import { useState, useEffect, useRef } from "react";
import { Button, Icon } from "@/shared/ui";

interface ImageCropperModalProps {
  imageSrc: string;
  aspect: string;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
  onChangeAspect: (aspect: string) => void;
  fileName: string;
}

export function ImageCropperModal({
  imageSrc,
  aspect,
  onCrop,
  onCancel,
  onChangeAspect,
  fileName,
}: ImageCropperModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Get numeric aspect ratio
  const getAspectNumeric = () => {
    switch (aspect) {
      case "21-9":
        return 21 / 9;
      case "3-2":
        return 3 / 2;
      case "1-1":
        return 1;
      case "16-9":
      default:
        return 16 / 9;
    }
  };

  const numericAspect = getAspectNumeric();

  // Container dimensions (standard/fixed inside .crop-view-container)
  const containerWidth = 552; // max-width of crop-card minus padding
  const containerHeight = 320;

  // Viewport dimensions (crop box)
  let viewportWidth = containerWidth - 48;
  let viewportHeight = viewportWidth / numericAspect;
  if (viewportHeight > containerHeight - 48) {
    viewportHeight = containerHeight - 48;
    viewportWidth = viewportHeight * numericAspect;
  }

  // Update image base size to cover viewport on load or when aspect changes
  const onImageLoad = () => {
    if (!imgRef.current) return;
    const naturalWidth = imgRef.current.naturalWidth;
    const naturalHeight = imgRef.current.naturalHeight;

    let scaledWidth = viewportWidth;
    let scaledHeight = (naturalHeight / naturalWidth) * viewportWidth;

    if (scaledHeight < viewportHeight) {
      scaledHeight = viewportHeight;
      scaledWidth = (naturalWidth / naturalHeight) * viewportHeight;
    }

    setImgSize({ width: scaledWidth, height: scaledHeight });
    setX(0);
    setY(0);
    setZoom(1);
  };

  // Re-trigger size calculations on aspect ratio changes
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      onImageLoad();
    }
  }, [aspect]);

  const clampX = (val: number, currentZoom: number) => {
    const maxDragX = Math.max(0, (imgSize.width * currentZoom - viewportWidth) / 2);
    return Math.min(maxDragX, Math.max(-maxDragX, val));
  };

  const clampY = (val: number, currentZoom: number) => {
    const maxDragY = Math.max(0, (imgSize.height * currentZoom - viewportHeight) / 2);
    return Math.min(maxDragY, Math.max(-maxDragY, val));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - x, y: e.clientY - y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = clampX(e.clientX - dragStart.x, zoom);
    const newY = clampY(e.clientY - dragStart.y, zoom);
    setX(newX);
    setY(newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - x, y: touch.clientY - y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = clampX(touch.clientX - dragStart.x, zoom);
    const newY = clampY(touch.clientY - dragStart.y, zoom);
    setX(newX);
    setY(newY);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setX(clampX(x, newZoom));
    setY(clampY(y, newZoom));
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const zoomedWidth = imgSize.width * zoom;
    const zoomedHeight = imgSize.height * zoom;

    const factor = zoomedWidth / naturalWidth;

    const cropX_zoomed = (zoomedWidth - viewportWidth) / 2 - x;
    const cropY_zoomed = (zoomedHeight - viewportHeight) / 2 - y;

    const sx = cropX_zoomed / factor;
    const sy = cropY_zoomed / factor;
    const sw = viewportWidth / factor;
    const sh = viewportHeight / factor;

    // Output canvas size should match original quality but keep max limits to be efficient
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(2048, sw);
    canvas.height = Math.min(2048, sh);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: "image/jpeg" });
          onCrop(file);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const maskStyle = {
    width: `${viewportWidth}px`,
    height: `${viewportHeight}px`,
    left: `${(containerWidth - viewportWidth) / 2}px`,
    top: `${(containerHeight - viewportHeight) / 2}px`,
  };

  const imgStyle = {
    position: "absolute" as const,
    width: `${imgSize.width}px`,
    height: `${imgSize.height}px`,
    transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    transformOrigin: "center center",
    maxHeight: "none",
    maxWidth: "none",
    userSelect: "none" as const,
    pointerEvents: "none" as const,
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-card">
        <h3>Обрезка обложки</h3>

        <div
          ref={containerRef}
          className="crop-view-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              style={imgStyle}
              onLoad={onImageLoad}
            />
          )}
          <div className="crop-mask" style={maskStyle} />
        </div>

        <div className="crop-controls">
          <div className="crop-control-row">
            <label htmlFor="crop-zoom-range">Масштаб</label>
            <input
              id="crop-zoom-range"
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              className="crop-slider"
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            />
          </div>

          <div className="crop-control-row">
            <label htmlFor="crop-aspect-select">Пропорции</label>
            <select
              id="crop-aspect-select"
              className="field-select"
              style={{ flex: 1 }}
              value={aspect}
              onChange={(e) => onChangeAspect(e.target.value)}
            >
              <option value="16-9">16:9 (Стандарт)</option>
              <option value="21-9">21:9 (Широкий)</option>
              <option value="3-2">3:2 (Фото)</option>
              <option value="1-1">1:1 (Квадрат)</option>
            </select>
          </div>
        </div>

        <div className="crop-buttons">
          <Button variant="secondary" onPress={onCancel}>
            Отмена
          </Button>
          <Button onPress={handleSave}>
            <Icon name="crop" />
            Обрезать и загрузить
          </Button>
        </div>
      </div>
    </div>
  );
}
