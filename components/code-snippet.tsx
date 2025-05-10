"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "./copy-button";
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Syntax from "@/components/Syntax"; // ajuste o caminho se necessário


interface CardSnippetProps {
  title: string;
  code: string;
  children: React.ReactNode;
}

const CardSnippet = ({ title, code, children }: CardSnippetProps) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow((prev) => !prev);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        {title && (
          <CardTitle className="flex-1 leading-normal">{title}</CardTitle>
        )}
        {code && (
          <div className="flex-none">
            <Switch id="toggle-code" onClick={toggle} />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {children}

        <Collapsible open={show}>
          <CollapsibleContent className="CollapsibleContent relative">
            <div className="absolute end-2 top-2">
              <CopyButton
                event="copy_chart_code"
                name={title}
                code={code}
                className="[&_svg]-h-3 h-6 w-6 rounded-[6px] bg-background hover:bg-background hover:text-foreground text-foreground shadow-none [&_svg]:w-3"
              />
            </div>

            <Syntax code={code} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CardSnippet;
