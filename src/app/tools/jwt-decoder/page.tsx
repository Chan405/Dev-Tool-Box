import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JwtDecoderTool } from "./JwtDecoderTool";

const SLUG = "jwt-decoder";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JWT Decoder",
  description:
    "Decode JWT header and payload online in your browser. Inspect claims and exp/iat timestamps without verifying signatures.",
  keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token", "jwt claims"],
});

export default function JwtDecoderPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <ToolLayout tool={tool}>
      <JwtDecoderTool />
      <ToolPageFooter slug={tool.slug} aboutId="jwt-decoder-about" aboutTitle="Decode JWTs for debugging">
        <ToolAboutParagraph>
          Paste a JSON Web Token to inspect its header and payload as formatted JSON. Standard claims such as{" "}
          <code>exp</code>, <code>iat</code>, and <code>nbf</code> are highlighted with human-readable timestamps when
          present, along with a simple expired / not-yet-valid hint based on those claims.
        </ToolAboutParagraph>
        <ToolAboutParagraph>
          This tool is a decoder only—it does not validate signatures or prove a token is authentic. Use it to debug
          auth flows during development, and always verify tokens on your server before trusting them in production.
        </ToolAboutParagraph>
      </ToolPageFooter>
    </ToolLayout>
  );
}
