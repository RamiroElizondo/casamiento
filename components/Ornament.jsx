// Anillos de boda entrelazados con diamante: ornamento de sección.
// Usa currentColor, así que se tiñe con la clase de texto del contenedor.
export default function Ornament({ className = '' }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 34" fill="none" className="h-7 w-14">
        <circle cx="26" cy="20" r="10" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="38" cy="20" r="10" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
        {/* diamante sobre el anillo izquierdo */}
        <path d="M26 3l3.2 3.6L26 11l-3.2-4.4L26 3z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M22.8 6.6h6.4" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        {/* destellos */}
        <path d="M52 6v4M50 8h4" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M12 9v3M10.5 10.5h3" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      </svg>
    </div>
  );
}
