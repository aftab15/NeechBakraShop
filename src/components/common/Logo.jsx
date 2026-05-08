/**
 * Brand mark. Source asset is black-on-transparent, so we invert it
 * for the site's dark background. If a light theme is ever added,
 * gate the filter behind `(prefers-color-scheme: dark)` or a class.
 */
export default function Logo({ size = 28, className = '', alt = 'NeechBakra' }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        // Black-on-transparent → white-on-dark
        filter: 'brightness(0) invert(1)',
        // Avoid layout shift before the asset loads
        flexShrink: 0,
      }}
      draggable={false}
    />
  )
}
