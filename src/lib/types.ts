
import type { GenerateLabReportOutput } from "@/ai/flows/generate-lab-report";

export type PatientStatus = "Admitted" | "Under Observation" | "Discharged";
export type Department = "Cardiology" | "Neurology" | "Pediatrics" | "Orthopedics" | "General";
export type Gender = "Male" | "Female" | "Other";
export type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";
export type AppointmentMode = "In-person" | "Online" | "Telephonic";
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid";
export type DoctorStatus = "Active" | "Inactive" | "On Leave";
export type BillingStatus = "Paid" | "Pending" | "Overdue";
export type VisitType = "New" | "Follow-up" | "Referral";


export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  address: string;
  status: PatientStatus;
  doctorId: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: Department;
  qualification: string; // e.g. "MBBS, MD"
  experience: number; // in years
  availability: string[]; // e.g., ["Monday 9-12", "Wednesday 14-17"]
  languages: string[]; // e.g. ["English", "Hindi"]
  email: string;
  status: DoctorStatus;
}

export interface Appointment {
  id: string;
  patientId: string; // This will now be a newly generated ID
  // Patient details are now part of the appointment itself
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  patientContact: string;
  doctorId: string;
  date: Date;
  time: string;
  reason: string;
  status: AppointmentStatus;
  mode: AppointmentMode;
  duration: number; // in minutes
  fees: number;
  paymentStatus: PaymentStatus;
}

export interface MedicalRecord {
  id:string;
  patientId: string;
  date: Date;
  type: "Note" | "Report";
  title: string;
  content: string;
  fileUrl?: string;
}

export interface Billing {
  id: string;
  patientId: string;
  appointmentId: string;
  doctorId: string;
  amount: number;
  date: Date;
  status: BillingStatus;
  serviceType: string;
}

export interface Analyte {
    analyte: string;
    result: string;
    referenceRange: string;
}


export interface LabAppointment {
  id: string;
  patientId: string;
  testName: string;
  date: Date;
  status: "Scheduled" | "Completed" | "Cancelled";
  reportData?: GenerateLabReportOutput;
}

export interface OPDRegistration {
  id: string; // OPD Number
  date: Date;
  time: string;
  patientName: string;
  age: number;
  gender: Gender;
  contact: string;
  department: Department;
  doctorId: string;
  reason: string;
  visitType: VisitType;
  fees: number;
  paymentStatus: "Paid" | "Pending";
}
