import { ReactNode } from "react";
import BasicBreadcrumb from "@/components/breadcrumb/basic-breadcrumb";

export default function InfluenciadoresLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 p-4">
      {/* Breadcrumb padrão para todas as páginas de influenciadores */}
      <BasicBreadcrumb />
      {children}
    </div>
  );
}
