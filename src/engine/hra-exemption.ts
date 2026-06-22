export function computeHraExemption(
  basic: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean,
): number {
  if (hraReceived <= 0 || rentPaid <= 0 || basic <= 0) {
    return 0
  }

  const rentMinus10PercentBasic = Math.max(0, rentPaid - 0.1 * basic)
  const percentOfBasic = (isMetro ? 0.5 : 0.4) * basic

  return Math.min(hraReceived, rentMinus10PercentBasic, percentOfBasic)
}
