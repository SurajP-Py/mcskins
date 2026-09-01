"use client";

import { useEffect, useRef } from "react";
import * as skinview3d from "skinview3d";

interface SkinViewerProps {
  skinUrl: string;
  capeUrl?: string;
  width?: number;
  height?: number;
}

export default function SkinViewer({
  skinUrl,
  capeUrl,
  width = 300,
  height = 400,
}: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the 3D viewer
    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width: width,
      height: height,
      skin: skinUrl,
    });

    viewerRef.current = viewer;

    // Load cape if provided
    if (capeUrl) {
      viewer.loadCape(capeUrl);
    }

    // Cleanup on component unmount to prevent canvas & memory leaks
    return () => {
      viewer.dispose();
    };
  }, [width, height]); // Re-initialize only if canvas dimensions change

  // Dynamically update the skin/cape without recreation
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.loadSkin(skinUrl);
    }
  }, [skinUrl]);

  useEffect(() => {
    if (viewerRef.current) {
      if (capeUrl) {
        viewerRef.current.loadCape(capeUrl);
      } else {
        viewerRef.current.loadCape(null);
      }
    }
  }, [capeUrl]);

  return (
    <div className="flex justify-center items-center border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden p-4">
      <canvas ref={canvasRef} />
    </div>
  );
}
