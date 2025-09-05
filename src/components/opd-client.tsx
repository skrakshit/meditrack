
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Printer, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OPDRegistration, Doctor, Department, Gender, VisitType } from "@/lib/types";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";
import { OpdSlipDialog } from "./opd-slip-dialog";


interface OpdClientProps {
  initialRegistrations: OPDRegistration[];
  doctors: Doctor[];
  departments: Department[];
}

const genders: Gender[] = ["Male", "Female", "Other"];
const visitTypes: VisitType[] = ["New", "Follow-up", "Referral"];

const createFormSchema = (departments: Department[]) => z.object({
  patientName: z.string().min(1, "Patient name is required"),
  age: z.coerce.number().min(0, "Age cannot be negative"),
  gender: z.enum(genders as [string, ...string[]]),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/i, "Invalid time format (e.g., 10:00 AM)"),
  department: z.enum(departments as [string, ...string[]]),
  doctorId: z.string().min(1, "Doctor is required"),
  reason: z.string().min(1, "Reason for visit is required"),
  visitType: z.enum(visitTypes as [string, ...string[]]),
  fees: z.coerce.number().min(0, "Fees cannot be negative"),
  paymentStatus: z.enum(["Paid", "Pending"]),
});

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export function OpdClient({
  initialRegistrations,
  doctors,
  departments,
}: OpdClientProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<OPDRegistration | null>(null);
  const { toast } = useToast();
  
  const formSchema = createFormSchema(departments);

  const getDoctor = (doctorId: string) =>
    doctors.find((d) => d.id === doctorId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      age: 0,
      contact: "",
      time: "",
      visitType: "New",
      fees: 1000,
      paymentStatus: "Pending",
    },
  });

  const onSubmit = (data: FormValues) => {
    const newRegistration: OPDRegistration = {
      id: `opd-${String(registrations.length + 1).padStart(3, '0')}`,
      date: new Date(),
      ...data,
    };
    setRegistrations((prev) => [newRegistration, ...prev]);
    setIsDialogOpen(false);
    form.reset();
    toast({
      title: "Patient Registered",
      description: `${data.patientName} has been registered for an OPD visit.`,
    });
  };

  const handlePrintSlip = (registration: OPDRegistration) => {
    setSelectedRegistration(registration);
    setIsSlipOpen(true);
  }

  const getPaymentStatusVariant = (status: "Paid" | "Pending") => {
    return status === "Paid" ? "default" : "secondary";
  };
  
  const getVisitTypeVariant = (visitType: VisitType) => {
    switch (visitType) {
        case "New": return "default";
        case "Follow-up": return "secondary";
        case "Referral": return "outline";
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 no-print">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">
            OPD Registration
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              className="h-9 gap-1"
              onClick={() => setIsDialogOpen(true)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Register New Patient
              </span>
            </Button>
          </div>
        </div>
        <Card>
            <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Today's OPD Registrations</p>
            </CardContent>
        </Card>
        <div className="rounded-xl border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OPD No.</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Visit Type</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.id.toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{reg.patientName}</div>
                    <div className="text-xs text-muted-foreground">Age: {reg.age} | {reg.gender}</div>
                  </TableCell>
                  <TableCell>{reg.department}</TableCell>
                  <TableCell>{getDoctor(reg.doctorId)?.name || "Unknown"}</TableCell>
                   <TableCell>
                    <Badge variant={getVisitTypeVariant(reg.visitType)}>{reg.visitType}</Badge>
                  </TableCell>
                  <TableCell>Rs. {reg.fees.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusVariant(reg.paymentStatus)}>
                      {reg.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handlePrintSlip(reg)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print OPD Slip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Patient Registration</DialogTitle>
            <DialogDescription>
              Fill in the form to register a new patient for an OPD visit.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 10:30 AM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctors.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name} - {d.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit / Chief Complaint</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Fever, headache, routine checkup..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField
                    control={form.control}
                    name="visitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visit Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visitTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consultation Fees</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Register & Generate Bill</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {selectedRegistration && (
        <div className="printable-area-container">
            <OpdSlipDialog
                registration={selectedRegistration}
                doctor={getDoctor(selectedRegistration.doctorId)}
                isOpen={isSlipOpen}
                onOpenChange={setIsSlipOpen}
            />
        </div>
      )}
    </>
  );
}
