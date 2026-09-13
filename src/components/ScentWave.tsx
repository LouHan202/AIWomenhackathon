/** Decorative scent trails; transform-only motion with a reduced-motion fallback. */
export function ScentWave() {
  return (
    <div className="scent-wave" aria-hidden="true">
      <svg viewBox="0 0 1200 320" fill="none" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="scent-wave-fade" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff8d5c" stopOpacity="0" />
            <stop offset="0.45" stopColor="#ff8d5c" stopOpacity="0.3" />
            <stop offset="0.75" stopColor="#ff8d5c" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff8d5c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((group) => (
          <g key={group} className={`scent-wave-drift scent-wave-drift-${group}`} stroke="url(#scent-wave-fade)" strokeWidth="0.8">
            {Array.from({ length: 7 }, (_, index) => {
              const offset = index * 9 + group * 15
              return <path key={index} d={`M -100 ${220 + offset} C 180 ${280 + offset}, 300 ${30 + offset}, 550 ${110 + offset} S 840 ${290 - offset}, 1040 ${100 + offset} S 1250 ${80 + offset}, 1350 ${130 + offset}`} />
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
