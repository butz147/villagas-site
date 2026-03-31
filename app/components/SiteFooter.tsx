import { SITE_CONFIG } from '../config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:px-6">
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
            <li>WhatsApp: {SITE_CONFIG.telefone}</li>
            <li>Telefone: {SITE_CONFIG.telefoneFixo}</li>
            <li>Email: {SITE_CONFIG.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-zinc-900">Atendimento</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li>{SITE_CONFIG.horario}</li>
            <li>Cidades atendidas: {SITE_CONFIG.cidadesAtendidas.join(', ')}</li>
            <li>Pedidos com acompanhamento online</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}