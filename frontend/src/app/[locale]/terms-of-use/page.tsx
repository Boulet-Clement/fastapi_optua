'use client';

import React from "react";
import { useTranslations } from "next-intl";
import Title1 from "@/components/ui/Titles/Title1";
import MandatoryInformation from "@/components/MandatoryInformations";

export default function TermsOfUsePage() {
  const trans = useTranslations("TermsOfUse");
  const sections = trans.raw("sections") as {
    title: string;
    blocks: { type: "paragraph" | "list"; text?: string; items?: string[] }[];
  }[];

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 py-8">
      <Title1>
        {trans("title")}
      </Title1>

      <MandatoryInformation sections={sections}/>
    </div>
  )
}
