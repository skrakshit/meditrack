
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
import type { OPDRegistration, Doctor } from "@/lib/types";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { Logo } from "./icons";
import { Separator } from "./ui/separator";

interface OpdSlipDialogProps {
  registration: OPDRegistration;
  doctor?: Doctor;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function OpdSlipDialog({
  registration,
  doctor,
  isOpen,
  onOpenChange,
}: OpdSlipDialogProps) {

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md printable-area">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div>
              <DialogTitle className="font-headline text-xl">OPD Slip</DialogTitle>
              <DialogDescription>
                OPD No: {registration.id.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
            <div className="font-semibold">Patient Name:</div>
            <div>{registration.patientName}</div>

            <div className="font-semibold">Age/Gender:</div>
            <div>{registration.age} / {registration.gender}</div>
            
            <div className="font-semibold">Contact:</div>
            <div>{registration.contact}</div>

            <div className="font-semibold">Visit Date & Time:</div>
            <div>{format(registration.date, "dd-MMM-yyyy")} at {registration.time}</div>

            <div className="font-semibold">Department:</div>
            <div>{registration.department}</div>

            <div className="font-semibold">Consulting Doctor:</div>
            <div>{doctor?.name || 'N/A'}</div>

            <div className="font-semibold">Reason for Visit:</div>
            <div>{registration.reason}</div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
            <div className="font-semibold">Visit Type:</div>
            <div>{registration.visitType}</div>

            <div className="font-semibold">Fees:</div>
            <div>Rs. {registration.fees.toLocaleString("en-IN")}</div>

            <div className="font-semibold">Payment Status:</div>
            <div className="font-bold">{registration.paymentStatus}</div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t no-print">
          <div className="flex justify-end w-full">
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Slip
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
