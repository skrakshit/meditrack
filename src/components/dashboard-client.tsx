
"use client";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  FlaskConical,
  Menu,
  Package2,
  Search,
  Users,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Patient, Doctor, Appointment, Billing, LabAppointment, PatientStatus } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

interface DashboardClientProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  billings: Billing[];
  labAppointments: LabAppointment[];
}

const COLORS: Record<PatientStatus, string> = {
  Admitted: "hsl(var(--chart-1))",
  "Under Observation": "hsl(var(--chart-2))",
  Discharged: "hsl(var(--chart-3))",
};

export function DashboardClient({
  patients,
  doctors,
  appointments,
  billings,
}: DashboardClientProps) {
  const getPatientName = (patientId: string) =>
    patients.find((p) => p.id === patientId)?.name || "Unknown";

  const getDoctorName = (doctorId: string) =>
    doctors.find((d) => d.id === doctorId)?.name || "Unassigned";

  const totalRevenue = billings
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + b.amount, 0);

  const patientStatusCounts = patients.reduce((acc, patient) => {
    acc[patient.status] = (acc[patient.status] || 0) + 1;
    return acc;
  }, {} as Record<PatientStatus, number>);

  const patientStatusData = Object.entries(patientStatusCounts).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Dashboard
        </h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString("en-IN")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors on Duty</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>
                An overview of upcoming patient appointments.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/appointments">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 5).map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{getPatientName(appointment.patientId)}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {appointment.patientId}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDoctorName(appointment.doctorId)}
                    </TableCell>
                    <TableCell>
                       {format(appointment.date, "dd-MMM-yyyy")} at {appointment.time}
                    </TableCell>
                    <TableCell className="text-right">{appointment.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient Status Distribution</CardTitle>
            <CardDescription>
              A breakdown of current patient statuses in the hospital.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
                config={{}}
                className="mx-auto aspect-square h-[250px]"
            >
                <PieChart>
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={patientStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        labelLine={false}
                    >
                        {patientStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as PatientStatus]} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
