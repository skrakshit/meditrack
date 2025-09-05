
import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "@/components/dashboard-client";
import { patients, doctors, appointments, billings, labAppointments } from "@/lib/data";

export default function DashboardPage() {
  // In a real app, you would fetch this data from an API
  const patientData = patients;
  const doctorData = doctors;
  const appointmentData = appointments;
  const billingData = billings;
  const labAppointmentData = labAppointments;


  return (
    <AppShell>
      <DashboardClient 
        patients={patientData} 
        doctors={doctorData}
        appointments={appointmentData}
        billings={billingData}
        labAppointments={labAppointmentData}
      />
    </AppShell>
  );
}
