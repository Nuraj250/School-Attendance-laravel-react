export function Card({ children, className = "" }) {
    return <div className={`rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm ${className}`}>{children}</div>;
}
export function CardHeader({ title, actions }) {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">{title}</h2>
            <div className="flex items-center gap-2">{actions}</div>
        </div>
    );
}
export function CardBody({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}
