import { AppShell } from "@/components/app-shell";
import { labAppointments, patients } from "@/lib/data";
import { LabAppointmentsClient } from "@/components/lab-appointments-client";

export default function LabAppointmentsPage() {
  return (
    <AppShell>
      <LabAppointmentsClient
        initialLabAppointments={labAppointments}
        patients={patients}
      />
    </AppShell>
  );
}
