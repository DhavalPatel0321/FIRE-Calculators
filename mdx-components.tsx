import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

type AnchorProps = ComponentPropsWithoutRef<"a">;

function MdxLink({ href = "", ...props }: AnchorProps) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900"
        {...props}
      />
    );
  }

  return (
    <a
      href={href}
      className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900"
      {...props}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
        {...props}
      />
    ),
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-10 text-2xl font-semibold tracking-tight text-slate-950"
        {...props}
      />
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-8 text-xl font-semibold text-slate-950" {...props} />
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
      <p className="leading-7 text-slate-700" {...props} />
    ),
    a: MdxLink,
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-slate-700" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
      <ol
        className="my-6 list-decimal space-y-2 pl-6 text-slate-700"
        {...props}
      />
    ),
    li: (props: ComponentPropsWithoutRef<"li">) => (
      <li className="pl-1 leading-7" {...props} />
    ),
    strong: (props: ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-slate-950" {...props} />
    ),
    code: (props: ComponentPropsWithoutRef<"code">) => (
      <code
        className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-900"
        {...props}
      />
    ),
    ...components,
  };
}
