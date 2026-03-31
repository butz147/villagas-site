'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Produto = {
  id: number;
  nome: string;
  preco_venda: string;
  imagem_url?: string;
};

type Props = {
  cidadeSelecionada: string;
  linkPedido: string;
  apiUrl: string;
};

function getImagemFallback(nome: string) {
  const nomeNormalizado = nome.toLowerCase();

  if (nomeNormalizado.includes('gas') || nomeNormalizado.includes('gás')) {
    return '/produtos/gas.png';
  }

  if (nomeNormalizado.includes('agua') || nomeNormalizado.includes('água')) {
    return '/produtos/agua20l.png';
  }

  return '/produtos/default.png';
}

function getImagemProduto(produto: Produto, apiUrl: string) {
  if (produto.imagem_url) {
    if (produto.imagem_url.startsWith('http')) return produto.imagem_url;
    return `${apiUrl}${produto.imagem_url}`;
  }

  return getImagemFallback(produto.nome);
}

function labelCidade(valor: string) {
  if (valor === 'jacarei') return 'Jacareí';
  if (valor === 'sao-jose-dos-campos') return 'São José dos Campos';
  return valor;
}

function formatCurrencyBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

async function parseJsonSafely(response: Response) {
  const texto = await response.text();

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(`Resposta não é JSON. Início: ${texto.slice(0, 120)}`);
  }
}

function extrairProdutos(data: any): Produto[] {
  if (Array.isArray(data?.dados?.produtos)) return data.dados.produtos;
  if (Array.isArray(data?.produtos)) return data.produtos;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

export function ProdutosSection({ cidadeSelecionada, linkPedido, apiUrl }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarProdutos() {
      if (!cidadeSelecionada) {
        setProdutos([]);
        setErro('');
        return;
      }

      const url = `${apiUrl}/api/produtos/?cidade=${cidadeSelecionada}`;

      try {
        setLoading(true);
        setErro('');

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        const data = await parseJsonSafely(response);

        if (!response.ok || data?.ok === false) {
          throw new Error(data?.erro || 'Erro ao carregar produtos.');
        }

        setProdutos(extrairProdutos(data));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erro ao carregar produtos';
        setProdutos([]);
        setErro(message);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, [cidadeSelecionada, apiUrl]);

  const produtosFormatados = useMemo(() => {
    return produtos.map((produto) => ({
      ...produto,
      imagem: getImagemProduto(produto, apiUrl),
      precoFormatado: formatCurrencyBRL(Number(produto.preco_venda || 0)),
    }));
  }, [produtos, apiUrl]);

  return (
    <section id="produtos" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-black text-orange-700">
              Catálogo da sua região
            </span>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Produtos disponíveis na sua cidade
            </h2>
            <p className="mt-3 text-lg text-zinc-600">
              Escolha sua cidade acima para ver os itens liberados para pedido.
            </p>
          </div>

          <Link
            href={linkPedido}
            className="rounded-2xl bg-zinc-900 px-6 py-3 font-black text-white transition hover:bg-black"
          >
            Ir para pedido
          </Link>
        </div>

        {!cidadeSelecionada ? (
          <div className="rounded-[28px] border-2 border-dashed border-orange-300 bg-[#fffaf5] p-10 text-center shadow-sm">
            <p className="text-lg font-black text-zinc-800">
              Selecione sua cidade acima para visualizar os produtos.
            </p>
          </div>
        ) : loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[30px] border border-orange-200 bg-white p-8 shadow-sm"
              >
                <div className="animate-pulse">
                  <div className="h-6 w-24 rounded bg-zinc-200" />
                  <div className="mt-4 h-10 w-full rounded bg-zinc-100" />
                  <div className="mt-6 h-48 w-full rounded bg-zinc-100" />
                  <div className="mt-6 h-8 w-32 rounded bg-zinc-200" />
                  <div className="mt-3 h-5 w-24 rounded bg-zinc-100" />
                  <div className="mt-6 h-12 w-full rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
        ) : erro ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
            <p className="text-lg font-black text-red-700">Não foi possível carregar os produtos.</p>
            <p className="mt-2 text-sm text-red-600">{erro}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {produtosFormatados.length > 0 ? (
              produtosFormatados.map((produto) => (
                <div
                  key={produto.id}
                  className="group overflow-hidden rounded-[30px] border border-orange-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-[linear-gradient(180deg,_#fff7ed_0%,_#fffdf8_100%)]">
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700 shadow-sm">
                      {labelCidade(cidadeSelecionada)}
                    </div>

                    <div className="absolute right-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-zinc-900 shadow-sm">
                      Disponível
                    </div>

                    <div className="relative h-64">
                      <Image
                        src={produto.imagem}
                        alt={produto.nome}
                        fill
                        className="object-contain p-6 transition duration-300 group-hover:scale-[1.05]"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="p-7">
                    <div className="mb-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-600">
                      Pedido online
                    </div>

                    <h3 className="text-2xl font-black leading-tight text-zinc-900">
                      {produto.nome}
                    </h3>

                    <p className="mt-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
                      Preço unitário
                    </p>
                    <p className="mt-1 text-4xl font-black text-red-600">
                      {produto.precoFormatado}
                    </p>

                    <div className="mt-6 grid gap-3">
                      <Link
                        href={linkPedido}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-3.5 text-center font-black text-zinc-900 transition hover:bg-yellow-300"
                      >
                        Pedir agora
                      </Link>

                      <Link
                        href="/acompanhar-pedido"
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-300 px-5 py-3.5 text-center font-black text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Acompanhar pedido
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-orange-200 bg-white p-8 shadow-sm md:col-span-2 xl:col-span-3">
                <p className="font-black text-zinc-700">
                  Nenhum produto disponível nessa cidade no momento.
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Tente selecionar outra cidade ou volte mais tarde.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}