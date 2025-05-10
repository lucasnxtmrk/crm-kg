// app/[locale]/page.tsx ou app/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    } else if (status === "unauthenticated") {
      router.replace("/pt/auth/login");
    }
  }, [status, router]);

  return null;
}
