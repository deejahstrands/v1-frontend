import Image from "next/image";
import { motion, useSpring } from "framer-motion";
import { useState, useRef } from "react";

export function CategoryCard({
  image,
  name,
  onClick,
}: {
  image: string;
  name: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Max tilt in degrees
    const maxTilt = 18;
    // Calculate tilt: opposite direction for a 'dangling' effect
    const rotateYVal = ((x - centerX) / centerX) * -maxTilt;
    const rotateXVal = ((y - centerY) / centerY) * maxTilt;
    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  }

  return (
    <div className="aspect-[3/4] h-64 md:h-80 w-full">
      <motion.div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden w-full h-full cursor-pointer"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-2xl"
          sizes="(min-width: 640px) 250px, 100vw"
        />
        {/* Default button, hidden on hover */}
        <button
          onClick={onClick}
          className={`absolute left-1/2 -translate-x-1/2 w-[80%] bottom-4 px-6 py-3 rounded-md bg-secondary text-black font-medium text-base shadow-md transition-opacity duration-200 ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          type="button"
        >
          {name}
        </button>
        {/* Custom hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40"
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <button
            onClick={onClick}
            className="px-8 py-2 rounded-full bg-primary text-white font-semibold text-lg shadow-lg"
            type="button"
          >
            View more
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
} 