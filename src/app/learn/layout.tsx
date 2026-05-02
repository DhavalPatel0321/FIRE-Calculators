export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="px-6 py-12 text-slate-900 sm:py-16">
      <article className="prose prose-slate mx-auto max-w-5xl">
        {children}
      </article>
    </main>
  );
}
