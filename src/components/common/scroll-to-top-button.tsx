"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={handleClick}
            aria-label="Scroll to top"
            className={`
      fixed right-6 bottom-20 sm:bottom-6 z-50 w-12 h-12 rounded-full bg-black text-white
      border-2 border-white flex items-center justify-center shadow-lg
      focus:ring-2 focus:ring-[#4A85E4] focus:outline-none
      transition-all duration-300
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      hover:scale-110 hover:shadow-xl
    `}
        >
            <span className="transition-transform duration-300 group-hover:animate-bounce">
                <ChevronUp size={28} />
            </span>
        </button>
    );
} 