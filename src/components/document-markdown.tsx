import Markdown, { defaultUrlTransform } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { resolveDocumentUrl } from "../lib/docs";
import ScrollRegion from "./scroll-region";

export default function DocumentMarkdown({
  content,
  source,
}: {
  content: string;
  source: string;
}) {
  return (
    <div className="docs-prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        skipHtml
        urlTransform={(url, key) =>
          defaultUrlTransform(resolveDocumentUrl(url, source, key === "src"))
        }
        components={{
          table: ({ children }) => (
            <ScrollRegion
              className="docs-table-scroll"
              label="Scrollable table"
            >
              <table>{children}</table>
            </ScrollRegion>
          ),
          pre: ({ children }) => (
            <ScrollRegion className="docs-code-scroll" label="Code example">
              <pre>{children}</pre>
            </ScrollRegion>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
