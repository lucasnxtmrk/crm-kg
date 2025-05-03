'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatSegment(segment: string) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BasicBreadcrumb() {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  const rest = segments.slice(1);

  const [lastLabel, setLastLabel] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastSegmentName = async () => {
      if (rest.length < 2) return;

      const [tipo, id] = rest.slice(-2);
      if (!id) return;

      try {
        if (tipo === 'grupos') {
          const res = await fetch('/api/grupos');
          const grupos = await res.json();
          const grupo = grupos.find((g: any) => g.id === id);
          if (grupo) setLastLabel(grupo.nome);
        } else if (tipo === 'plataformas') {
          const res = await fetch('/api/plataformas');
          const plataformas = await res.json();
          const plataforma = plataformas.find((p: any) => p.id === id);
          if (plataforma) setLastLabel(plataforma.nome);
        }
      } catch (e) {
        console.error('Erro ao buscar nome para breadcrumb:', e);
      }
    };

    fetchLastSegmentName();
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
        </BreadcrumbItem>

        {rest.map((segment, index) => {
          const href = '/' + [locale, ...rest.slice(0, index + 1)].join('/');
          const isLast = index === rest.length - 1;

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {lastLabel || formatSegment(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formatSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
