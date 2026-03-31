import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE_CONFIG } from './config/site';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileCTA } from './components/MobileCTA';
import { UltimoPedidoButton } from './components/UltimoPedidoButton';
import { ProdutosSection } from './components/ProdutosSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type CidadeSlug = 'jacarei' | 'sao-jose-dos-campos';

type HomePageProps = {
  searchParams: Promise<{
    cidade?: string;
  }>;
};

type IconProps = {
  className?: string;
};

function Truck({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 17h4" />
      <path d="M1 3h15v11H1z" />
      <path d="M16 8h4l3 3v3h-7z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShieldCheck({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MapPin({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Smartphone({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function Search({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CheckCircle2({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function DollarSign({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v20" />
      <path d="M17 7.5c0-2-2-3.5-5-3.5S7 5.5 7 7.5 8.5 11 12 11s5 1.5 5 3.5S15 18 12 18s-5-1.5-5-3.5" />
    </svg>
  );
}

function Store({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10h18" />
      <path d="M5 10l1-5h12l1 5" />
      <path d="M5 10v9h14v-9" />
      <path d="M9 19v-5h6v5" />
    </svg>
  );
}

function normalizarCidade(cidade?: string): CidadeSlug | '' {
  if (cidade === 'jacarei' || cidade === 'sao-jose-dos-campos') {
    return cidade;
  }
  return '';
}

function montarLinkPedido(cidade: CidadeSlug | '') {
  return cidade ? `/pedido?cidade=${cidade}` : '/pedido';
}

function CardCidade({
  href,
  titulo,
  descricao,
  ativa,
}: {
  href: string;
  titulo: string;
  descricao: string;
  ativa: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative z-10 block w-full rounded-[22px] border px-4 py-4 text-left transition hover:scale-[1.01] hover:shadow-lg ${
        ativa
          ? 'border-yellow-300 bg-white text-zinc-900 shadow-lg'
          : 'border-white/15 bg-white/10 text-white hover:bg-white/15'
      }`}
      aria-label={`Selecionar atendimento em ${titulo}`}
      scroll
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-lg font-black ${ativa ? 'text-zinc-900' : 'text-white'}`}>
            {titulo}
          </p>
          <p className={`mt-1 text-sm ${ativa ? 'text-zinc-600' : 'text-white/75'}`}>
            {descricao}
          </p>
        </div>

        {ativa && <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />}
      </div>
    </Link>
  );
}

function BeneficioCard({
  icon,
  title,
  description,
  iconBg,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-[28px] border border-orange-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-black text-zinc-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
    </div>
  );
}

function EtapaItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-orange-100 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-black text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const cidadeSelecionada = normalizarCidade(params?.cidade);
  const linkPedido = montarLinkPedido(cidadeSelecionada);

  return (
    <main className="min-h-screen bg-[#fff7ed] text-zinc-900">
      <SiteHeader />

      <section
        id="inicio"
        className="relative bg-[linear-gradient(135deg,_#b91c1c_0%,_#ea580c_48%,_#facc15_100%)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),rgba(0,0,0,0.04))]" />
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:px-6 md:py-24">
          <div className="text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-black backdrop-blur">
              Entrega rápida • Pedido online • Acompanhamento em tempo real
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              Peça gás e água com
              <span className="block text-yellow-200">mais rapidez e praticidade</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
              Faça seu pedido online, veja os produtos disponíveis na sua cidade e acompanhe o
              status em tempo real.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Truck className="h-6 w-6" aria-hidden="true" />
                <p className="mt-2 text-sm font-bold text-white">Entrega organizada</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <DollarSign className="h-6 w-6" aria-hidden="true" />
                <p className="mt-2 text-sm font-bold text-white">
                  Preço visível antes do pedido
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Smartphone className="h-6 w-6" aria-hidden="true" />
                <p className="mt-2 text-sm font-bold text-white">Acompanhamento online</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-white">Escolha sua cidade</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <CardCidade
                  href="/?cidade=jacarei#produtos"
                  titulo="Jacareí"
                  descricao="Atendimento da região principal"
                  ativa={cidadeSelecionada === 'jacarei'}
                />

                <CardCidade
                  href="/?cidade=sao-jose-dos-campos#produtos"
                  titulo="São José dos Campos"
                  descricao="Atendimento com produtos da loja da região"
                  ativa={cidadeSelecionada === 'sao-jose-dos-campos'}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={linkPedido}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-black text-zinc-900 shadow-lg transition hover:-translate-y-0.5"
              >
                Fazer pedido agora
              </Link>

              <Link
                href="#produtos"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/15"
              >
                Ver produtos disponíveis
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur md:p-5">
              <div className="grid items-center gap-5 md:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[26px] bg-white p-5 shadow-lg">
                  <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-700">
                    Pedido mais fácil
                  </div>

                  <h2 className="text-2xl font-black text-zinc-900 md:text-3xl">
                    Escolha sua cidade e peça em poucos passos
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    O site mostra os produtos da sua região e envia seu pedido para a loja correta.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
                      <span className="text-sm font-bold text-zinc-700">
                        Preços visíveis no site
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
                      <Truck className="h-5 w-5 text-orange-600" aria-hidden="true" />
                      <span className="text-sm font-bold text-zinc-700">
                        Entrega com operação organizada
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
                      <Search className="h-5 w-5 text-zinc-700" aria-hidden="true" />
                      <span className="text-sm font-bold text-zinc-700">
                        Acompanhe o pedido depois
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex min-h-[340px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,_#fff7ed_0%,_#fffdf8_100%)]">
                  <Image
                    src="/hero-villagas.png"
                    alt="Produtos VillaGás"
                    fill
                    className="object-contain p-6"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!cidadeSelecionada && (
        <section className="mx-auto max-w-7xl px-5 pt-8 md:px-6">
          <div className="rounded-[26px] border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-900 shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-black">Selecione sua cidade para ver os produtos disponíveis</p>
                <p className="mt-1 text-sm text-yellow-800">
                  Assim o site mostra a loja correta e exibe os produtos da sua região.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <ProdutosSection
        key={cidadeSelecionada || 'sem-cidade'}
        cidadeSelecionada={cidadeSelecionada}
        linkPedido={linkPedido}
        apiUrl={API_URL}
      />

      <section id="beneficios" className="mx-auto max-w-7xl px-5 py-16 md:px-6">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-black text-yellow-700">
            Por que escolher a {SITE_CONFIG.nome}
          </span>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Um site pensado para pedir rápido
          </h2>
          <p className="mt-3 text-lg text-zinc-600">
            Tudo organizado para o cliente pedir com confiança e facilidade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <BeneficioCard
            icon={<Truck className="h-7 w-7 text-red-600" aria-hidden="true" />}
            title="Entrega rápida"
            description="Atendimento pensado para agilizar seu pedido do começo ao fim."
            iconBg="bg-red-50"
          />
          <BeneficioCard
            icon={<DollarSign className="h-7 w-7 text-yellow-600" aria-hidden="true" />}
            title="Preço transparente"
            description="O cliente já visualiza o valor do produto antes de finalizar o pedido."
            iconBg="bg-yellow-50"
          />
          <BeneficioCard
            icon={<Smartphone className="h-7 w-7 text-green-600" aria-hidden="true" />}
            title="Acompanhamento fácil"
            description="O cliente acompanha o status do pedido sem precisar perguntar toda hora."
            iconBg="bg-green-50"
          />
          <BeneficioCard
            icon={<Store className="h-7 w-7 text-blue-600" aria-hidden="true" />}
            title="Loja certa"
            description="Os pedidos são organizados pela cidade para atender a região correta."
            iconBg="bg-blue-50"
          />
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-5 pb-16 md:px-6">
        <div className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm md:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-black text-orange-700">
              Como funciona
            </span>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Peça em poucos passos</h2>
            <p className="mt-3 text-lg text-zinc-600">
              Um fluxo simples para o cliente escolher a cidade, selecionar os produtos e
              acompanhar o pedido.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <EtapaItem
              icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
              title="1. Escolha sua cidade"
              description="Selecione a região de atendimento para visualizar a loja correta."
            />
            <EtapaItem
              icon={<Search className="h-6 w-6" aria-hidden="true" />}
              title="2. Veja os produtos"
              description="Confira opções, preços e disponibilidade mostrados no site."
            />
            <EtapaItem
              icon={<Truck className="h-6 w-6" aria-hidden="true" />}
              title="3. Faça seu pedido"
              description="Envie o pedido de forma simples e organizada para a operação."
            />
            <EtapaItem
              icon={<Smartphone className="h-6 w-6" aria-hidden="true" />}
              title="4. Acompanhe depois"
              description="Veja o andamento do pedido sem depender de atendimento manual."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-6">
        <div className="rounded-[32px] bg-zinc-950 px-6 py-8 text-white shadow-xl md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-wide text-yellow-300">
                Peça com praticidade
              </p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Faça seu pedido online e encontre a loja certa para sua cidade
              </h2>
              <p className="mt-3 text-white/80">
                Escolha sua região, veja os produtos disponíveis e envie seu pedido com mais
                rapidez.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={linkPedido}
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-base font-black text-zinc-950 transition hover:-translate-y-0.5"
              >
                Fazer pedido agora
              </Link>

              <UltimoPedidoButton
                href={linkPedido}
                texto="Pedir novamente"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/15"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
      <MobileCTA href={linkPedido} texto="Fazer pedido agora" />
    </main>
  );
}