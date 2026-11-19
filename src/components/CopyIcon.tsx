export function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M8.5 3.5V2.2c0-.66-.54-1.2-1.2-1.2H2.2C1.54 1 1 1.54 1 2.2v5.1c0 .66.54 1.2 1.2 1.2h1.3"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  )
}

export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6.4 4.8 9 10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
