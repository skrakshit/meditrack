import { DoctorDashboardClient } from "@/components/doctor-dashboard-client";
import { patients, appointments } from "@/lib/data";

export default function DoctorDashboardPage() {
  const doctorId = "doc1"; // In a real app, you would get this from the logged in user
  const doctorAppointments = appointments.filter(a => a.doctorId === doctorId);
  const patientIds = new Set(doctorAppointments.map(a => a.patientId));
  const doctorPatients = patients.filter(p => patientIds.has(p.id));

  return (
      <DoctorDashboardClient
        appointments={doctorAppointments}
        patients={doctorPatients}
      />
  );
}
