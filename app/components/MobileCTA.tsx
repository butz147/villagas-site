import Link from 'next/link';

type MobileCTAProps = {
  href: string;
  texto: string;
};

export function MobileCTA({ href, texto }: MobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <Link
        href={href}
        className="block w-full rounded-2xl bg-green-600 px-5 py-4 text-center text-base font-black text-white transition hover:bg-green-700"
      >
        {texto}
      </Link>
    </div>
  );
}