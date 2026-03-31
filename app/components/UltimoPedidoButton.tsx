'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  href: string;
  texto: string;
  className?: string;
};

export function UltimoPedidoButton({ href, texto, className = '' }: Props) {
  const [tem, setTem] = useState(false);

  useEffect(() => {
    try {
      setTem(!!localStorage.getItem('villagas_ultimo_pedido_dados'));
    } catch (_) {}
  }, []);

  if (!tem) return null;

  return (
    <Link href={href} className={className}>
      {texto}
    </Link>
  );
}
