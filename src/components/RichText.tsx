import { tokenizeInline } from "../lib/inline";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {tokenizeInline(text).map((token, index) => {
        if (token.kind === "code") {
          return (
            <code key={index} className="inline-code">
              {token.text}
            </code>
          );
        }
        if (token.kind === "em") return <em key={index}>{token.text}</em>;
        if (token.kind === "link") {
          return (
            <a key={index} href={token.href}>
              {token.text}
            </a>
          );
        }
        return token.text;
      })}
    </>
  );
}
