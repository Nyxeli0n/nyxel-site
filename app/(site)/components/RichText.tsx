import { PortableText, type PortableTextBlock } from "@portabletext/react";
export default function RichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <PortableText
      value={value}
      components={{
        marks: {
          link: ({ value, children }) => {
            const href =
              typeof value?.href === "string" && /^https?:\/\//.test(value.href)
                ? value.href
                : undefined;
            return href ? (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ) : (
              <>{children}</>
            );
          },
        },
      }}
    />
  );
}
