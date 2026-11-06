'use client';
import Link from 'next/link';

export default function Logo({ size = 'default', showLink = true }: { size?: 'sm' | 'default' | 'lg'; showLink?: boolean }) {
  const sizeClasses = {
    sm: 'text-2xl',
    default: 'text-3xl md:text-4xl',
    lg: 'text-5xl md:text-6xl',
  };

  const LogoContent = (
    <div className={'flex items-center font-black tracking-tight ' + sizeClasses[size]}>
      {/* Colores exactos del logo Mbôlo */}
      <span className="text-emerald-400">M</span>
      <span className="text-white">b</span>
      <span className="text-pink-400">ô</span>
      <span className="text-blue-400">l</span>
      <span className="text-rose-400">o</span>
    </div>
  );

  if (showLink) {
    return (
      <Link href="https://www.mboloeg.com/" target="_blank" className="hover:opacity-80 transition-opacity">
        {LogoContent}
      </Link>
    );
  }

  return LogoContent;
}