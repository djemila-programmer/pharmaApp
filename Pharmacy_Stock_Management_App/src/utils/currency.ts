export const CFA_RATE = 655.957;

export function eurToCfa(amount: number, rate = CFA_RATE) {
  return amount * rate;
}

export function formatToCfa(
  amount: number,
  rate = CFA_RATE,
  options: { maximumFractionDigits?: number } = { maximumFractionDigits: 0 }
) {
  const value = Math.round(eurToCfa(amount, rate));
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(value);
}

export function formatXof(
  amount: number,
  options: { maximumFractionDigits?: number } = { maximumFractionDigits: 0 }
) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(Math.round(amount));
}
