import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://159.223.111.33:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade = searchParams.get('cidade') || '';

    const url = new URL(`${BACKEND_URL}/api/produtos/`);
    if (cidade) {
      url.searchParams.set('cidade', cidade);
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type':
          response.headers.get('content-type') || 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        erro: 'Erro ao consultar produtos no servidor.',
        detalhe: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}