import { prisma } from '@/lib/prisma';

export async function getUserByEmail(email: string) {
  return await prisma.usuarios.findUnique({
    where: { email },
  });
}
