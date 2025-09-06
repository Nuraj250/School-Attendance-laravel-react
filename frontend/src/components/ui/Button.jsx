export default function Button({ children, variant = "primary", className = "", ...props }) {
    const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition shadow-sm hover:shadow md:active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-black text-white hover:bg-neutral-900",
        outline: "border border-neutral-300 hover:bg-neutral-50",
        subtle: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };
    return (
        <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    );
}
