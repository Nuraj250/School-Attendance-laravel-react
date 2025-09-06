import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import Header from "../../components/Header";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Banner from "../../components/ui/Banner";

export default function AttendancePage() {
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState("");
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // { [studentId]: 'present'|'absent' }
    const [banner, setBanner] = useState("");

    useEffect(() => {
        api.get("/api/classes").then(({ data }) => {
            setClasses(data);
            if (data?.length) setClassName(data[0]);
        });
    }, []);

    useEffect(() => {
        if (!className) return;
        setBanner("");
        setStudents([]); setMarks({});
        api.get("/api/students/by-class", { params: { class_name: className } })
            .then(({ data }) => setStudents(data));
    }, [className]);

    function toggle(studentId, next) {
        setMarks(m => ({ ...m, [studentId]: next }));
    }

    async function save() {
        setBanner("");
        try {
            const { data: session } = await api.post("/api/attendance/sessions", { class_name: className });
            const payload = { marks: students.map(s => ({ student_id: s.id, status: marks[s.id] ?? "present" })) };
            await api.post(`/api/attendance/sessions/${session.id}/marks`, payload);
            setBanner("Saved ✅");
        } catch (e) {
            if (e?.response?.status === 409) {
                setBanner("Already marked today for this class (duplicate prevented).");
            } else {
                setBanner(e?.response?.data?.message || "Failed to save.");
            }
        }
    }

    const presentCount = useMemo(() =>
        Object.values(marks).filter(v => v !== "absent").length + (students.length - Object.keys(marks).length),
        [marks, students]);

    return (
        <div className="min-h-full">
            <Header role="teacher" />
            <main className="container py-6 space-y-6">
                <Card>
                    <CardHeader
                        title="Take Attendance"
                        actions={<Button onClick={save}>Save</Button>}
                    />
                    <CardBody>
                        <div className="flex gap-3 items-center mb-4">
                            <label className="text-sm">Class</label>
                            <Select value={className} onChange={e => setClassName(e.target.value)} className="w-auto">
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                            <div className="ml-auto text-sm text-neutral-600">Present: {presentCount}/{students.length}</div>
                        </div>

                        {banner && <div className="mb-4"><Banner tone={banner.includes("Saved") ? "success" : banner.includes("duplicate") ? "warning" : "danger"}>{banner}</Banner></div>}

                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50">
                                    <tr className="text-left">
                                        <th className="py-2 px-3">Student</th>
                                        <th className="px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(s => {
                                        const status = marks[s.id] ?? "present";
                                        return (
                                            <tr key={s.id} className="border-t hover:bg-neutral-50/60">
                                                <td className="py-2 px-3">{s.name}</td>
                                                <td className="px-3 py-2">
                                                    <div className="inline-flex rounded-full border overflow-hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggle(s.id, "present")}
                                                            className={`px-3 py-1 text-sm ${status === "present" ? "bg-green-600 text-white" : "hover:bg-neutral-100"}`}
                                                        >Present</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggle(s.id, "absent")}
                                                            className={`px-3 py-1 text-sm ${status === "absent" ? "bg-red-600 text-white" : "hover:bg-neutral-100"}`}
                                                        >Absent</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
