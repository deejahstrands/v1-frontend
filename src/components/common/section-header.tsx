import { Button } from "@/components/common/button";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

export function SectionHeader({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
}: SectionHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 lg:mb-10 items-center">
      <div className="lg:col-span-3">
        <h2 className="text-2xl md:text-4xl font-ethereal font-medium text-[#1A1A1A] mb-6 lg:mb-6 capitalize">{title}</h2>
        {description && (
          <p className="text-sm md:text-base lg:text-lg text-gray-500">{description}</p>
        )}
      </div>
      {buttonText && buttonHref && (
        <div className="lg:col-span-1 flex lg:justify-end items-center">
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href={buttonHref} onClick={onButtonClick}>{buttonText}</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 