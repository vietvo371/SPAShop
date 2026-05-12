"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageWithSkeleton({
  alt = "",
  className,
  style,
  skeletonStyle,
  onLoad,
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setLoaded(true);
    onError?.(event);
  };

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "image-skeleton-shimmer 1.4s ease-in-out infinite",
            ...skeletonStyle,
          }}
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />
      <style jsx global>{`
        @keyframes image-skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}
