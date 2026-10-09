import { AppLink } from "@/components/layout/AppLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolAboutSection } from "@/components/tools/ToolAboutSection";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JwtExpirationTool } from "./JwtExpirationTool";

const SLUG = "jwt-expiration-checker";

const SEO_DESCRIPTION =
  "Check a JWT exp, nbf, and iat time in your browser. See whether the token is expired, not yet valid, or still inside its time window. Signatures are not verified.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "Check When a JWT Expires (exp, nbf, iat)",
  description: SEO_DESCRIPTION,
  keywords: ["jwt expiration", "jwt exp claim", "check jwt expiry"],
});

export default function JwtExpirationCheckerPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JwtExpirationTool />

        <ToolAboutSection id="jwt-expiration-about" title="What exp, nbf, and iat tell you">
          <ToolAboutParagraph>
            Paste a JWT and this page reads the time claims. <code>exp</code> is the moment after which the token is
            expired. <code>nbf</code> is the moment before which it must not be accepted. <code>iat</code> is when it
            was issued. Times are shown in UTC and in your local timezone. The example token uses a fixed{" "}
            <code>exp</code> in 2018, so it checks as expired.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            JWT <code>NumericDate</code> values are seconds since the Unix epoch. JavaScript&apos;s{" "}
            <code>Date.now()</code> is milliseconds. If <code>exp</code> is a string, or a number large enough to be
            milliseconds, the checker reports it instead of converting it. A token with no <code>exp</code> has no
            expiration to check.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            To read the header and payload, use the{" "}
            <AppLink href="/tools/jwt-decoder" color="primary">
              JWT Decoder
            </AppLink>
            . Paste that JSON into the{" "}
            <AppLink href="/tools/json-formatter" color="primary">
              JSON Formatter
            </AppLink>{" "}
            when you want it indented. Neither tool verifies the signature.
          </ToolAboutParagraph>
        </ToolAboutSection>

        <ToolFaq
          id="jwt-expiration-faq"
          items={[
            {
              question: "What do exp, nbf, and iat mean?",
              answer:
                "exp is the expiration time. After that instant, the token should be rejected. nbf means not before, so the token should be rejected until that instant. iat is the issued-at time. All three are NumericDate values in seconds.",
            },
            {
              question: "Are JWT times in seconds or milliseconds?",
              answer:
                "Seconds. A 13-digit exp is usually a JavaScript millisecond timestamp. This checker does not divide by 1000. A string such as \"1700000000\" is also rejected, because NumericDate is a JSON number.",
            },
            {
              question: "What about clock skew?",
              answer:
                "Servers often allow a small leeway, commonly a minute or two, because the issuer's clock and the verifier's clock differ. This page compares the claims with your browser clock and applies no leeway. A token shown as just expired can still be accepted by a server that allows skew.",
            },
            {
              question: "Why does a server reject an expired token?",
              answer:
                "exp is the time after which the token must not be accepted. A valid signature does not extend that lifetime. Once exp has passed, the server should reject the token and the client should get a new one.",
            },
            {
              question: "Does an unexpired token mean it is genuine?",
              answer:
                "No. Anyone can write an exp in the future. This page only reads the time claims. Trust the token only after your server verifies the signature.",
            },
          ]}
        />

        <RelatedTools currentSlug={tool.slug} />
      </ToolLayout>
    </>
  );
}
