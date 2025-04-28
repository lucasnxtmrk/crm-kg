import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Deletar um cadastro (relação entre influenciador e plataforma)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.cadastros_influenciadores.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Cadastro removido com sucesso!" });
}
