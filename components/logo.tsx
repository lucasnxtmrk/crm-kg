'use client';
import React from "react";
import DashCodeLogo from "./dascode-logo";
import { Link } from '@/i18n/routing';
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";

const Logo = () => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  if (config.sidebar === 'compact') {
    return (
      <Link href="/dashboard/" className="flex gap-2 items-center justify-center">
        <DashCodeLogo className="text-white h-8 w-8 [&>path:nth-child(3)]:text-white [&>path:nth-child(2)]:text-white" />
      </Link>
    );
  }

  if (config.sidebar === 'two-column' || !isDesktop) return null;

  return (
    <Link href="/dashboard/" className="flex gap-2 items-center">
<DashCodeLogo className="text-white h-8 w-8 [&>path:nth-child(3)]:text-white [&>path:nth-child(2)]:text-white" />
{(!config?.collapsed || hovered) && (
        <h1 className="text-xl font-semibold text-white">
          KG Slots
        </h1>
      )}
    </Link>
  );
};

export default Logo;
