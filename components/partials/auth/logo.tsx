'use client';
import Image from 'next/image';
import { useTheme } from "next-themes";

type LogoProps = {
  className?: string;
  variant?: "default" | "white";
};

const Logo = ({ className = "", variant }: LogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const src =
    variant === "white" || (variant === undefined && isDark)
      ? "/images/logo/logo-white.svg"
      : "/images/logo/logo.svg";

  return (
    <div className={className}>
      <Image
        src={src}
        alt="Logo"
        width={300}
        height={300}
        className="w-36"
        priority
      />
    </div>
  );
};

export default Logo;
