'use client';

type CheckoutBarProps = {
  total: string;
  disabled?: boolean;
  loading?: boolean;
  targetId: string;
};

export function CheckoutBar({
  total,
  disabled = false,
  loading = false,
  targetId,
}: CheckoutBarProps) {
  function handleSubmit() {
    if (disabled || loading) return;

    const form = document.getElementById(targetId) as HTMLFormElement | null;

    if (!form) {
      console.error(`Formulário com id "${targetId}" não encontrado.`);
      return;
    }

    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
      return;
    }

    form.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 p-3 shadow-[0_-6px_24px_rgba(0,0,0,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            Total do pedido
          </p>
          <p
            className="truncate text-xl font-black text-zinc-900"
            aria-live="polite"
          >
            {total}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || loading}
          aria-label={loading ? 'Enviando pedido' : 'Finalizar pedido'}
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Finalizar pedido'}
        </button>
      </div>
    </div>
  );
}