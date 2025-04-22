'use client';

import React from 'react';
import ListaBlacklist from './components/lista/table';
import { Card } from '@/components/ui/card';

export default function BlacklistPage() {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <ListaBlacklist />
      </Card>
    </div>
  );
}
