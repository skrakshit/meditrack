import { AppShell } from "@/components/app-shell";
import { billings, patients } from "@/lib/data";
import { BillingClient } from "@/components/billing-client";

export default function BillingPage() {
  return (
    <AppShell>
      <BillingClient initialBillings={billings} patients={patients} />
    </AppShell>
  );
}
