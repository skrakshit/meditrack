
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Billing, Patient, BillingStatus, Doctor } from "@/lib/types";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceDetailsDialog } from "./invoice-details-dialog";
import { doctors } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";


interface BillingClientProps {
  initialBillings: Billing[];
  patients: Patient[];
}

export function BillingClient({
  initialBillings,
  patients,
}: BillingClientProps) {
  const [billings] = useState(initialBillings);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Billing | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | BillingStatus>("All");
  const { toast } = useToast();
  
  const getPatient = (patientId: string) => patients.find((p) => p.id === patientId);
  const getDoctor = (doctorId: string) => doctors.find((d) => d.id === doctorId);

  const getStatusVariant = (status: BillingStatus) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Pending":
        return "secondary";
      case "Overdue":
        return "destructive";
    }
  };

  const handleViewInvoice = (bill: Billing) => {
    const patient = getPatient(bill.patientId);
    const doctor = getDoctor(bill.doctorId);

    if (!patient || !doctor) {
        toast({
            variant: "destructive",
            title: "Error: Missing Data",
            description: "Could not find patient or doctor details for this invoice."
        });
        console.error(`Could not find details for invoice ${bill.id}. Patient found: ${!!patient}, Doctor found: ${!!doctor}`);
        return;
    }
    setSelectedBill(bill);
    setIsInvoiceOpen(true);
  }

  const filteredBillings = useMemo(() => {
    if (statusFilter === "All") {
      return billings;
    }
    return billings.filter((bill) => bill.status === statusFilter);
  }, [billings, statusFilter]);

  const selectedPatient = selectedBill ? getPatient(selectedBill.patientId) : null;
  const selectedDoctor = selectedBill ? getDoctor(selectedBill.doctorId) : null;

  return (
    <div className="printable-area-container">
      <div className="flex flex-col gap-4 no-print">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">
            Billing
          </h1>
           <div className="ml-auto flex items-center gap-2">
             <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-xl border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillings.map((bill) => {
                const patient = getPatient(bill.patientId);
                const doctor = getDoctor(bill.doctorId);
                return(
                <TableRow key={bill.id} className="cursor-pointer" onClick={() => handleViewInvoice(bill)}>
                  <TableCell className="font-medium">{bill.id.toUpperCase()}</TableCell>
                  <TableCell>{patient?.name || "Unknown"}</TableCell>
                  <TableCell>{doctor?.name || "Unknown"}</TableCell>
                  <TableCell>{format(bill.date, "dd-MMM-yyyy")}</TableCell>
                  <TableCell>Rs. {bill.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewInvoice(bill)}}>
                        View Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </div>
      {selectedBill && selectedPatient && selectedDoctor && (
        <InvoiceDetailsDialog 
            bill={selectedBill} 
            patient={selectedPatient}
            doctor={selectedDoctor}
            isOpen={isInvoiceOpen} 
            onOpenChange={setIsInvoiceOpen} 
        />
      )}
    </div>
  );
}
