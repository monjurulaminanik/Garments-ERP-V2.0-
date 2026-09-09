"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarDays,
  CircleCheckBig,
  Download,
  Eye,
  FileSpreadsheet,
  LoaderCircle,
  Pencil,
  Search,
  TriangleAlert,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Input,
  Label,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  ToggleChip,
  taStatusTone,
  taskStatusTone,
} from "@/components/commercial/ui";
import {
  RiskLevel,
  TaTask,
  TaskStatus,
  useCommercialData,
} from "@/hooks/useCommercialData";
import { exportToExcel, exportToPDF } from "@/lib/commercialExport";
import { daysBetween, formatDate, formatNumber } from "@/lib/commercialFormat";
import { bn } from "@/lib/bn";

const TASK_STATUSES: TaskStatus[] = ["Completed", "In Progress", "Pending", "Delayed"];
const RISK_LEVELS: RiskLevel[] = ["On Time", "At Risk", "Delayed"];

export default function TaCalendarPage() {
  const { buyers, taTasks, updateTaTask } = useCommercialData();

  const [view, setView] = useState<"table" | "timeline">("table");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [delayedOnly, setDelayedOnly] = useState(false);
  const [todaysOnly, setTodaysOnly] = useState(false);

  const [search, setSearch] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [viewTask, setViewTask] = useState<TaTask | null>(null);
  const [editTask, setEditTask] = useState<TaTask | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: "Pending" as TaskStatus,
    actualDate: "",
    risk: "On Time" as RiskLevel,
  });

  const departments = useMemo(() => Array.from(new Set(taTasks.map((t) => t.department))), [taTasks]);
  const today = new Date().toISOString().slice(0, 10);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return taTasks.filter((t) => {
      const matchesSearch =
        !q || t.po.toLowerCase().includes(q) || t.style.toLowerCase().includes(q) || t.buyer.toLowerCase().includes(q);
      const buyerObj = buyers.find((b) => b.name === t.buyer);
      const matchesBuyer = buyerFilter === "all" || buyerObj?.id === buyerFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesDept = deptFilter === "all" || t.department === deptFilter;
      const matchesRisk = riskFilter === "all" || t.risk === riskFilter;
      const matchesFrom = !fromDate || t.plannedDate >= fromDate;
      const matchesTo = !toDate || t.plannedDate <= toDate;
      const matchesHighRisk = !highRiskOnly || t.risk !== "On Time";
      const matchesDelayed = !delayedOnly || t.status === "Delayed" || t.risk === "Delayed";
      const matchesToday = !todaysOnly || t.plannedDate === today;
      return (
        matchesSearch &&
        matchesBuyer &&
        matchesStatus &&
        matchesDept &&
        matchesRisk &&
        matchesFrom &&
        matchesTo &&
        matchesHighRisk &&
        matchesDelayed &&
        matchesToday
      );
    });
  }, [taTasks, buyers, search, buyerFilter, statusFilter, deptFilter, riskFilter, fromDate, toDate, highRiskOnly, delayedOnly, todaysOnly, today]);

  const kpis = {
    total: taTasks.length,
    delayed: taTasks.filter((t) => t.status === "Delayed" || t.risk === "Delayed").length,
    inProgress: taTasks.filter((t) => t.status === "In Progress").length,
    completed: taTasks.filter((t) => t.status === "Completed").length,
  };

  function resetFilters() {
    setSearch("");
    setBuyerFilter("all");
    setStatusFilter("all");
    setDeptFilter("all");
    setRiskFilter("all");
    setFromDate("");
    setToDate("");
  }

  function openEdit(task: TaTask) {
    setUpdateForm({ status: task.status, actualDate: task.actualDate, risk: task.risk });
    setEditTask(task);
  }

  function handleUpdateSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editTask) return;
    updateTaTask(editTask.id, { ...updateForm });
    setEditTask(null);
  }

  const exportColumns = [
    { header: "Buyer", key: "buyer" },
    { header: "PO", key: "po" },
    { header: "Style", key: "style" },
    { header: "Task", key: "taskName" },
    { header: "Department", key: "department" },
    { header: "Owner", key: "owner" },
    { header: "Planned Date", key: "plannedDate" },
    { header: "Actual Date", key: "actualDate" },
    { header: "Status", key: "status" },
    { header: "Risk", key: "risk" },
  ];

  function exportRows() {
    return filteredTasks.map((t) => ({
      buyer: t.buyer,
      po: t.po,
      style: t.style,
      taskName: t.taskName,
      department: t.department,
      owner: t.owner,
      plannedDate: formatDate(t.plannedDate),
      actualDate: t.actualDate ? formatDate(t.actualDate) : "—",
      status: t.status,
      risk: t.risk,
    }));
  }

  async function handleExportPdf() {
    await exportToPDF({ title: bn.ta.heading, subtitle: bn.ta.subtitle, columns: exportColumns, data: exportRows(), filename: "ta-calendar" });
  }

  async function handleExportExcel() {
    await exportToExcel({ columns: exportColumns, data: exportRows(), filename: "ta-calendar", sheetName: "T&A Tasks" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{bn.ta.heading}</h1>
          <p className="mt-1 text-sm text-slate-500">{bn.ta.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            {bn.exportExcel}
          </Button>
          <Button variant="secondary" onClick={handleExportPdf}>
            <Download className="h-4 w-4" />
            {bn.exportPdf}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile icon={<CalendarDays className="h-5 w-5" />} label={bn.ta.totalTasks} value={formatNumber(kpis.total)} tone="teal" />
        <KpiTile icon={<TriangleAlert className="h-5 w-5" />} label={bn.ta.delayed} value={formatNumber(kpis.delayed)} tone="red" />
        <KpiTile icon={<LoaderCircle className="h-5 w-5" />} label={bn.ta.inProgress} value={formatNumber(kpis.inProgress)} tone="blue" />
        <KpiTile icon={<CircleCheckBig className="h-5 w-5" />} label={bn.ta.completed} value={formatNumber(kpis.completed)} tone="green" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={view}
          onChange={(v) => setView(v as "table" | "timeline")}
          items={[
            { value: "table", label: bn.ta.tableView },
            { value: "timeline", label: bn.ta.timelineView },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip active={highRiskOnly} onClick={() => setHighRiskOnly((v) => !v)} tone="amber" icon={<TriangleAlert className="h-3.5 w-3.5" />}>
            {bn.ta.highRiskOnly}
          </ToggleChip>
          <ToggleChip active={delayedOnly} onClick={() => setDelayedOnly((v) => !v)} tone="red">
            {bn.ta.delayedOnly}
          </ToggleChip>
          <ToggleChip active={todaysOnly} onClick={() => setTodaysOnly((v) => !v)}>
            {bn.ta.todaysTasks}
          </ToggleChip>
        </div>
      </div>

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label>{bn.ta.searchOrder}</Label>
            <Input icon={<Search className="h-4 w-4" />} placeholder={bn.ta.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <Label>{bn.orders.selectBuyer}</Label>
            <Select value={buyerFilter} onChange={(e) => setBuyerFilter(e.target.value)}>
              <option value="all">{bn.all}</option>
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{bn.ta.taskStatus}</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">{bn.all}</option>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{bn.ta.department}</Label>
            <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="all">{bn.all}</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{bn.ta.plannedFrom}</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <Label>{bn.ta.plannedTo}</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div>
            <Label>{bn.ta.riskLevel}</Label>
            <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="all">{bn.all}</option>
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="secondary" onClick={resetFilters} className="w-full">
              {bn.reset}
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card>
          <EmptyState message={bn.noData} />
        </Card>
      ) : view === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Info</TableHead>
                <TableHead>Task Details</TableHead>
                <TableHead>Planned vs Actual</TableHead>
                <TableHead>{bn.status}</TableHead>
                <TableHead>Delay / Risk</TableHead>
                <TableHead className="text-right">{bn.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <p className="font-semibold text-slate-800">{task.buyer}</p>
                    <p className="text-xs text-slate-500">PO: {task.po}</p>
                    <p className="text-xs text-slate-400">Style: {task.style}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-700">{task.taskName}</p>
                    <p className="text-xs text-slate-400">{task.department}</p>
                    <p className="text-xs text-slate-400">Owner: {task.owner}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-500">Planned: {formatDate(task.plannedDate)}</p>
                    <p className="text-xs text-slate-500">Actual: {task.actualDate ? formatDate(task.actualDate) : "—"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge tone={taskStatusTone(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge tone={taStatusTone(task.risk === "On Time" ? "On Track" : task.risk)}>{task.risk}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="secondary" size="sm" onClick={() => setViewTask(task)}>
                        <Eye className="h-3.5 w-3.5" />
                        {bn.view}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(task)}>
                        <Pencil className="h-3.5 w-3.5" />
                        {bn.update}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <TimelineView tasks={filteredTasks} onView={setViewTask} onEdit={openEdit} />
      )}

      {/* View task modal */}
      <Modal
        open={!!viewTask}
        onClose={() => setViewTask(null)}
        title={viewTask ? viewTask.taskName : ""}
        description={viewTask ? `${viewTask.buyer} — PO: ${viewTask.po} · ${viewTask.style}` : ""}
        size="md"
      >
        {viewTask && (
          <div className="grid grid-cols-2 gap-3">
            <ViewField label={bn.ta.department} value={viewTask.department} />
            <ViewField label={bn.ta.owner} value={viewTask.owner} />
            <ViewField label={bn.ta.plannedDate} value={formatDate(viewTask.plannedDate)} />
            <ViewField label={bn.ta.actualDate} value={viewTask.actualDate ? formatDate(viewTask.actualDate) : "—"} />
            <ViewField label={bn.status} value={viewTask.status} />
            <ViewField label={bn.ta.riskLevel} value={viewTask.risk} />
          </div>
        )}
      </Modal>

      {/* Update status modal */}
      <Modal
        open={!!editTask}
        onClose={() => setEditTask(null)}
        title={editTask ? `${bn.ta.updateStatus} — ${editTask.taskName}` : ""}
        description={editTask ? `${editTask.buyer} — PO: ${editTask.po}` : ""}
        size="sm"
      >
        {editTask && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <Label>{bn.status}</Label>
              <Select value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value as TaskStatus })}>
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{bn.ta.actualDate}</Label>
              <Input type="date" value={updateForm.actualDate} onChange={(e) => setUpdateForm({ ...updateForm, actualDate: e.target.value })} />
            </div>
            <div>
              <Label>{bn.ta.riskLevel}</Label>
              <Select value={updateForm.risk} onChange={(e) => setUpdateForm({ ...updateForm, risk: e.target.value as RiskLevel })}>
                {RISK_LEVELS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditTask(null)}>
                {bn.cancel}
              </Button>
              <Button type="submit">{bn.save}</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function TimelineView({
  tasks,
  onView,
  onEdit,
}: {
  tasks: TaTask[];
  onView: (t: TaTask) => void;
  onEdit: (t: TaTask) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, TaTask[]>();
    tasks.forEach((t) => {
      const key = `${t.buyer} · ${t.po}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      style: items[0].style,
      items: [...items].sort((a, b) => a.plannedDate.localeCompare(b.plannedDate)),
    }));
  }, [tasks]);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.key}>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{group.key}</p>
                <p className="text-xs text-slate-400">Style: {group.style}</p>
              </div>
              <p className="text-xs text-slate-400">{group.items.length} tasks</p>
            </div>
            <div className="relative overflow-x-auto pb-2">
              <div className="flex min-w-max items-start gap-0">
                {group.items.map((task, idx) => {
                  const dotTone =
                    task.status === "Completed"
                      ? "bg-emerald-500"
                      : task.status === "In Progress"
                      ? "bg-blue-500"
                      : task.status === "Delayed"
                      ? "bg-red-500"
                      : "bg-slate-300";
                  const delay = task.actualDate ? daysBetween(task.plannedDate, task.actualDate) : null;
                  return (
                    <div key={task.id} className="flex items-start">
                      <button
                        onClick={() => onView(task)}
                        className="group flex w-40 flex-col items-center text-center"
                      >
                        <span className={`mb-1.5 h-4 w-4 rounded-full ring-4 ring-white ${dotTone}`} />
                        <p className="line-clamp-2 text-xs font-semibold text-slate-700 group-hover:text-teal-700">
                          {task.taskName}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{formatDate(task.plannedDate)}</p>
                        {delay !== null && delay > 0 && (
                          <span className="mt-1 text-[10px] font-semibold text-amber-600">+{delay}d</span>
                        )}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                          }}
                          className="mt-1 cursor-pointer text-[10px] font-semibold text-teal-600 hover:underline"
                        >
                          {bn.update}
                        </span>
                      </button>
                      {idx < group.items.length - 1 && <div className="mt-2 h-0.5 w-10 bg-slate-200" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
      <p className="text-[10px] uppercase text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function KpiTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "teal" | "blue" | "green" | "red";
}) {
  const toneClasses: Record<string, string> = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03]">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
