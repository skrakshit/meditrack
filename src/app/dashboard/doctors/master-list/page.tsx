
import { AppShell } from "@/components/app-shell";
import { departments, doctors } from "@/lib/data";
import { DoctorMasterListClient } from "@/components/doctor-master-list-client";

export default function DoctorMasterListPage() {
  return (
    <AppShell>
      <DoctorMasterListClient initialDoctors={doctors} departments={departments} />
    </AppShell>
  );
}
