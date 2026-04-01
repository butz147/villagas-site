import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://159.223.111.33:8000';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/pedidos/criar-pedido-site/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (contentType.includes('application/json')) {
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      });
    }

    return NextResponse.json(
      {
        ok: false,
        erro: `Backend retornou ${response.status} e não JSON.`,
        detalhe_html: text.slice(0, 1000),
      },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        erro: 'Erro ao criar pedido no proxy.',
        detalhe: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}