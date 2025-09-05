import { AppShell } from "@/components/app-shell";
import { appointments, patients, doctors } from "@/lib/data";
import { AppointmentsClient } from "@/components/appointments-client";

export default function AppointmentsPage() {
  return (
    <AppShell>
      <AppointmentsClient
        initialAppointments={appointments}
        patients={patients}
        doctors={doctors}
      />
    </AppShell>
  );
}