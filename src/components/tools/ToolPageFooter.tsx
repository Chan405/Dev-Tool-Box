import type { ReactNode } from "react";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolAboutSection } from "@/components/tools/ToolAboutSection";

type ToolPageFooterProps = {
  slug: string;
  aboutId: string;
  aboutTitle: string;
  children: ReactNode;
};

export function ToolPageFooter({ slug, aboutId, aboutTitle, children }: ToolPageFooterProps) {
  return (
    <>
      <ToolAboutSection id={aboutId} title={aboutTitle}>
        {children}
      </ToolAboutSection>
      <RelatedTools currentSlug={slug} />
    </>
  );
}
