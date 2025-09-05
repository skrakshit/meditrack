import { AppShell } from "@/components/app-shell";
import { opdRegistrations, doctors, departments } from "@/lib/data";
import { OpdClient } from "@/components/opd-client";

export default function OpdPage() {
  return (
    <AppShell>
      <OpdClient
        initialRegistrations={opdRegistrations}
        doctors={doctors}
        departments={departments}
      />
    </AppShell>
  );
}
