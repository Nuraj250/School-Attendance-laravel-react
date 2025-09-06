import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function StudentsPage() {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("Grade 5");
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState("");

    async function fetchList() {
        const url = filter ? `/api/students?class_name=${encodeURIComponent(filter)}` : "/api/students";
        const { data } = await api.get(url);
        setList(data);
    }

    async function addStudent(e) {
        e.preventDefault();
        await api.post("/api/students", { name, class_name: className });
        setName(""); setClassName("Grade 5");
        await fetchList();
    }

    useEffect(() => { fetchList(); }, [filter]);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader title="Add Student" />
                <CardBody>
                    <form onSubmit={addStudent} className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1">Name</label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Class/Grade</label>
                            <Input value={className} onChange={e => setClassName(e.target.value)} placeholder="Grade 5" required />
                        </div>
                        <Button>Add</Button>
                    </form>
                </CardBody>
            </Card>

            <Card>
                <CardHeader
                    title="Students"
                    actions={<Input placeholder="Filter by class…" value={filter} onChange={e => setFilter(e.target.value)} />}
                />
                <CardBody>
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left">
                                    <th className="py-2 px-3">Name</th>
                                    <th className="px-3">Class</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(s => (
                                    <tr key={s.id} className="border-t hover:bg-neutral-50/60">
                                        <td className="py-2 px-3">{s.name}</td>
                                        <td className="px-3">{s.class_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
