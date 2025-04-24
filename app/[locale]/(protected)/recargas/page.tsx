"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecargaTable } from "./components/table";
import RecargasModal from "@/components/RecargasModal";
import { influenciadores } from "@/lib/influenciadores";

export default function RecargasPage() {

  return (
    <div className="p-4 space-y-4">

      <Card>
        <RecargaTable />
      </Card>
    </div>
  );
}
