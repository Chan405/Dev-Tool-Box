import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JwtDecoderTool } from "./JwtDecoderTool";

const SLUG = "jwt-decoder";

const SEO_DESCRIPTION =
  "Decode JWT header and payload data online in your browser. This JWT decoder does not verify token signatures.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JWT Decoder – Decode JSON Web Tokens Online",
  description: SEO_DESCRIPTION,
  keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token", "jwt claims"],
});

export default function JwtDecoderPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JwtDecoderTool />
        <ToolPageFooter
          slug={tool.slug}
          aboutId="jwt-decoder-about"
          aboutTitle="Decode JWTs for debugging"
          faq={
            <ToolFaq
              id="jwt-decoder-faq"
              items={[
                {
                  question: "Does decoding a JWT verify it?",
                  answer:
                    "No. Decoding only turns the header and payload into readable JSON. It does not prove who issued the token.",
                },
                {
                  question: "What are the three JWT parts?",
                  answer:
                    "Header, payload, and signature, separated by dots and encoded as Base64URL. This tool decodes the header and payload. It does not check the signature.",
                },
                {
                  question: "Does this tool verify the signature?",
                  answer:
                    "No. The signature has to be present so the token has three segments, and it is not validated.",
                },
                {
                  question: "Does an unexpired JWT mean it is authentic?",
                  answer:
                    "No. An exp time in the future only means that claim has not passed. Anyone can write it. Trust the token only after your server verifies the signature.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            A JWT has three Base64URL segments: header, payload, and signature. This JWT decoder can decode the JWT
            header and payload as JSON and show JWT expiration from <code>exp</code>, plus <code>iat</code> and{" "}
            <code>nbf</code> when those claims exist. The <code>alg</code> value in the header is displayed with the
            rest of the header. It is not proof that the token is authentic.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            The signature is not verified. A readable token, including one that has not expired, can still be forged.
            Paste the token itself; a <code>Bearer</code> prefix is not removed. You can decode JWT locally in the
            browser, then verify the signature on your server before trusting any claim.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
