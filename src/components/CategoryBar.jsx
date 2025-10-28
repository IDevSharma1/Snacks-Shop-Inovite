import React, { useRef, useEffect } from 'react';
import bgVideo from '../assets/bg.mp4';

export default function SharedBg() {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);
  return (
    <>
      <video
        ref={videoRef}
        className="pointer-events-none fixed inset-0 w-full h-full object-cover z-0"
        autoPlay muted loop playsInline preload="metadata"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 z-10" />
    </>
  );
}
