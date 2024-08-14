"use client";
import { Icon } from "@iconify/react";

export default function Navbar() {
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-zinc-950/10 bg-white p-2 sm:px-6 py-5 sm:px-8 lg:z-10 lg:flex lg:h-16 lg:items-center lg:py-0 dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto flex w-full items-center justify-between lg:max-w-7xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              aria-label="Home"
              href="/"
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-300 animate-gradient-shine"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Story bot
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-shine {
          background-size: 200% 200%;
          animation: gradient-shine 3s linear infinite;
        }
      `}</style>
    </>
  );
}
