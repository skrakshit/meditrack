
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
import type { Appointment, Doctor } from "@/lib/types";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { Logo } from "./icons";
import { Separator } from "./ui/separator";

interface AppointmentSlipDialogProps {
  appointment: Appointment;
  doctor: Doctor;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AppointmentSlipDialog({
  appointment,
  doctor,
  isOpen,
  onOpenChange,
}: AppointmentSlipDialogProps) {

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
              <DialogTitle className="font-headline text-xl">Appointment Slip</DialogTitle>
              <DialogDescription>
                Appointment ID: {appointment.id.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
            <div className="font-semibold">Patient Name:</div>
            <div>{appointment.patientName}</div>

            <div className="font-semibold">Age/Gender:</div>
            <div>{appointment.patientAge} / {appointment.patientGender}</div>
            
            <div className="font-semibold">Contact:</div>
            <div>{appointment.patientContact}</div>

            <div className="font-semibold">Appointment Date:</div>
            <div>{format(appointment.date, "dd-MMM-yyyy")}</div>

            <div className="font-semibold">Appointment Time:</div>
            <div>{appointment.time}</div>

            <div className="font-semibold">Consulting Doctor:</div>
            <div>{doctor?.name || 'N/A'} ({doctor?.department})</div>

            <div className="font-semibold">Reason for Visit:</div>
            <div>{appointment.reason}</div>
        </div>
        
        <Separator />
        
        <div className="text-center text-sm text-muted-foreground pt-2">
            Please arrive 15 minutes before your scheduled appointment time.
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
