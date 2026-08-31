"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Film,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { PortfolioMedia } from "@/features/users/users.types";
import { cn } from "@/lib/utils";

interface PortfolioMediaGalleryProps {
  mediaList: (PortfolioMedia | string)[];
  className?: string;
}

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".webm",
  ".mkv",
  ".m4v",
  ".avi",
  ".3gp",
  ".ogv",
  ".flv",
  ".wmv",
];

export function getMediaUrl(media: PortfolioMedia | string): string {
  if (typeof media === "string") return media;
  return media.location || media.url || media.fileUrl || "";
}

export function getMediaName(media: PortfolioMedia | string): string {
  if (typeof media === "string") {
    const parts = media.split("/");
    return parts[parts.length - 1] || "Portfolio Item";
  }
  return media.fileName || media.name || media.originalName || "Portfolio Item";
}

export function getThumbnailUrl(media: PortfolioMedia | string): string | null {
  if (typeof media === "string") return null;

  if (media.thumbnailUrl && typeof media.thumbnailUrl === "string") {
    return media.thumbnailUrl;
  }
  if (typeof media.thumbnail === "string" && media.thumbnail.trim()) {
    return media.thumbnail;
  }
  if (media.thumbnail && typeof media.thumbnail === "object") {
    if (media.thumbnail.location) return media.thumbnail.location;
    if (media.thumbnail.url) return media.thumbnail.url;
  }
  return null;
}

export function isVideoMedia(media: PortfolioMedia | string): boolean {
  if (typeof media === "string") {
    const cleanUrl = media.split("?")[0]?.toLowerCase() || "";
    return VIDEO_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
  }

  const mimetype = (media.mimetype || media.mimeType || media.contentType || "").toLowerCase();
  if (mimetype.startsWith("video/") || mimetype.includes("video")) {
    return true;
  }

  if (media.type?.toLowerCase() === "video") {
    return true;
  }

  const url = getMediaUrl(media);
  const cleanUrl = url.split("?")[0]?.toLowerCase() || "";
  const fileName = (media.fileName || media.name || "").toLowerCase();

  return VIDEO_EXTENSIONS.some(
    (ext) => cleanUrl.endsWith(ext) || fileName.endsWith(ext)
  );
}

interface VideoThumbnailProps {
  url: string;
  name: string;
  explicitThumbnail?: string | null;
}

