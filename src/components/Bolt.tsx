type BoltProps = {
  className?: string;
  style?: React.CSSProperties;
  flip?: boolean;
};

/** Cream lightning bolt with an orange stroke, matching the poster. */
const Bolt = ({ className = "", style, flip = false }: BoltProps) => (
  <svg
    viewBox="0 0 64 120"
    aria-hidden="true"
    className={className}
    style={{ ...style, transform: flip ? `scaleX(-1) ${style?.transform ?? ""}` : style?.transform }}
    fill="hsl(var(--cream))"
    stroke="hsl(var(--orange))"
    strokeWidth="5"
    strokeLinejoin="round"
  >
    <path d="M38 4 6 60h22L14 116l44-66H36L54 4Z" />
  </svg>
);

export default Bolt;
