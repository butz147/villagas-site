'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SITE_CONFIG } from '../config/site';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CheckoutBar } from '../components/CheckoutBar';

type Produto = {
  id: number;
  nome: string;
  preco_venda: string;
  imagem_url?: string;
};

type FormData = {
  nome: string;
  telefone: string;
  cidade: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  produto: string;
  quantidade: string;
  forma_pagamento: string;
  observacoes: string;
  cupom: string;
};

type TipoMensagem = 'sucesso' | 'erro' | '';
type TipoCupom = 'sucesso' | 'erro' | '';
type CidadeSlug = 'jacarei' | 'sao-jose-dos-campos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const STORAGE_KEY_CLIENTE = 'villagas_cliente_dados';

type IconProps = {
  className?: string;
};

function CheckCircle({ className = 'h-5 w-5' }: IconProps) {
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

function MapPin({ className = 'h-5 w-5' }: IconProps) {
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

function CreditCard({ className = 'h-5 w-5' }: IconProps) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function Phone({ className = 'h-5 w-5' }: IconProps) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.29-1.29a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Home({ className = 'h-5 w-5' }: IconProps) {
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
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function Bag({ className = 'h-5 w-5' }: IconProps) {
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
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function getCidadeDaUrl(): CidadeSlug | '' {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(window.location.search);
  const cidade = params.get('cidade') || '';

  if (cidade === 'jacarei' || cidade === 'sao-jose-dos-campos') {
    return cidade;
  }

  return '';
}

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

function getImagemProduto(produto: Produto) {
  if (produto.imagem_url) {
    if (produto.imagem_url.startsWith('http')) return produto.imagem_url;
    return `${API_URL}${produto.imagem_url}`;
  }

  return getImagemFallback(produto.nome);
}

function calcularDescontoLocal(cupom: string, subtotal: number) {
  const codigo = cupom.trim().toUpperCase();

  if (codigo === 'PRIMEIRA10') {
    return Math.min(subtotal * 0.1, subtotal);
  }

  if (codigo === 'GAS5') {
    return Math.min(5, subtotal);
  }

  return 0;
}

function labelCidade(valor: string) {
  if (valor === 'jacarei') return 'Jacareí';
  if (valor === 'sao-jose-dos-campos') return 'São José dos Campos';
  return valor;
}

function labelPagamento(valor: string) {
  if (valor === 'dinheiro') return 'Dinheiro';
  if (valor === 'pix') return 'Pix';
  if (valor === 'credito') return 'Crédito';
  if (valor === 'debito') return 'Débito';
  return valor;
}

function formatCurrencyBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

async function parseJsonSafely(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || data.detail || 'Erro ao criar pedido');
  }
}

export default function PedidoPage() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const [lojaAberta, setLojaAberta] = useState<boolean | null>(null);
  const [horarioAbertura, setHorarioAbertura] = useState('');
  const [horarioFechamento, setHorarioFechamento] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  const [form, setForm] = useState<FormData>({
    nome: '',
    telefone: '',
    cidade: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    produto: '',
    quantidade: '1',
    forma_pagamento: 'dinheiro',
    observacoes: '',
    cupom: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<TipoMensagem>('');
  const [loading, setLoading] = useState(false);

  const [pedidoCriadoId, setPedidoCriadoId] = useState<number | null>(null);
  const [telefonePedidoCriado, setTelefonePedidoCriado] = useState('');

  const [mensagemCupom, setMensagemCupom] = useState('');
  const [tipoCupom, setTipoCupom] = useState<TipoCupom>('');
  const [cupomAplicado, setCupomAplicado] = useState('');
  const [descontoConfirmado, setDescontoConfirmado] = useState<number | null>(null);
  const [validandoCupom, setValidandoCupom] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const nomeRef = useRef<HTMLInputElement | null>(null);
  const telefoneRef = useRef<HTMLInputElement | null>(null);
  const cidadeRef = useRef<HTMLButtonElement | null>(null);
  const cepRef = useRef<HTMLInputElement | null>(null);
  const ruaRef = useRef<HTMLInputElement | null>(null);
  const numeroRef = useRef<HTMLInputElement | null>(null);
  const bairroRef = useRef<HTMLInputElement | null>(null);
  const quantidadeRef = useRef<HTMLInputElement | null>(null);
  const pagamentoRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const ultimoPedidoId = localStorage.getItem('villagas_ultimo_pedido_id');
    const ultimoPedidoTelefone = localStorage.getItem('villagas_ultimo_pedido_telefone');

    if (ultimoPedidoId) setPedidoCriadoId(Number(ultimoPedidoId));
    if (ultimoPedidoTelefone) setTelefonePedidoCriado(ultimoPedidoTelefone);
  }, []);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY_CLIENTE);
    const cidadeDaUrl = getCidadeDaUrl();

    if (dadosSalvos) {
      try {
        const cliente = JSON.parse(dadosSalvos);

        setForm((prev) => ({
          ...prev,
          nome: cliente.nome || '',
          telefone: cliente.telefone || '',
          cidade: cidadeDaUrl || cliente.cidade || '',
          cep: cliente.cep || '',
          rua: cliente.rua || '',
          numero: cliente.numero || '',
          bairro: cliente.bairro || '',
          complemento: cliente.complemento || '',
        }));
        return;
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    }

    if (cidadeDaUrl) {
      setForm((prev) => ({
        ...prev,
        cidade: cidadeDaUrl,
      }));
    }
  }, []);

  useEffect(() => {
    function sincronizarCidadeDaUrl() {
      const cidadeDaUrl = getCidadeDaUrl();

      if (cidadeDaUrl) {
        setForm((prev) => ({
          ...prev,
          cidade: cidadeDaUrl,
        }));
      }
    }

    sincronizarCidadeDaUrl();
    window.addEventListener('popstate', sincronizarCidadeDaUrl);

    return () => {
      window.removeEventListener('popstate', sincronizarCidadeDaUrl);
    };
  }, []);

  useEffect(() => {
    const ultimoPedido = localStorage.getItem('villagas_ultimo_pedido_dados');

    if (!ultimoPedido) return;

    try {
      const dados = JSON.parse(ultimoPedido);

      setForm((prev) => ({
        ...prev,
        cidade: prev.cidade || dados.cidade || '',
        quantidade: dados.quantidade || '1',
        forma_pagamento: dados.forma_pagamento || 'dinheiro',
        cupom: dados.cupom || '',
        observacoes: dados.observacoes || '',
      }));
    } catch (error) {
      console.error('Erro ao carregar último pedido:', error);
    }
  }, []);

  useEffect(() => {
    async function carregarProdutos() {
      if (!form.cidade) {
        setProdutos([]);
        setLojaAberta(null);
        setHorarioAbertura('');
        setHorarioFechamento('');
        setNomeLoja('');
        setForm((prev) => ({ ...prev, produto: '' }));
        return;
      }

      try {
        setCarregandoProdutos(true);
        setMensagem('');
        setTipoMensagem('');

        const response = await fetch(`${API_URL}/api/produtos/?cidade=${form.cidade}`);
        const data = await parseJsonSafely(response);

        if (!response.ok || data?.ok === false) {
          throw new Error(data?.erro || 'Não foi possível carregar os produtos.');
        }

        const dados = data?.dados || data;
        const lista = Array.isArray(dados.produtos) ? dados.produtos : [];

        setProdutos(lista);
        setLojaAberta(dados.loja_aberta ?? null);
        setHorarioAbertura(dados.horario_abertura || '');
        setHorarioFechamento(dados.horario_fechamento || '');
        setNomeLoja(dados.nome_loja || '');

        const ultimoPedido = localStorage.getItem('villagas_ultimo_pedido_dados');
        let produtoSalvo = '';

        if (ultimoPedido) {
          try {
            const dadosSalvos = JSON.parse(ultimoPedido);
            const existeProduto = lista.some(
              (p: Produto) => String(p.id) === String(dadosSalvos.produto)
            );
            if (existeProduto) {
              produtoSalvo = String(dadosSalvos.produto);
            }
          } catch (error) {
            console.error('Erro ao ler produto salvo:', error);
          }
        }

        setForm((prev) => ({
          ...prev,
          produto: produtoSalvo || (lista.length > 0 ? String(lista[0].id) : ''),
        }));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setTipoMensagem('erro');
        setMensagem('Não foi possível carregar os produtos da cidade selecionada.');
        setProdutos([]);
      } finally {
        setCarregandoProdutos(false);
      }
    }

    carregarProdutos();
  }, [form.cidade]);

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function formatarCep(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);

    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  async function buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      setBuscandoCep(true);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setTipoMensagem('erro');
        setMensagem('CEP não encontrado.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
      }));

      setTipoMensagem('');
      setMensagem('');
    } catch {
      setTipoMensagem('erro');
      setMensagem('Não foi possível buscar o CEP.');
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === 'telefone') {
      setForm((prev) => ({
        ...prev,
        telefone: formatarTelefone(value),
      }));
      return;
    }

    if (name === 'cep') {
      const cepFormatado = formatarCep(value);

      setForm((prev) => ({
        ...prev,
        cep: cepFormatado,
      }));

      if (cepFormatado.replace(/\D/g, '').length === 8) {
        buscarCep(cepFormatado);
      }
      return;
    }

    if (name === 'cupom') {
      setMensagemCupom('');
      setTipoCupom('');
      setCupomAplicado('');
      setDescontoConfirmado(null);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function limparDadosCliente() {
    localStorage.removeItem(STORAGE_KEY_CLIENTE);

    setForm((prev) => ({
      ...prev,
      nome: '',
      telefone: '',
      cidade: prev.cidade,
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
    }));
  }

  function selecionarCidade(cidade: CidadeSlug) {
    setForm((prev) => ({
      ...prev,
      cidade,
      produto: '',
    }));
    router.push(`/pedido?cidade=${cidade}`);
  }

  function montarEnderecoCompleto() {
    const partes = [
      form.rua && form.numero ? `${form.rua}, ${form.numero}` : form.rua || '',
      form.bairro ? `Bairro ${form.bairro}` : '',
      form.cep ? `CEP ${form.cep}` : '',
      form.complemento ? `Complemento ${form.complemento}` : '',
      form.cidade ? `Cidade ${labelCidade(form.cidade)}` : '',
    ].filter(Boolean);

    return partes.join(' - ');
  }

  function irParaCampo(
    ref: React.RefObject<HTMLElement | null>,
    mensagemErro: string
  ) {
    setTipoMensagem('erro');
    setMensagem(mensagemErro);

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setTimeout(() => {
      ref.current?.focus();
    }, 250);

    return false;
  }

  function validarFormulario() {
    if (!form.nome.trim()) {
      return irParaCampo(nomeRef, 'Informe seu nome.');
    }

    if (!form.telefone.trim()) {
      return irParaCampo(telefoneRef, 'Informe seu telefone.');
    }

    const telefoneLimpo = form.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10) {
      return irParaCampo(telefoneRef, 'Informe um telefone válido.');
    }

    if (!form.cidade.trim()) {
      return irParaCampo(cidadeRef, 'Selecione sua cidade.');
    }

    if (!form.cep.trim()) {
      return irParaCampo(cepRef, 'Informe o CEP.');
    }

    if (!form.rua.trim()) {
      return irParaCampo(ruaRef, 'Informe a rua.');
    }

    if (!form.numero.trim()) {
      return irParaCampo(numeroRef, 'Informe o número.');
    }

    if (!form.bairro.trim()) {
      return irParaCampo(bairroRef, 'Informe o bairro.');
    }

    if (!form.produto.trim()) {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setTipoMensagem('erro');
      setMensagem('Selecione um produto.');
      return false;
    }

    if (!form.quantidade.trim()) {
      return irParaCampo(quantidadeRef, 'Informe a quantidade.');
    }

    if (Number(form.quantidade) < 1) {
      return irParaCampo(quantidadeRef, 'A quantidade deve ser maior que zero.');
    }

    if (!form.forma_pagamento) {
      return irParaCampo(pagamentoRef, 'Selecione a forma de pagamento.');
    }

    if (lojaAberta === false) {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setTipoMensagem('erro');
      setMensagem(
        `A loja está fechada no momento. Horário de atendimento: ${horarioAbertura} às ${horarioFechamento}.`
      );
      return false;
    }

    return true;
  }

  const produtoSelecionado = useMemo(() => {
    return produtos.find((produto) => String(produto.id) === form.produto) || null;
  }, [produtos, form.produto]);

  const precoNumero = useMemo(() => {
    if (!produtoSelecionado) return 0;
    return Number(produtoSelecionado.preco_venda || 0);
  }, [produtoSelecionado]);

  const quantidadeNumero = useMemo(() => {
    return Number(form.quantidade || 0);
  }, [form.quantidade]);

  const subtotal = useMemo(() => {
    return precoNumero * quantidadeNumero;
  }, [precoNumero, quantidadeNumero]);

  const descontoCalculado = useMemo(() => {
    if (descontoConfirmado !== null) return descontoConfirmado;
    return calcularDescontoLocal(form.cupom, subtotal);
  }, [form.cupom, subtotal, descontoConfirmado]);

  const totalFinal = useMemo(() => {
    return Math.max(subtotal - descontoCalculado, 0);
  }, [subtotal, descontoCalculado]);

  const precoFormatado = useMemo(() => formatCurrencyBRL(precoNumero), [precoNumero]);
  const subtotalFormatado = useMemo(() => formatCurrencyBRL(subtotal), [subtotal]);
  const descontoFormatado = useMemo(
    () => formatCurrencyBRL(descontoCalculado),
    [descontoCalculado]
  );
  const totalFormatado = useMemo(() => formatCurrencyBRL(totalFinal), [totalFinal]);

  async function validarCupomAntes() {
    if (!form.cupom.trim()) {
      setMensagemCupom('');
      setTipoCupom('');
      setCupomAplicado('');
      setDescontoConfirmado(null);
      return true;
    }

    try {
      setValidandoCupom(true);

      const payload = {
        nome: form.nome || 'Cliente',
        telefone: form.telefone || '(00) 00000-0000',
        cidade: form.cidade,
        endereco: montarEnderecoCompleto() || 'Endereço não informado',
        produto_id: produtoSelecionado?.id,
        quantidade: Number(form.quantidade || 1),
        forma_pagamento: form.forma_pagamento,
        observacoes: form.observacoes,
        cupom: form.cupom,
        validar_apenas: true,
      };

      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok || data?.ok === false) {
        setTipoCupom('erro');
        setMensagemCupom(data?.erro || 'Cupom inválido.');
        setCupomAplicado('');
        setDescontoConfirmado(null);
        return false;
      }

      const dados = data?.dados || data;

      setTipoCupom('sucesso');
      setMensagemCupom(
        dados.cupom_aplicado
          ? `Cupom ${dados.cupom_aplicado} aplicado com sucesso.`
          : 'Cupom válido.'
      );
      setCupomAplicado(dados.cupom_aplicado || form.cupom.trim().toUpperCase());
      setDescontoConfirmado(Number(dados.desconto || 0));
      return true;
    } catch {
      setTipoCupom('erro');
      setMensagemCupom('Não foi possível validar o cupom agora.');
      setCupomAplicado('');
      setDescontoConfirmado(null);
      return false;
    } finally {
      setValidandoCupom(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMensagem('');
    setTipoMensagem('');
    setPedidoCriadoId(null);
    setTelefonePedidoCriado('');

    if (!validarFormulario()) return;

    if (!produtoSelecionado) {
      setTipoMensagem('erro');
      setMensagem('Produto não encontrado.');
      return;
    }

    if (form.cupom.trim()) {
      const cupomOk = await validarCupomAntes();
      if (!cupomOk) {
        setTipoMensagem('erro');
        setMensagem('Corrija o cupom antes de enviar o pedido.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        nome: form.nome,
        telefone: form.telefone,
        cidade: form.cidade,
        endereco: montarEnderecoCompleto(),
        produto_id: produtoSelecionado.id,
        quantidade: Number(form.quantidade || 1),
        forma_pagamento: form.forma_pagamento,
        observacoes: form.observacoes,
        cupom: form.cupom,
      };

      const response = await fetch(`${API_URL}/api/pedidos/criar-pedido-site/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.erro || 'Erro ao enviar pedido.');
      }

      const dados = data?.dados || data;

      const novoPedidoId = Number(dados.pedido_id);
      const descontoBackend = Number(dados.desconto || 0);

      setPedidoCriadoId(novoPedidoId);
      setTelefonePedidoCriado(form.telefone);
      setDescontoConfirmado(descontoBackend);

      if (dados.cupom_aplicado) {
        setCupomAplicado(dados.cupom_aplicado);
        setTipoCupom('sucesso');
        setMensagemCupom(`Cupom ${dados.cupom_aplicado} aplicado com sucesso.`);
      }

      localStorage.setItem('villagas_ultimo_pedido_id', String(novoPedidoId));
      localStorage.setItem('villagas_ultimo_pedido_telefone', form.telefone);

      localStorage.setItem(
        STORAGE_KEY_CLIENTE,
        JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          cidade: form.cidade,
          cep: form.cep,
          rua: form.rua,
          numero: form.numero,
          bairro: form.bairro,
          complemento: form.complemento,
        })
      );

      localStorage.setItem(
        'villagas_ultimo_pedido_dados',
        JSON.stringify({
          produto: String(produtoSelecionado.id),
          quantidade: form.quantidade,
          forma_pagamento: form.forma_pagamento,
          cupom: form.cupom,
          observacoes: form.observacoes,
          cidade: form.cidade,
        })
      );

      localStorage.setItem(
        'villagas_resumo_pedido',
        JSON.stringify({
          pedido_id: dados.pedido_id,
          produto: produtoSelecionado.nome,
          quantidade: form.quantidade,
          pagamento: labelPagamento(form.forma_pagamento),
          total: dados.total_final || totalFinal,
          cidade: labelCidade(form.cidade),
        })
      );

      router.push(
        `/pedido-sucesso?pedido_id=${dados.pedido_id}&min=${dados.tempo_min || ''}&max=${dados.tempo_max || ''}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao enviar pedido.';
      setTipoMensagem('erro');
      setMensagem(message);
    } finally {
      setLoading(false);
    }
  }

  const linkAcompanhar =
    pedidoCriadoId && telefonePedidoCriado
      ? `/acompanhar-pedido?pedido_id=${pedidoCriadoId}&telefone=${encodeURIComponent(
          telefonePedidoCriado
        )}`
      : '/acompanhar-pedido';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#fff1f2_40%,_#fff7ed)]">
      <SiteHeader
        showPedidoButton={false}
        showAcompanharButton={true}
        showBackToHome={true}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#b91c1c_0%,_#ea580c_48%,_#facc15_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),rgba(0,0,0,0.05))]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 text-white md:px-6 md:py-16">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-black backdrop-blur">
            Pedido online
          </span>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Finalize seu pedido com rapidez e segurança
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
            Selecione sua cidade, escolha o produto, informe o endereço e acompanhe o pedido depois.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <form id="form" ref={formRef} onSubmit={handleSubmit} className="grid gap-6">
              <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                      Cidade e atendimento
                    </p>
                    <h2 className="text-xl font-black text-zinc-900">Selecione sua cidade</h2>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    ref={cidadeRef}
                    type="button"
                    onClick={() => selecionarCidade('jacarei')}
                    className={`relative z-10 block rounded-[22px] border px-4 py-4 text-left transition ${
                      form.cidade === 'jacarei'
                        ? 'border-orange-400 bg-orange-50 text-zinc-900 shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-900 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">Jacareí</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Atendimento da região principal
                        </p>
                      </div>
                      {form.cidade === 'jacarei' && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => selecionarCidade('sao-jose-dos-campos')}
                    className={`relative z-10 block rounded-[22px] border px-4 py-4 text-left transition ${
                      form.cidade === 'sao-jose-dos-campos'
                        ? 'border-orange-400 bg-orange-50 text-zinc-900 shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-900 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">São José dos Campos</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Atendimento com produtos da loja da região
                        </p>
                      </div>
                      {form.cidade === 'sao-jose-dos-campos' && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </button>
                </div>

                {form.cidade && lojaAberta !== null && (
                  <div
                    className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-black ${
                      lojaAberta
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {lojaAberta ? 'Loja aberta agora' : 'Loja fechada no momento'} • {nomeLoja} •
                    Atendimento das {horarioAbertura} às {horarioFechamento}
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                        Seus dados
                      </p>
                      <h2 className="text-xl font-black text-zinc-900">Quem vai receber</h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={limparDadosCliente}
                    className="inline-flex rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-600"
                  >
                    Limpar dados
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">
                      Nome completo
                    </label>
                    <input
                      ref={nomeRef}
                      type="text"
                      name="nome"
                      placeholder="Digite seu nome completo"
                      value={form.nome}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">
                      WhatsApp
                    </label>
                    <input
                      ref={telefoneRef}
                      type="text"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={form.telefone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <Home className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                        Entrega
                      </p>
                      <h2 className="text-xl font-black text-zinc-900">Endereço do pedido</h2>
                    </div>
                  </div>

                  {buscandoCep && (
                    <span className="text-xs font-bold text-zinc-500">Buscando CEP...</span>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">CEP</label>
                    <input
                      ref={cepRef}
                      type="text"
                      name="cep"
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-black text-zinc-800">Rua</label>
                    <input
                      ref={ruaRef}
                      type="text"
                      name="rua"
                      placeholder="Nome da rua"
                      value={form.rua}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">Número</label>
                    <input
                      ref={numeroRef}
                      type="text"
                      name="numero"
                      placeholder="123"
                      value={form.numero}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">Bairro</label>
                    <input
                      ref={bairroRef}
                      type="text"
                      name="bairro"
                      placeholder="Nome do bairro"
                      value={form.bairro}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-zinc-800">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      placeholder="Apto, bloco, referência..."
                      value={form.complemento}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-orange-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Bag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                      Produto e pagamento
                    </p>
                    <h2 className="text-xl font-black text-zinc-900">Monte seu pedido</h2>
                  </div>
                </div>

                {!form.cidade ? (
                  <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50 px-4 py-4 text-sm font-bold text-orange-700">
                    Escolha sua cidade primeiro para visualizar os produtos disponíveis.
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {produtoSelecionado && (
                      <div className="overflow-hidden rounded-[26px] border border-orange-200 bg-[linear-gradient(180deg,_#fff7ed_0%,_#fffdf8_100%)]">
                        <div className="grid items-center gap-4 md:grid-cols-[190px_1fr]">
                          <div className="relative h-48 w-full">
                            <Image
                              src={getImagemProduto(produtoSelecionado)}
                              alt={produtoSelecionado.nome}
                              fill
                              className="object-contain p-5"
                              unoptimized
                            />
                          </div>

                          <div className="p-5 md:pl-0">
                            <p className="text-sm font-black uppercase tracking-wide text-orange-700">
                              Produto selecionado
                            </p>
                            <h3 className="mt-2 text-2xl font-black text-zinc-900">
                              {produtoSelecionado.nome}
                            </h3>
                            <p className="mt-2 text-3xl font-black text-red-600">
                              {precoFormatado}
                            </p>
                            <p className="mt-2 text-sm font-medium text-zinc-600">
                              Disponível para {labelCidade(form.cidade)}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="mb-3 block text-sm font-black text-zinc-800">
                        Escolha o produto
                      </label>

                      {carregandoProdutos ? (
                        <div className="rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-zinc-500">
                          Carregando produtos...
                        </div>
                      ) : produtos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm font-bold text-zinc-600">
                          Não há produtos disponíveis para essa cidade no momento.
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {produtos.map((produto) => {
                            const preco = formatCurrencyBRL(Number(produto.preco_venda || 0));
                            const selecionado = String(produto.id) === form.produto;

                            return (
                              <button
                                key={produto.id}
                                type="button"
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    produto: String(produto.id),
                                  }))
                                }
                                className={`cursor-pointer rounded-[26px] border p-4 text-left transition ${
                                  selecionado
                                    ? 'border-green-500 bg-green-50 shadow-md'
                                    : 'border-zinc-200 bg-white hover:border-orange-300 hover:shadow'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative h-20 w-20">
                                    <Image
                                      src={getImagemProduto(produto)}
                                      alt={produto.nome}
                                      fill
                                      className="object-contain"
                                      unoptimized
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="font-black text-zinc-900">{produto.nome}</h3>

                                    <p className="mt-1 text-lg font-black text-red-600">
                                      {preco}
                                    </p>

                                    <p className="text-xs text-zinc-500">Toque para selecionar</p>
                                  </div>

                                  {selecionado && (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-black text-zinc-800">
                          Quantidade
                        </label>
                        <input
                          ref={quantidadeRef}
                          type="number"
                          name="quantidade"
                          min="1"
                          value={form.quantidade}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-black text-zinc-800">
                          Forma de pagamento
                        </label>
                        <select
                          ref={pagamentoRef}
                          name="forma_pagamento"
                          value={form.forma_pagamento}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        >
                          <option value="dinheiro">Dinheiro</option>
                          <option value="pix">Pix</option>
                          <option value="credito">Crédito</option>
                          <option value="debito">Débito</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black text-zinc-800">
                        Cupom de desconto
                      </label>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          name="cupom"
                          placeholder="Ex: PRIMEIRA10"
                          value={form.cupom}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 uppercase text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />
                        <button
                          type="button"
                          onClick={validarCupomAntes}
                          disabled={validandoCupom || !form.cupom.trim()}
                          className="rounded-2xl bg-zinc-900 px-5 py-3 font-black text-white transition hover:bg-black disabled:opacity-60"
                        >
                          {validandoCupom ? 'Validando...' : 'Validar'}
                        </button>
                      </div>

                      {mensagemCupom && (
                        <div
                          className={`mt-3 rounded-2xl border px-4 py-3 text-sm font-black ${
                            tipoCupom === 'sucesso'
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                          }`}
                        >
                          {mensagemCupom}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black text-zinc-800">
                        Observações do pedido
                      </label>
                      <textarea
                        name="observacoes"
                        placeholder="Alguma observação especial para entrega?"
                        value={form.observacoes}
                        onChange={handleChange}
                        className="min-h-[110px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                )}
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

              {pedidoCriadoId && (
                <div className="rounded-[28px] border border-blue-200 bg-blue-50 p-5 shadow-sm">
                  <p className="text-sm font-bold text-blue-700">Pedido criado</p>
                  <p className="mt-1 text-2xl font-black text-blue-900">#{pedidoCriadoId}</p>
                  <p className="mt-2 text-sm font-medium text-blue-800">
                    Guarde esse número para acompanhar o andamento do pedido.
                  </p>

                  <Link
                    href={linkAcompanhar}
                    className="mt-4 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700"
                  >
                    Acompanhar pedido
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || carregandoProdutos || buscandoCep || lojaAberta === false}
                className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-base font-black text-white shadow-lg transition hover:from-green-700 hover:to-green-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Enviando pedido...' : 'Enviar pedido'}
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="sticky top-24 rounded-[30px] border border-orange-200 bg-white p-6 shadow-xl">
              <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3 text-zinc-900">
                <h3 className="text-lg font-black">Resumo do pedido</h3>
              </div>

              <div className="mt-5 rounded-[28px] bg-zinc-900 p-6 text-white">
                <p className="text-sm text-zinc-300">Produto selecionado</p>
                <h2 className="mt-2 text-2xl font-black">
                  {produtoSelecionado ? produtoSelecionado.nome : 'Escolha sua cidade primeiro'}
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Cidade</p>
                    <p className="mt-1 text-xl font-black text-white">
                      {form.cidade ? labelCidade(form.cidade) : 'Selecione sua cidade'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Preço unitário</p>
                    <p className="mt-1 text-3xl font-black text-yellow-400">{precoFormatado}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Quantidade</p>
                    <p className="mt-1 text-2xl font-black text-white">{quantidadeNumero}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Subtotal</p>
                    <p className="mt-1 text-2xl font-black text-white">{subtotalFormatado}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Cupom aplicado</p>
                    <p className="mt-1 text-xl font-black text-white">
                      {cupomAplicado || form.cupom.trim().toUpperCase() || 'Nenhum'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Desconto</p>
                    <p className="mt-1 text-2xl font-black text-green-400">
                      - {descontoFormatado}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-300">Pagamento</p>
                    <p className="mt-1 text-xl font-black text-white">
                      {labelPagamento(form.forma_pagamento)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-400 p-4 text-zinc-900">
                    <p className="text-sm font-bold">Total do pedido</p>
                    <p className="mt-1 text-3xl font-black">{totalFormatado}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-zinc-900 shadow-xl">
              <h3 className="text-2xl font-black">Precisa de ajuda?</h3>
              <p className="mt-3 leading-7 text-zinc-800">
                Fale com a equipe da {SITE_CONFIG.nome} pelo WhatsApp para agilizar seu atendimento.
              </p>

              <WhatsAppButton
                texto="Falar no WhatsApp"
                className="mt-5 rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-none hover:scale-100 hover:bg-black"
              />
            </div>
          </aside>
        </div>
      </section>

      <div className="h-24 md:hidden" />
      <SiteFooter />
      <WhatsAppButton fixed />
      <CheckoutBar
        total={totalFormatado}
        disabled={loading || carregandoProdutos || buscandoCep || lojaAberta === false}
        loading={loading}
        targetId="form"
      />
    </main>
  );
}