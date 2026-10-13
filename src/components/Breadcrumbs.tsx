import Link from "next/link";

export function Breadcrumbs({ items, dark = false }: { items: { href: string; label: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`pt-8 text-[13px] ${dark ? "text-white/80" : "text-muted"}`}>
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.href} className="flex gap-1">
              {last ? (
                <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                  {it.label}
                </span>
              ) : (
                <>
                  <Link href={it.href} className="hover:underline">
                    {it.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
