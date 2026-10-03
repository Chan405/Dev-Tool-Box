import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolAboutSection } from "@/components/tools/ToolAboutSection";

export type ToolFaqItem = {
  question: string;
  answer: ReactNode;
};

export function ToolFaq({ id, items }: { id: string; items: readonly ToolFaqItem[] }) {
  return (
    <ToolAboutSection id={id} title="Common questions">
      {items.map((item, index) => (
        <div key={item.question}>
          <Typography component="h3" variant="h3" sx={{ mt: index === 0 ? 0 : 2, mb: 0.75 }}>
            {item.question}
          </Typography>
          <ToolAboutParagraph>{item.answer}</ToolAboutParagraph>
        </div>
      ))}
    </ToolAboutSection>
  );
}
