"use client";

import { useState } from "react";
import { Users, Fingerprint, Receipt, Plus, Search, FileDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Input,
  Label,
  Button,
  Tabs,
  Modal
} from "@/components/commercial/ui";
import { bn } from "@/lib/bn";

const mockEmployees = [
  { id: "EMP-001", name: "Md. Rahim", department: "Sewing", designation: "Operator", salary: "12,500", status: "Active" },
  { id: "EMP-002", name: "Kamrul Islam", department: "Cutting", designation: "Helper", salary: "10,000", status: "Active" },
  { id: "EMP-003", name: "Sumon Ali", department: "HR & Admin", designation: "Officer", salary: "18,000", status: "Active" },
];

const mockAttendance = [
  { date: "2026-09-10", empId: "EMP-001", name: "Md. Rahim", inTime: "07:55 AM", outTime: "05:05 PM", status: "Present", source: "ZKTeco" },
  { date: "2026-09-10", empId: "EMP-002", name: "Kamrul Islam", inTime: "08:15 AM", outTime: "-", status: "Late", source: "ZKTeco" },
];

export default function HRPage() {
  const [activeTab, setActiveTab] = useState("directory");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">HR, Admin & Payroll</h1>
          <p className="mt-1 text-sm text-slate-500">Employee Directory, Attendance, and Payroll Management</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { value: "directory", label: "Employee Directory", icon: <Users className="h-4 w-4" /> },
          { value: "attendance", label: "Attendance (ZKTeco)", icon: <Fingerprint className="h-4 w-4" /> },
          { value: "payroll", label: "Payroll Processing", icon: <Receipt className="h-4 w-4" /> },
        ]}
      />

      {activeTab === "directory" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee Master</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EMP ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmployees.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="font-semibold text-slate-700">{e.id}</TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell>{e.designation}</TableCell>
                    <TableCell>BDT {e.salary}</TableCell>
                    <TableCell>
                      <Badge tone={e.status === "Active" ? "green" : "red"}>{e.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "attendance" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daily Attendance</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Logs automatically synced from ZKTeco Device via Port Forwarding API.</p>
            </div>
            <Button size="sm" variant="secondary">
              <Fingerprint className="h-4 w-4 mr-2" /> Sync ZKTeco Device
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>EMP ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAttendance.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{a.empId}</TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.inTime}</TableCell>
                    <TableCell>{a.outTime}</TableCell>
                    <TableCell>
                      <Badge tone={a.status === "Present" ? "green" : "amber"}>{a.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge tone="blue">{a.source}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "payroll" && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center bg-slate-50">
              <Receipt className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Generate Monthly Payroll</p>
              <p className="text-xs text-slate-500 mb-4">Calculate wages based on attendance, overtime, and deductions.</p>
              <Button size="sm">Generate Salary Sheet</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
