import Image from "next/image";

export function CategoryCard({
  image,
  name,
  onClick,
}: {
  image: string;
  name: string;
  onClick?: () => void;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden w-full h-full">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover rounded-2xl"
        sizes="(min-width: 640px) 250px, 100vw"
      />
      <button
        onClick={onClick}
        className="absolute left-1/2 -translate-x-1/2 bottom-4 px-6 py-3 rounded-md bg-secondary text-black font-medium text-base shadow-md"
        type="button"
      >
        {name}
      </button>
    </div>
  );
} 