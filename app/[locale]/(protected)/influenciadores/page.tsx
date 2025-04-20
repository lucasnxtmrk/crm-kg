'use client';

import { plataformas } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/navigation"; // ou de onde exportou o createSharedPathnamesNavigation
import Image from "next/image";

export default function ListaDePlataformas() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plataformas cadastradas</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plataformas.map((plataforma) => (
              <Link
                key={plataforma.id}
                href={`/influenciadores/${plataforma.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardContent className="p-6 text-center space-y-2">
                  <Image
                    src={plataforma.imagem}
                    alt={plataforma.nome}
                    width={120}
                    height={120}
                    className="mx-auto mb-2 w-24 h-24 object-contain"
/>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
