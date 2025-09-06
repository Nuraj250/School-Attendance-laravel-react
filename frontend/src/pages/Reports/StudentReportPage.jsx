import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";
import Header from "../../components/Header";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";

export default function StudentReportPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (!id) return;
        api.get(`/api/students/${id}/attendance`)
            .then(({ data }) => setData(data))
            .catch(e => setErr(e?.response?.data?.message || "Failed to load"));
    }, [id]);

    if (err) return <div className="p-4 text-red-600">{err}</div>;
    if (!data) return <div className="p-4">Loading…</div>;

    return (
        <div className="min-h-full">
            <Header />
            <main className="container py-6 space-y-6">
                <Card>
                    <CardHeader title="Student Report" />
                    <CardBody>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <Info title="Name" value={data.student.name} />
                            <Info title="Class" value={data.student.class_name} />
                            <Info title="Range" value={`${data.range.from} → ${data.range.to}`} />
                            <Info title="Totals" value={`P ${data.summary.present} / A ${data.summary.absent} / T ${data.summary.total}`} />
                        </div>

                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50">
                                    <tr className="text-left">
                                        <th className="py-2 px-3">Date</th>
                                        <th className="px-3">Class</th>
                                        <th className="px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.entries.map((row, i) => (
                                        <tr key={i} className="border-t hover:bg-neutral-50/60">
                                            <td className="py-2 px-3">{row.date}</td>
                                            <td className="px-3">{row.class_name}</td>
                                            <td className={`px-3 ${row.status === "present" ? "text-green-700" : "text-red-700"}`}>{row.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}

function Info({ title, value }) {
    return (
        <div className="rounded-xl border bg-white/60 p-3">
            <div className="text-xs text-neutral-500">{title}</div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}
