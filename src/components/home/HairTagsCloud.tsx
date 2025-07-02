"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/common/section-container";
import { useMemo, useEffect, useState } from "react";

const bgColors = [
    "bg-[#FDECEF]",
    "bg-[#DEF7EC]",
    "bg-[#E0E7FF]",
    "bg-[#FFF6DB]",
    "bg-[#E3F2FD]",
    "bg-[#F3E8FF]",
    "bg-[#FFE4E6]",
];

const hairTags = [
    "Bob Wigs",
    "Straight Hair",
    "Curly Hair",
    "Deep Wave",
    "Body Wave",
    "Pixie Cut",
    "360 Lace",
    "Full Lace",
    "Lace Front",
    "Natural Black",
    "Color Wigs",
    "Short Wigs",
    "Long Wigs",
    "Pre-plucked",
    "Transparent Lace",
    "Baby Hair",
    "Silk Base",
    "HD Lace",
    "Loose Wave",
    "Water Wave",
    "Glueless Wig",
    "Custom Units",
    "Wig Care",
    "Tape-Ins",
    "Transparent Lace",
    "Transparent Lace"
];

function pseudoRandom(seed: number) {
    return Math.abs(Math.sin(seed) * 10000) % 1;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

const ROWS = 4;

export function HairTagsCloud() {
    const isMobile = useIsMobile();
    const tagsToShow = isMobile ? hairTags.slice(0, 10) : hairTags;
    const tagsPerRow = Math.ceil(tagsToShow.length / ROWS);

    // Generate consistent animation values only once per mount
    const animatedTags = useMemo(() => {
        return tagsToShow.map((tag, i) => {
            const row = i % ROWS;
            const col = Math.floor(i / ROWS);
            const group = Math.floor(i / 6);
            const rotation = pseudoRandom(i) > 0.5 ? -15 : 15;
            const yDrop = -100 - pseudoRandom(i + 100) * 100;
            // Row vertical position
            const rowHeight = isMobile ? 40 : 70;
            const top = 20 + row * rowHeight + pseudoRandom(i + 1) * 10;
            // Sequential horizontal position with jitter
            const leftBase = (col / tagsPerRow) * 90; // spread across 90% width
            const left = 5 + leftBase + pseudoRandom(i + 2) * 4; // add jitter
            // Some tags have transparent bg
            const transparent = pseudoRandom(i + 3) > 0.7;
            const bg = transparent
                ? "bg-transparent border border-[#E0E0E0] text-white"
                : bgColors[i % bgColors.length] + " text-[#161616]";
            return {
                tag,
                groupDelay: group * 0.4,
                rotate: rotation,
                y: yDrop,
                bg,
                top,
                left,
            };
        });
    }, [isMobile, tagsToShow, tagsPerRow]);

    return (
        <section className="bg-[#161616] pt-12 w-full overflow-hidden">
            <SectionContainer>
                <div className="relative w-full h-[220px] md:h-[400px] lg:h-[440px] select-none">
                    {animatedTags.map(({ tag, groupDelay, rotate, y, bg, top, left }, i) => (
                        <motion.div
                            key={tag + i}
                            initial={{ y, opacity: 0, rotate }}
                            whileInView={{ y: 0, opacity: 1, rotate }}
                            transition={{
                                delay: groupDelay,
                                type: "spring",
                                stiffness: 100,
                                damping: 12,
                            }}
                            viewport={{ once: true, margin: "-150px" }}
                            style={{
                                position: "absolute",
                                top: `${top}px`,
                                left: `${left}%`,
                                rotate: `${rotate}deg`,
                                whiteSpace: "nowrap",
                                zIndex: 1,
                            }}
                            className={`px-5 py-2 rounded-full text-sm font-medium shadow-md backdrop-blur-sm select-none ${bg}`}
                        >
                            {tag}
                        </motion.div>
                    ))}
                </div>
            </SectionContainer>
        </section>
    );
}
