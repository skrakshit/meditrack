import { LaboratoryDashboardClient } from "@/components/laboratory-dashboard-client";
import { labAppointments, patients } from "@/lib/data";

export default function LaboratoryDashboardPage() {
  return (
      <LaboratoryDashboardClient
        initialLabAppointments={labAppointments}
        patients={patients}
      />
  );
}
