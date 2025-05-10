// components/Syntax.tsx
"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Troque por um tema existente
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  code: string;
  language?: string;
};

const isProd = process.env.NODE_ENV === "production";

export default function Syntax({ code, language = "javascript" }: Props) {
  if (isProd) return null; // 👈 Ignora em produção

  return (
    <div className="rounded-md text-sm mt-6 overflow-auto">
      {/* @ts-expect-error – ignora erro de tipagem */}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        PreTag="div"
        customStyle={{
          padding: "24px",
          margin: 0,
          backgroundColor: "#282c34",
        }}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
