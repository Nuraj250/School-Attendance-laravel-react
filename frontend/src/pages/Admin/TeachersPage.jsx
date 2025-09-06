import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function TeachersPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("secret123");
    const [list, setList] = useState([]);

    async function fetchList() {
        const { data } = await api.get("/api/teachers");
        setList(data);
    }
    async function addTeacher(e) {
        e.preventDefault();
        await api.post("/api/teachers", { name, email, password });
        setName(""); setEmail(""); setPassword("secret123");
        await fetchList();
    }
    useEffect(() => { fetchList(); }, []);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader title="Add Teacher" />
                <CardBody>
                    <form onSubmit={addTeacher} className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1">Name</label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <Input type="text" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button>Create</Button>
                    </form>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Teachers" />
                <CardBody>
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left">
                                    <th className="py-2 px-3">Name</th>
                                    <th className="px-3">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(t => (
                                    <tr key={t.id} className="border-t hover:bg-neutral-50/60">
                                        <td className="py-2 px-3">{t.name}</td>
                                        <td className="px-3">{t.email}</td>
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
