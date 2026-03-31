'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { SITE_CONFIG } from '../config/site';

type ResumoPedido = {
  pedido_id: string | number;
  produto: string;
  quantidade: string;
  pagamento: string;
  total: string | number;
  cidade: string;
};

export default function PedidoSucessoPage() {
  const searchParams = useSearchParams();

  const pedidoId = searchParams.get('pedido_id') || '';
  const tempoMin = searchParams.get('min') || '';
  const tempoMax = searchParams.get('max') || '';
  const telefoneUrl = searchParams.get('telefone') || '';

  const [mostrarCard, setMostrarCard] = useState(false);
  const [mostrarCheck, setMostrarCheck] = useState(false);
  const [resumo, setResumo] = useState<ResumoPedido | null>(null);
  const [telefoneSalvo, setTelefoneSalvo] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => setMostrarCard(true), 120);
    const timer2 = setTimeout(() => setMostrarCheck(true), 260);

    try {
      const resumoSalvo = localStorage.getItem('villagas_resumo_pedido');
      if (resumoSalvo) {
        setResumo(JSON.parse(resumoSalvo));
      }
    } catch (error) {
      console.error('Erro ao carregar resumo do pedido:', error);
    }

    try {
      const telefoneLocal = localStorage.getItem('villagas_ultimo_pedido_telefone') || '';
      setTelefoneSalvo(telefoneLocal);
    } catch (error) {
      console.error('Erro ao carregar telefone salvo:', error);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const totalFormatado = useMemo(() => {
    if (!resumo || resumo.total === undefined || resumo.total === null) return null;

    return Number(resumo.total).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, [resumo]);

  const telefoneFinal = telefoneUrl || telefoneSalvo;

  const linkAcompanhar =
    pedidoId && telefoneFinal
      ? `/acompanhar-pedido?pedido_id=${pedidoId}&telefone=${encodeURIComponent(telefoneFinal)}`
      : pedidoId
      ? `/acompanhar-pedido?pedido_id=${pedidoId}`
      : '/acompanhar-pedido';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#fff1f2_40%,_#fff7ed)]">
      <SiteHeader
        showPedidoButton={false}
        showAcompanharButton={true}
        showBackToHome={true}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#16a34a_0%,_#22c55e_45%,_#86efac_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.16),rgba(0,0,0,0.04))]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 text-white md:px-6 md:py-16">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-black backdrop-blur">
            Pedido confirmado
          </span>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Seu pedido foi enviado com sucesso
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
            Agora é só acompanhar o andamento ou falar com a equipe da {SITE_CONFIG.nome} se precisar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 md:px-6 md:py-14">
        <div
          className={`rounded-[32px] border border-green-200 bg-white p-8 shadow-xl transition-all duration-700 md:p-10 ${
            mostrarCard ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl transition-all duration-700 ${
              mostrarCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            ✅
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-3xl font-black text-zinc-900 md:text-4xl">
              Pedido confirmado!
            </h2>

            <p className="mt-3 text-base leading-7 text-zinc-600 md:text-lg">
              Seu pedido foi enviado com sucesso para a loja e já está em processamento.
            </p>
          </div>

          {pedidoId && (
            <div className="mt-8 rounded-[28px] border border-green-200 bg-green-50 p-5 text-center">
              <p className="text-sm font-bold text-green-700">Número do pedido</p>
              <p className="mt-1 text-4xl font-black text-zinc-900">#{pedidoId}</p>
            </div>
          )}

          {tempoMin && tempoMax && (
            <div className="mt-4 rounded-[28px] border border-yellow-200 bg-yellow-50 p-5 text-center">
              <p className="text-sm font-bold text-yellow-700">Tempo estimado de entrega</p>
              <p className="mt-1 text-3xl font-black text-zinc-900">
                {tempoMin} a {tempoMax} minutos
              </p>
            </div>
          )}

          {resumo && (
            <div className="mt-8 rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-xl font-black text-zinc-900">Resumo do pedido</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-bold text-zinc-500">Produto</p>
                  <p className="mt-1 font-black text-zinc-900">{resumo.produto}</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-bold text-zinc-500">Quantidade</p>
                  <p className="mt-1 font-black text-zinc-900">{resumo.quantidade}</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-bold text-zinc-500">Pagamento</p>
                  <p className="mt-1 font-black text-zinc-900">{resumo.pagamento}</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-bold text-zinc-500">Cidade</p>
                  <p className="mt-1 font-black text-zinc-900">{resumo.cidade}</p>
                </div>
              </div>

              {totalFormatado && (
                <div className="mt-4 rounded-2xl bg-yellow-400 p-4">
                  <p className="text-sm font-bold text-zinc-800">Total do pedido</p>
                  <p className="mt-1 text-3xl font-black text-zinc-900">{totalFormatado}</p>
                </div>
              )}
            </div>
          )}

          {!telefoneFinal && (
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-800">
              O link de acompanhamento vai abrir sem o telefone preenchido. Se precisar, informe o telefone usado no pedido para consultar.
            </div>
          )}

          <div className="mt-8 grid gap-3">
            <Link
              href={linkAcompanhar}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-center text-base font-black text-zinc-900 transition hover:bg-yellow-300"
            >
              Acompanhar pedido
            </Link>

            <Link
              href="/pedido"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-300 px-6 py-4 text-center text-base font-black text-zinc-900 transition hover:bg-zinc-50"
            >
              Pedir novamente
            </Link>

            <WhatsAppButton
              texto="Falar com a loja no WhatsApp"
              className="justify-center rounded-2xl bg-green-600 text-white shadow-none hover:scale-100 hover:bg-green-700"
            />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Você pode acompanhar seu pedido em tempo real ou falar com a equipe da {SITE_CONFIG.nome}.
          </p>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton fixed />
    </main>
  );
}