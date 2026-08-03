"use client";

import { usePathname } from "next/navigation";

const WHATSAPP = "https://wa.me/923355540093";
const INSTAGRAM = "https://instagram.com/thesharks0";

export function FloatingContact() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin67")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="group grid place-items-center h-12 w-12 rounded-full text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg,#feda75,#d62976 45%,#962fbf 80%,#4f5bd5)" }}
      >
        <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
          <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .46 1.4.9.44.4.7.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.46 1-.9 1.4-.4.44-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.46-1.4-.9-.44-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.46-1 .9-1.4.4-.44.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25zm0 11.1A4.35 4.35 0 1 1 16.35 12 4.35 4.35 0 0 1 12 16.35zM18.9 5.1a1.58 1.58 0 1 0 1.58 1.58A1.58 1.58 0 0 0 18.9 5.1z" />
        </svg>
      </a>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group relative grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.7)] transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" style={{ animationDuration: "2.5s" }} />
        <svg viewBox="0 0 24 24" className="relative size-7 fill-current" aria-hidden>
          <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.46-.15-.65.15-.2.3-.75.94-.92 1.14-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3 0-.45.13-.6.13-.13.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.57-.9-2.15-.24-.57-.48-.5-.65-.5h-.56c-.2 0-.5.07-.77.37-.26.3-1 1-1 2.42s1.03 2.8 1.17 3c.15.2 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.22 1.31.19 1.8.12.55-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.2-.56-.35zM12 2a10 10 0 0 0-8.6 15.05L2 22l5.05-1.32A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3 .78.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      </a>
    </div>
  );
}
