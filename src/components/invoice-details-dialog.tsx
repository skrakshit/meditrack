
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Billing, Doctor, Patient } from "@/lib/types";
import { format } from "date-fns";
import { Printer, CreditCard, Mail } from "lucide-react";
import { Logo } from "./icons";
import { Separator } from "./ui/separator";

interface InvoiceDetailsDialogProps {
  bill: Billing;
  patient: Patient | null;
  doctor: Doctor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


export function InvoiceDetailsDialog({
  bill,
  patient,
  doctor,
  isOpen,
  onOpenChange,
}: InvoiceDetailsDialogProps) {

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };
  
  if (!patient || !doctor) {
    // This should ideally not happen due to the check in the parent, but it's good practice.
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl printable-area">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                 <Logo className="h-10 w-10"/>
                 <div>
                    <DialogTitle className="font-headline text-2xl">Invoice</DialogTitle>
                    <DialogDescription>
                        Invoice ID: {bill.id.toUpperCase()} | Generated on: {format(new Date(), "dd-MMM-yyyy")}
                    </DialogDescription>
                 </div>
              </div>
               <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-bold text-lg text-foreground">MediTrack Hospital</p>
                  <p>123 Health St, Wellness City, 560001</p>
                  <p>contact@meditrack.com | +91 80 1234 5678</p>
              </div>
            </div>
             <div className="text-right">
                <p className="font-bold text-lg">Status: {bill.status}</p>
                <p className="text-muted-foreground text-sm">Amount: Rs. {bill.amount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </DialogHeader>
        
        <Separator className="my-4"/>

        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <h3 className="font-semibold mb-2">Billed To</h3>
                <p className="font-bold">{patient.name}</p>
                <p>{patient.address}</p>
                <p>{patient.contact}</p>
            </div>
             <div className="text-right">
                <h3 className="font-semibold mb-2">Billed By</h3>
                <p className="font-bold">{doctor.name}</p>
                <p>{doctor.department}</p>
                <p>{doctor.email}</p>
            </div>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold mb-2">Service Details</h3>
            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left font-semibold">Service Type</th>
                            <th className="p-2 text-left font-semibold">Date of Service</th>
                            <th className="p-2 text-right font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2">{bill.serviceType}</td>
                            <td className="p-2">{format(bill.date, "dd-MMM-yyyy")}</td>
                            <td className="p-2 text-right">Rs. {bill.amount.toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                       <tr className="border-t font-bold">
                           <td colSpan={2} className="p-2 text-right">Total Amount</td>
                           <td className="p-2 text-right">Rs. {bill.amount.toLocaleString('en-IN')}</td>
                       </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t no-print">
            <div className="flex justify-between w-full">
                <div>
                     <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Print Invoice</Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Mail className="mr-2 h-4 w-4"/>Email to Patient</Button>
                    <Button><CreditCard className="mr-2 h-4 w-4" />Record Payment</Button>
                </div>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
