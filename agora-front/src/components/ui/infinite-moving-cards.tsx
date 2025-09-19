"use client";

import { cn, formarDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    id: string;
    title: string;
    body: string;
    url: string;
    imageUrl: string;
    publishedAt: string;
    sourceName: string;
    category: string;
    PoliticOrientation: string;
    createdAt: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[350px] cursor-pointer max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-8 py-2.5 md:w-[450px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
            key={item.id}
          >
            <a href={item.url} key={item.id} target="_blank" rel="noreferrer">
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>

                {item.imageUrl && (
                  <div className="relative z-20 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="h-36 w-full object-cover"
                    />
                  </div>
                )}

                <h3 className="relative z-20 mb-2 text-base font-semibold leading-tight text-neutral-900 dark:text-white">
                  {item.title}
                </h3>

                <span className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100">
                  {item.body.length > 120
                    ? `${item.body.substring(0, 120)}...`
                    : item.body}
                </span>

                <div className="relative z-20 mt-4 flex flex-row items-center justify-between">
                  <span className="flex flex-col gap-1">
                    <span className="text-xs leading-[1.6] font-medium text-neutral-600 dark:text-gray-300">
                      {item.sourceName}
                    </span>
                    <span className="text-xs leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                      {formarDate(item.publishedAt)}
                    </span>
                  </span>

                  <span className="text-xs rounded-full bg-blue-500/20 px-2 py-1 font-medium text-blue-400">
                    {item.PoliticOrientation}
                  </span>
                </div>
              </blockquote>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
