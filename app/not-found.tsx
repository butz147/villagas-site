'use client';

import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SITE_CONFIG } from './config/site';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#fff1f2_40%,_#fff7ed)]">
      <SiteHeader
        showPedidoButton={true}
        showAcompanharButton={true}
        showBackToHome={true}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#b91c1c_0%,_#ea580c_48%,_#facc15_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),rgba(0,0,0,0.05))]" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 text-white md:px-6 md:py-20 text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-black backdrop-blur">
            Erro 404
          </span>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Página não encontrada
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-white/90">
            O link que você tentou acessar não existe ou foi removido.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="mx-auto max-w-3xl px-5 py-10 md:px-6 md:py-14 text-center">
        <div className="rounded-[32px] border border-orange-200 bg-white p-8 shadow-xl">
          <div className="text-6xl">😕</div>

          <h2 className="mt-4 text-2xl font-black text-zinc-900">
            Ops... algo deu errado
          </h2>

          <p className="mt-3 text-zinc-600">
            Você pode voltar para a página inicial ou fazer um novo pedido.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/"
              className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-zinc-900 hover:bg-yellow-300"
            >
              Voltar para o início
            </a>

            <a
              href="/pedido"
              className="rounded-2xl border border-zinc-300 px-6 py-4 font-black text-zinc-900 hover:bg-zinc-50"
            >
              Fazer pedido
            </a>

            <a
              href="/acompanhar-pedido"
              className="rounded-2xl border border-zinc-300 px-6 py-4 font-black text-zinc-900 hover:bg-zinc-50"
            >
              Acompanhar pedido
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Se precisar de ajuda, fale com a equipe da {SITE_CONFIG.nome}.
          </p>

          <div className="mt-4">
            <WhatsAppButton texto="Falar no WhatsApp" />
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton fixed />
    </main>
  );
}