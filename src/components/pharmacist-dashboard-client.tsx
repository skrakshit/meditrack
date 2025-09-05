"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pill, CheckCircle, Clock, XCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { UserNav } from "./user-nav";
import { Logo } from "./icons";
import Link from "next/link";

type PrescriptionStatus = "Pending" | "Filled" | "Cancelled";

interface Prescription {
    id: string;
    patientId: string;
    medication: string;
    dosage: string;
    status: PrescriptionStatus;
}


interface PharmacistDashboardClientProps {
  initialPrescriptions: Prescription[];
  patients: Patient[];
}

export function PharmacistDashboardClient({
  initialPrescriptions,
  patients,
}: PharmacistDashboardClientProps) {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const getPatientName = (patientId: string) =>
    patients.find((p) => p.id === patientId)?.name || "Unknown";

  const getStatusVariant = (status: PrescriptionStatus) => {
    switch (status) {
      case "Filled":
        return "default";
      case "Pending":
        return "secondary";
      case "Cancelled":
        return "destructive";
    }
  };

  const statusCounts = prescriptions.reduce((acc, presc) => {
    acc[presc.status] = (acc[presc.status] || 0) + 1;
    return acc;
  }, { Pending: 0, Filled: 0, Cancelled: 0 });

  return (
    <>
      <div className="min-h-screen w-full bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6" />
          <span>MediTrack - Pharmacist Portal</span>
        </Link>
        <div className="ml-auto">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Pharmacist Dashboard
            </h1>
        </header>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{prescriptions.length}</div>
                    <p className="text-xs text-muted-foreground">
                       Across all patients today.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statusCounts.Pending}</div>
                     <p className="text-xs text-muted-foreground">
                        To be filled.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Filled</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statusCounts.Filled}</div>
                     <p className="text-xs text-muted-foreground">
                        Ready for pickup.
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Prescription Queue</CardTitle>
                <CardDescription>Manage and track patient prescriptions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((presc) => (
                      <TableRow key={presc.id}>
                        <TableCell>{getPatientName(presc.patientId)}</TableCell>
                        <TableCell>{presc.medication}</TableCell>
                        <TableCell>{presc.dosage}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(presc.status)}>{presc.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Mark as Filled</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
}
