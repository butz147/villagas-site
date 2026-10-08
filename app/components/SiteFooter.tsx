import { SITE_CONFIG } from '../config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 lg:grid-cols-4 md:px-6">
        <div>
          <img
            src="/logo-villagas.png"
            alt={SITE_CONFIG.nome}
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600">
            Entrega de gás e água com praticidade, rapidez e atendimento confiável para sua cidade.
          </p>
        </div>

        <div>
          <h4 className="font-black text-zinc-900">Contato</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumero}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-600 hover:underline"
              >
                {SITE_CONFIG.telefone}
              </a>
            </li>
            <li>
              Telefone:{' '}
              <a
                href={`tel:+55${SITE_CONFIG.telefoneFixo.replace(/\D/g, '')}`}
                className="font-semibold text-orange-600 hover:underline"
              >
                {SITE_CONFIG.telefoneFixo}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-zinc-900">Atendimento</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {SITE_CONFIG.horario.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
            <li>Cidades atendidas: {SITE_CONFIG.cidadesAtendidas.join(', ')}</li>
            <li>Pedidos com acompanhamento online</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-zinc-900">Nossas lojas</h4>
          <ul className="mt-3 space-y-3 text-sm text-zinc-600">
            {SITE_CONFIG.lojas.map((loja) => (
              <li key={loja.cidade}>
                <span className="block">{loja.endereco}</span>
                <a
                  href={loja.mapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Ver no mapa
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}