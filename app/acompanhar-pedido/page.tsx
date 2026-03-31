'use client';

import Link from 'next/link';
import { Suspense, ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { SITE_CONFIG } from '../config/site';

type Pedido = {
  id: number;
  status: string;
  status_display: string;
  produto: string;
  quantidade: number;
  preco_unitario: string;
  subtotal?: string;
  total: string;
  cidade_loja: string;
  loja: string;
  cliente: string;
  telefone: string;
  endereco: string;
  observacoes: string;
  data_pedido: string;
  tempo_entrega_min?: number;
  tempo_entrega_max?: number;
};

type TipoMensagem = 'sucesso' | 'erro' | '';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function AcompanharPedidoContent() {
  const searchParams = useSearchParams();
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  const [pedidoId, setPedidoId] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<TipoMensagem>('');
  const [loading, setLoading] = useState(false);
  const [autoAtualizando, setAutoAtualizando] = useState(false);

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function somenteNumeros(valor: string) {
    return valor.replace(/\D/g, '');
  }

  function classeStatus(status: string) {
    if (status === 'novo') return 'border-yellow-200 bg-yellow-100 text-yellow-800';
    if (status === 'preparando') return 'border-blue-200 bg-blue-100 text-blue-800';
    if (status === 'saiu_entrega') return 'border-purple-200 bg-purple-100 text-purple-800';
    if (status === 'entregue') return 'border-green-200 bg-green-100 text-green-800';
    if (status === 'cancelado') return 'border-red-200 bg-red-100 text-red-800';
    return 'border-zinc-200 bg-zinc-100 text-zinc-800';
  }

  const etapaAtualIndex = useMemo(() => {
    if (!pedido) return -1;
    if (pedido.status === 'novo') return 0;
    if (pedido.status === 'preparando') return 1;
    if (pedido.status === 'saiu_entrega') return 2;
    if (pedido.status === 'entregue') return 3;
    return -1;
  }, [pedido]);

  const progressoPercentual = useMemo(() => {
    if (!pedido) return 0;
    if (pedido.status === 'novo') return 25;
    if (pedido.status === 'preparando') return 50;
    if (pedido.status === 'saiu_entrega') return 75;
    if (pedido.status === 'entregue') return 100;
    return 0;
  }, [pedido]);

  const etapas = useMemo(() => {
    const statusAtual = pedido?.status || '';

    return [
      {
        chave: 'novo',
        titulo: 'Pedido recebido',
        descricao: 'Seu pedido foi recebido pela loja.',
        ativo: ['novo', 'preparando', 'saiu_entrega', 'entregue'].includes(statusAtual),
      },
      {
        chave: 'preparando',
        titulo: 'Em preparo',
        descricao: 'A equipe está organizando o seu pedido.',
        ativo: ['preparando', 'saiu_entrega', 'entregue'].includes(statusAtual),
      },
      {
        chave: 'saiu_entrega',
        titulo: 'Saiu para entrega',
        descricao: 'Seu pedido está a caminho.',
        ativo: ['saiu_entrega', 'entregue'].includes(statusAtual),
      },
      {
        chave: 'entregue',
        titulo: 'Entregue',
        descricao: 'Pedido finalizado com sucesso.',
        ativo: ['entregue'].includes(statusAtual),
      },
    ];
  }, [pedido]);

  async function consultarPedido(id: string, telefoneValor: string, silencioso = false) {
    if (!id.trim() || !telefoneValor.trim()) return;

    if (!silencioso) {
      setMensagem('');
      setTipoMensagem('');
      setPedido(null);
      setLoading(true);
    }

    try {
      const response = await fetch(
        `${API_URL}/api/pedidos/acompanhar/?pedido_id=${id}&telefone=${encodeURIComponent(
          telefoneValor
        )}`
      );

      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.erro || 'Não foi possível localizar o pedido.');
      }

      const dados = data?.dados || data;

      setPedido((pedidoAnterior) => {
        if (
          pedidoAnterior &&
          pedidoAnterior.status !== dados.pedido.status &&
          document.visibilityState === 'visible'
        ) {
          setMensagem(`Status atualizado: ${dados.pedido.status_display}`);
          setTipoMensagem('sucesso');
        }
        return dados.pedido;
      });

      try {
        localStorage.setItem('villagas_ultimo_pedido_id', String(dados.pedido.id));
        localStorage.setItem('villagas_ultimo_pedido_telefone', telefoneValor);
      } catch (error) {
        console.error('Erro ao salvar dados do pedido:', error);
      }

      if (!silencioso) {
        setTipoMensagem('sucesso');
        setMensagem(`Pedido #${dados.pedido.id} localizado com sucesso.`);
      }
    } catch (error: unknown) {
      if (!silencioso) {
        const message =
          error instanceof Error ? error.message : 'Erro ao acompanhar pedido.';
        setTipoMensagem('erro');
        setMensagem(message);
      }
    } finally {
      if (!silencioso) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const pedidoIdParam = searchParams.get('pedido_id') || '';
    const telefoneParam = searchParams.get('telefone') || '';

    let pedidoIdFinal = pedidoIdParam;
    let telefoneFinal = telefoneParam;

    try {
      if (!pedidoIdFinal) {
        pedidoIdFinal = localStorage.getItem('villagas_ultimo_pedido_id') || '';
      }

      if (!telefoneFinal) {
        telefoneFinal = localStorage.getItem('villagas_ultimo_pedido_telefone') || '';
      }
    } catch (error) {
      console.error('Erro ao ler localStorage:', error);
    }

    if (pedidoIdFinal) setPedidoId(pedidoIdFinal);
    if (telefoneFinal) setTelefone(formatarTelefone(telefoneFinal));

    if (pedidoIdFinal && telefoneFinal) {
      consultarPedido(pedidoIdFinal, telefoneFinal);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!pedidoId || !telefone || !pedido) {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      setAutoAtualizando(false);
      return;
    }

    intervaloRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        consultarPedido(pedidoId, telefone, true);
        setAutoAtualizando(true);
      }
    }, 8000);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      setAutoAtualizando(false);
    };
  }, [pedidoId, telefone, pedido]);

  function handleTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
    setTelefone(formatarTelefone(e.target.value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!pedidoId.trim()) {
      setTipoMensagem('erro');
      setMensagem('Informe o número do pedido.');
      return;
    }

    if (!telefone.trim()) {
      setTipoMensagem('erro');
      setMensagem('Informe o telefone.');
      return;
    }

    consultarPedido(pedidoId, telefone);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#fff1f2_40%,_#fff7ed)]">
      <SiteHeader
        showPedidoButton={true}
        showAcompanharButton={false}
        showBackToHome={true}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#b91c1c_0%,_#ea580c_48%,_#facc15_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),rgba(0,0,0,0.05))]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 text-white md:px-6 md:py-16">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-black backdrop-blur">
            Acompanhar pedido
          </span>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Consulte o andamento do seu pedido
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
            Informe o número do pedido e o telefone usado no cadastro para ver o status em tempo real.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-100 text-lg font-black text-yellow-700">
                  🔎
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                    Localizar pedido
                  </p>
                  <h2 className="text-xl font-black text-zinc-900">
                    Informe os dados do pedido
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-black text-zinc-800">
                    Número do pedido
                  </label>
                  <input
                    type="text"
                    value={pedidoId}
                    onChange={(e) => setPedidoId(somenteNumeros(e.target.value))}
                    placeholder="Ex: 125"
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-zinc-800">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {mensagem && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-black ${
                      tipoMensagem === 'sucesso'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {mensagem}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-base font-black text-white shadow-lg transition hover:from-green-700 hover:to-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Consultando...' : 'Consultar pedido'}
                </button>
              </form>
            </div>

            <div className="rounded-[30px] bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-zinc-900 shadow-xl">
              <h3 className="text-2xl font-black">Precisa de ajuda?</h3>
              <p className="mt-3 leading-7 text-zinc-800">
                Se tiver dificuldade para localizar o pedido, fale com a equipe da {SITE_CONFIG.nome}.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/pedido"
                  className="inline-flex rounded-2xl bg-zinc-900 px-5 py-3 font-black text-white transition hover:bg-black"
                >
                  Fazer novo pedido
                </Link>

                <WhatsAppButton
                  texto="Falar no WhatsApp"
                  className="justify-center rounded-2xl bg-white text-zinc-900 shadow-none hover:scale-100 hover:bg-zinc-100"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-xl md:p-8">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3 text-zinc-900">
                <h3 className="text-lg font-black">Andamento do pedido</h3>

                {pedido && (
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">
                    {autoAtualizando ? 'Atualização automática ativa' : 'Aguardando'}
                  </span>
                )}
              </div>

              {!pedido ? (
                <div className="mt-5 rounded-2xl border border-dashed border-orange-300 bg-orange-50 p-6 text-sm font-bold text-orange-700">
                  Consulte um pedido para visualizar o andamento.
                </div>
              ) : pedido.status === 'cancelado' ? (
                <>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-500">Pedido</p>
                      <p className="text-2xl font-black text-zinc-900">#{pedido.id}</p>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-4 py-2 text-sm font-black ${classeStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status_display}
                    </span>
                  </div>

                  {pedido.tempo_entrega_min && pedido.tempo_entrega_max ? (
                    <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-sm font-bold text-yellow-700">Previsão de entrega</p>
                      <p className="mt-1 text-2xl font-black text-zinc-900">
                        {pedido.tempo_entrega_min} a {pedido.tempo_entrega_max} min
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                        ❌
                      </div>
                      <div>
                        <p className="text-lg font-black text-red-800">
                          Pedido cancelado
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6 text-red-700">
                          Esse pedido foi marcado como cancelado. Entre em contato com a equipe se precisar de ajuda.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-500">Pedido</p>
                      <p className="text-2xl font-black text-zinc-900">#{pedido.id}</p>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-4 py-2 text-sm font-black ${classeStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status_display}
                    </span>
                  </div>

                  {pedido.tempo_entrega_min && pedido.tempo_entrega_max ? (
                    <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-yellow-700">Previsão de entrega</p>
                          <p className="mt-1 text-2xl font-black text-zinc-900">
                            {pedido.tempo_entrega_min} a {pedido.tempo_entrega_max} min
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                            Progresso
                          </p>
                          <p className="text-2xl font-black text-zinc-900">
                            {progressoPercentual}%
                          </p>
                        </div>
                      </div>

                      {pedido.status === 'saiu_entrega' ? (
                        <p className="mt-2 text-sm font-medium text-yellow-800">
                          Seu pedido já saiu para entrega e está a caminho.
                        </p>
                      ) : null}

                      {pedido.status === 'entregue' ? (
                        <p className="mt-2 text-sm font-medium text-green-700">
                          Seu pedido já foi entregue.
                        </p>
                      ) : null}

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                          style={{ width: `${progressoPercentual}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,_#fffdf8_0%,_#ffffff_100%)] p-5">
                    <div className="space-y-0">
                      {etapas.map((etapa, index) => {
                        const concluida = index <= etapaAtualIndex;
                        const etapaAtual = index === etapaAtualIndex;
                        const ultima = index === etapas.length - 1;

                        return (
                          <div key={etapa.chave} className="relative flex gap-4">
                            <div className="relative flex w-10 flex-col items-center">
                              <div
                                className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black ${
                                  concluida
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-zinc-300 bg-white text-zinc-400'
                                }`}
                              >
                                {concluida ? '✓' : index + 1}
                              </div>

                              {!ultima && (
                                <div
                                  className={`my-1 w-1 flex-1 rounded-full ${
                                    index < etapaAtualIndex ? 'bg-green-500' : 'bg-zinc-200'
                                  }`}
                                  style={{ minHeight: '42px' }}
                                />
                              )}
                            </div>

                            <div className="flex-1 pb-6">
                              <div
                                className={`rounded-2xl border p-4 ${
                                  etapaAtual
                                    ? 'border-green-200 bg-green-50 shadow-sm'
                                    : concluida
                                    ? 'border-green-100 bg-white'
                                    : 'border-zinc-200 bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p
                                    className={`font-black ${
                                      etapaAtual
                                        ? 'text-green-800'
                                        : concluida
                                        ? 'text-zinc-900'
                                        : 'text-zinc-500'
                                    }`}
                                  >
                                    {etapa.titulo}
                                  </p>

                                  {etapaAtual && (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                                      Etapa atual
                                    </span>
                                  )}
                                </div>

                                <p
                                  className={`mt-2 text-sm leading-6 ${
                                    etapaAtual
                                      ? 'text-green-700'
                                      : concluida
                                      ? 'text-zinc-600'
                                      : 'text-zinc-500'
                                  }`}
                                >
                                  {etapa.descricao}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {pedido.status === 'entregue' ? (
                    <div className="mt-6 rounded-[28px] border border-green-200 bg-green-50 p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                          ✅
                        </div>
                        <div>
                          <p className="text-lg font-black text-green-800">
                            Pedido entregue com sucesso
                          </p>
                          <p className="mt-2 text-sm font-medium leading-6 text-green-700">
                            Seu pedido foi finalizado. Obrigado por comprar com a {SITE_CONFIG.nome}.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-bold text-zinc-500">Produto</p>
                      <p className="mt-1 font-black text-zinc-900">{pedido.produto}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-50 p-4">
                        <p className="text-sm font-bold text-zinc-500">Quantidade</p>
                        <p className="mt-1 font-black text-zinc-900">{pedido.quantidade}</p>
                      </div>

                      <div className="rounded-2xl bg-zinc-50 p-4">
                        <p className="text-sm font-bold text-zinc-500">Total</p>
                        <p className="mt-1 font-black text-zinc-900">R$ {pedido.total}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-bold text-zinc-500">Cliente</p>
                      <p className="mt-1 font-black text-zinc-900">{pedido.cliente}</p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-bold text-zinc-500">Endereço</p>
                      <p className="mt-1 font-black text-zinc-900">{pedido.endereco}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-50 p-4">
                        <p className="text-sm font-bold text-zinc-500">Loja</p>
                        <p className="mt-1 font-black text-zinc-900">{pedido.loja}</p>
                      </div>

                      <div className="rounded-2xl bg-zinc-50 p-4">
                        <p className="text-sm font-bold text-zinc-500">Data</p>
                        <p className="mt-1 font-black text-zinc-900">{pedido.data_pedido}</p>
                      </div>
                    </div>

                    {pedido.observacoes ? (
                      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <p className="text-sm font-bold text-orange-700">Observações</p>
                        <p className="mt-1 font-black text-zinc-900">{pedido.observacoes}</p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton fixed />
    </main>
  );
}

export default function AcompanharPedidoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#fff1f2_40%,_#fff7ed)]">
          <SiteHeader
            showPedidoButton={true}
            showAcompanharButton={false}
            showBackToHome={true}
          />
          <section className="mx-auto max-w-7xl px-5 py-16 md:px-6">
            <div className="rounded-[30px] border border-orange-200 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black text-zinc-900">Carregando acompanhamento...</p>
            </div>
          </section>
          <SiteFooter />
        </main>
      }
    >
      <AcompanharPedidoContent />
    </Suspense>
  );
}