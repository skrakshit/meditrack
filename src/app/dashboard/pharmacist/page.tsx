import { PharmacistDashboardClient } from "@/components/pharmacist-dashboard-client";
import { patients } from "@/lib/data";

// Mock data for prescriptions
const prescriptions = [
    { id: "presc1", patientId: "pat1", medication: "Aspirin 81mg", dosage: "1 tablet daily", status: "Pending" },
    { id: "presc2", patientId: "pat2", medication: "Lisinopril 10mg", dosage: "1 tablet daily", status: "Filled" },
    { id: "presc3", patientId: "pat4", medication: "Amoxicillin 500mg", dosage: "1 capsule every 8 hours", status: "Pending" },
    { id: "presc4", patientId: "pat5", medication: "Metformin 500mg", dosage: "2 tablets daily", status: "Cancelled" },
]


export default function PharmacistDashboardPage() {
  return (
      <PharmacistDashboardClient
        initialPrescriptions={prescriptions}
        patients={patients}
      />
  );
}
