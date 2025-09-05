
"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Activity,
  ArrowUpRight
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import type { Patient, Appointment } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserNav } from "./user-nav";
import { Logo } from "./icons";
import { PatientDetailsDialog } from "./patient-details-dialog";


interface DoctorDashboardClientProps {
  appointments: Appointment[];
  patients: Patient[];
}

export function DoctorDashboardClient({
  appointments,
  patients,
}: DoctorDashboardClientProps) {

  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);
  const upcomingAppointments = appointments.filter(a => a.date >= new Date());

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailsOpen(true);
  };


  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6" />
          <span>MediTrack - Doctor Portal</span>
        </Link>
        <div className="ml-auto">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">
            Doctor's Dashboard
          </h1>
        </header>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                You have {upcomingAppointments.length} upcoming appointments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                Under your care.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patient Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5</div>
              <p className="text-xs text-muted-foreground">
                New updates this week.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Here are your appointments for today and beyond.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/doctor/appointments">
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
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.slice(0, 5).map((appointment) => {
                    const patient = getPatient(appointment.patientId);
                    if (!patient) return null;
                    return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/avatars/${patient?.id}.png`} alt={patient?.name} data-ai-hint="patient headshot" />
                            <AvatarFallback>{patient?.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                              <div className="font-medium">{patient?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                  Age: {patient?.age}
                              </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.time}
                      </TableCell>
                      <TableCell>
                        {format(appointment.date, "PPP")}
                      </TableCell>
                      <TableCell >{appointment.reason}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(patient)}>
                              View Details
                          </Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </main>
    </div>
    {selectedPatient && (
        <PatientDetailsDialog
            patient={selectedPatient}
            isOpen={isPatientDetailsOpen}
            onOpenChange={setIsPatientDetailsOpen}
        />
    )}
    </>
  );
}
