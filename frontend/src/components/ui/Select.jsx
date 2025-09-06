export default function Select({ className = "", children, ...props }) {
    return (
        <select
            className={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-200 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}
