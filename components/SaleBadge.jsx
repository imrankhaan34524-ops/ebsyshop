// components/SaleBadge.jsx
// Shows "-20%" when mrp is higher than price. Renders nothing otherwise.
const SaleBadge = ({ price, mrp, className = '' }) => {
    const p = Number(price)
    const m = Number(mrp)
    if (!m || !p || m <= p) return null

    const percent = Math.round(((m - p) / m) * 100)
    if (percent < 1) return null

    return (
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ef4444] text-white shadow ${className}`}>
            -{percent}%
        </span>
    )
}

export default SaleBadge