function VideoThumbnail({ url, name, explicitThumbnail }: VideoThumbnailProps) {
  const [duration, setDuration] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setDuration(formatDuration(video.duration));
    }
    try {
      video.currentTime = 0.001;
    } catch {}
  };

  const handleSeekedOrLoaded = () => {
    setIsLoaded(true);
  };

  const handleMouseEnter = () => {
    if (videoRef.current && isLoaded) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0.001;
      } catch {}
    }
  };

  if (explicitThumbnail) {
    return (
      <div className="relative h-full w-full bg-slate-900">
        <Image
          src={explicitThumbnail}
          alt={name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
          onError={() => setHasError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#005864] shadow-md backdrop-blur-xs transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </div>
        </div>
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
          <Film className="h-2.5 w-2.5" />
          <span>VIDEO</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full bg-slate-950"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={`${url}#t=0.001`}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleSeekedOrLoaded}
        onSeeked={handleSeekedOrLoaded}
        onError={() => setHasError(true)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
          !isLoaded && "opacity-0"
        )}
      />

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
          <Film className="h-6 w-6 animate-pulse text-slate-400" />
        </div>
      )}

      {hasError ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-2 text-center text-slate-400">
          <Film className="h-6 w-6 text-slate-400" />
          <span className="mt-1 line-clamp-1 text-[10px] text-slate-400">{name}</span>
        </div>
      ) : (
        <>
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-80 transition-opacity duration-200 group-hover:opacity-40" />

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#005864] shadow-md backdrop-blur-xs transition-all duration-200 group-hover:scale-115 group-hover:bg-white">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </div>
          </div>

          {/* Video & Duration Badge */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
            <span className="flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
              <Film className="h-2.5 w-2.5" />
              <span>VIDEO</span>
            </span>
            {duration && (
              <span className="rounded bg-black/80 px-1 py-0.5 text-[9px] font-medium text-slate-200 backdrop-blur-xs">
                {duration}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface PortfolioMediaItemProps {
  media: PortfolioMedia | string;
  index: number;
  onClick: () => void;
}

function PortfolioMediaItem({ media, index, onClick }: PortfolioMediaItemProps) {
  const [hasError, setHasError] = useState(false);
  const url = getMediaUrl(media);
  const name = getMediaName(media);
  const isVid = isVideoMedia(media);
  const explicitThumbnail = getThumbnailUrl(media);

  if (!url) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${isVid ? "video" : "image"}: ${name}`}
      className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-xs transition-all duration-200 hover:scale-[1.03] hover:border-[#005864] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#005864] focus:ring-offset-2"
    >
      {isVid ? (
        <VideoThumbnail
          url={url}
          name={name}
          explicitThumbnail={explicitThumbnail}
        />
      ) : hasError ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-2 text-center text-slate-400">
          <ImageIcon className="h-6 w-6 text-slate-400" />
          <span className="mt-1 line-clamp-1 text-[10px] font-medium text-slate-500">
            {name}
          </span>
        </div>
      ) : (
        <div className="relative h-full w-full bg-slate-100">
          <Image
            src={url}
            alt={name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            onError={() => setHasError(true)}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
        </div>
      )}
    </button>
  );
}

interface PortfolioMediaPreviewModalProps {
  mediaList: (PortfolioMedia | string)[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

function PortfolioMediaPreviewModal({
  mediaList,
  currentIndex,
  onClose,
  onSelectIndex,
}: PortfolioMediaPreviewModalProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < mediaList.length;
  const currentMedia = isOpen ? mediaList[currentIndex] : null;
  const url = currentMedia ? getMediaUrl(currentMedia) : "";
  const name = currentMedia ? getMediaName(currentMedia) : "";
  const isVid = currentMedia ? isVideoMedia(currentMedia) : false;
  const total = mediaList.length;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onSelectIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onSelectIndex((currentIndex + 1) % total);
  }, [currentIndex, total, onSelectIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentMedia) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[92vh] w-[min(900px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-0 text-white shadow-2xl sm:max-w-none gap-0"
      >
        <DialogTitle className="sr-only">
          {name ? `${isVid ? "Video" : "Image"}: ${name}` : "Portfolio Media Preview"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preview of portfolio media file
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                isVid
                  ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                  : "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40"
              )}
            >
              {isVid ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              {isVid ? "Video" : "Image"}
            </span>
            <p className="truncate text-sm font-medium text-slate-200 max-w-[300px] sm:max-w-[450px]">
              {name}
            </p>
            {total > 1 && (
              <span className="text-xs text-slate-400 shrink-0">
                ({currentIndex + 1} of {total})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              title="Open original in new tab"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={url}
              download={name}
              title="Download file"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media Viewer Body */}
        <div className="relative flex min-h-[300px] max-h-[65vh] flex-1 items-center justify-center bg-black/95 p-4 select-none">
          {isVid ? (
            <video
              key={url}
              src={url}
              controls
              autoPlay
              playsInline
              className="max-h-[60vh] max-w-full rounded-lg bg-black object-contain shadow-xl"
            />
          ) : (
            <div className="relative flex h-[55vh] w-full items-center justify-center">
              <Image
                src={url}
                alt={name}
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>
          )}

          {/* Prev / Next buttons if multiple items */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous item"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-xs transition hover:scale-110 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next item"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-xs transition hover:scale-110 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Carousel Footer */}
        {total > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800 bg-slate-900/70 p-3">
            {mediaList.map((media, idx) => {
              const itemUrl = getMediaUrl(media);
              const itemName = getMediaName(media);
              const itemIsVid = isVideoMedia(media);
              const itemThumb = getThumbnailUrl(media);
              const isSelected = idx === currentIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={cn(
                    "group relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition-all",
                    isSelected
                      ? "border-sky-400 ring-2 ring-sky-400/50"
                      : "border-slate-700 opacity-60 hover:opacity-100"
                  )}
                >
                  {itemIsVid ? (
                    itemThumb ? (
                      <Image
                        src={itemThumb}
                        alt={itemName}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <video
                        src={`${itemUrl}#t=0.001`}
                        preload="metadata"
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <Image
                      src={itemUrl}
                      alt={itemName}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  {itemIsVid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="h-3 w-3 fill-white text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PortfolioMediaGallery({
  mediaList,
  className,
}: PortfolioMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("flex flex-wrap gap-3.5", className)}>
        {mediaList.map((media, index) => (
          <PortfolioMediaItem
            key={typeof media === "string" ? `${media}-${index}` : media._id || `${getMediaUrl(media)}-${index}`}
            media={media}
            index={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      <PortfolioMediaPreviewModal
        mediaList={mediaList}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={setSelectedIndex}
      />
    </>
  );
}
