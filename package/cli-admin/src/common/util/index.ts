// `2026-10-29 14:05`, in the local time zone
export const formatDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// `text` cut to `width` columns, with an ellipsis when it was longer
export const fit = (text: string, width: number): string =>
  text.length <= width
    ? text.padEnd(width)
    : text.slice(0, Math.max(0, width - 1)) + '…'
