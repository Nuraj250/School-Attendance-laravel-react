export default function Banner({ tone = "info", children }) {
    const styles = {
        info: "bg-blue-50 text-blue-800 border-blue-200",
        success: "bg-green-50 text-green-800 border-green-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        danger: "bg-red-50 text-red-800 border-red-200",
    };
    return <div className={`rounded-xl border px-3 py-2 text-sm ${styles[tone]}`}>{children}</div>;
}
