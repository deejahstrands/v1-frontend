import Image from "next/image";
import Link from "next/link";



export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Welcome to Deejah Strands
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover our premium hair extensions and beauty products
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/shop"
          >
            Shop Now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/account"
          >
            My Account
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Admin icon"
            width={16}
            height={16}
          />
          Admin
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/shop"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Shop icon"
            width={16}
            height={16}
          />
          Shop
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/cart"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Cart icon"
            width={16}
            height={16}
          />
          Cart
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/account"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Account icon"
            width={16}
            height={16}
          />
          Account →
        </a>
      </footer>
    </div>
  );
}
