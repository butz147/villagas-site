import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG } from '../config/site';

type SiteHeaderProps = {
  showPedidoButton?: boolean;
  showAcompanharButton?: boolean;
  showBackToHome?: boolean;
};

export function SiteHeader({
  showPedidoButton = true,
  showAcompanharButton = true,
  showBackToHome = false,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-orange-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label={`Ir para a página inicial da ${SITE_CONFIG.nome}`}>
          <Image
            src="/logo-villagas.png"
            alt={SITE_CONFIG.nome}
            width={180}
            height={64}
            className="h-12 w-auto md:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
            Início
          </Link>
          <Link href="/#beneficios" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
            Vantagens
          </Link>
          <Link href="/#produtos" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
            Produtos
          </Link>
          <Link href="/#como-funciona" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
            Como pedir
          </Link>

          {showAcompanharButton && (
            <Link
              href="/acompanhar-pedido"
              className="text-sm font-bold text-zinc-700 hover:text-orange-600"
            >
              Acompanhar pedido
            </Link>
          )}

          {showPedidoButton && (
            <Link
              href="/pedido"
              className="rounded-2xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-zinc-900 shadow-md transition hover:bg-yellow-300"
            >
              Fazer pedido
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          {showAcompanharButton && (
            <Link
              href="/acompanhar-pedido"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-black text-zinc-800 hover:bg-zinc-50"
            >
              Acompanhar
            </Link>
          )}

          {showBackToHome && (
            <Link
              href="/"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-black text-zinc-800 hover:bg-zinc-50"
            >
              Voltar
            </Link>
          )}

          {!showBackToHome && showPedidoButton && (
            <Link
              href="/pedido"
              className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-black text-zinc-900 shadow-sm hover:bg-yellow-300"
            >
              Pedir
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}