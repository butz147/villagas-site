import { SITE_CONFIG } from '../config/site';

type WhatsAppButtonProps = {
  texto?: string;
  className?: string;
  fixed?: boolean;
};

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.46 0 .08 5.38.08 12c0 2.12.55 4.18 1.6 6L0 24l6.18-1.62A11.95 11.95 0 0 0 12.08 24h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.57-8.52ZM12.09 21.85h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.67.96.98-3.58-.23-.37A9.77 9.77 0 0 1 2.3 12c0-5.4 4.39-9.79 9.79-9.79 2.61 0 5.06 1.02 6.9 2.86A9.7 9.7 0 0 1 21.86 12c0 5.4-4.39 9.85-9.77 9.85Zm5.37-7.34c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.95 1.14-.17.2-.34.22-.63.08-.29-.15-1.24-.46-2.35-1.48-.87-.77-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.51.07-.77.37-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.2 2.05 3.12 4.97 4.38.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z" />
    </svg>
  );
}

export function WhatsAppButton({
  texto = 'WhatsApp',
  className = '',
  fixed = false,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${SITE_CONFIG.whatsappNumero}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappTexto
  )}`;

  const fixedClasses = fixed ? 'fixed bottom-5 right-5 z-40' : '';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={texto}
      className={`${fixedClasses} inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-4 text-sm font-black text-zinc-900 shadow-lg transition hover:scale-[1.02] hover:bg-yellow-300 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span>{texto}</span>
    </a>
  );
}
