import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://159.223.111.33:8000';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const caminho = resolvedParams.path.join('/');
    const url = `${BACKEND_URL}/media/${caminho}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type':
          response.headers.get('content-type') || 'application/octet-stream',
        'cache-control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Arquivo não encontrado.', { status: 404 });
  }
}