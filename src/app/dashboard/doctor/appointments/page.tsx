import { AppointmentsClient } from "@/components/appointments-client";
import { UserNav } from "@/components/user-nav";
import { appointments, doctors, patients } from "@/lib/data";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DoctorAppointmentsPage() {
    const doctorId = "doc1"; // In a real app, you would get this from the logged in user
    const doctorAppointments = appointments.filter(a => a.doctorId === doctorId);

    return (
        <div className="min-h-screen w-full bg-background">
             <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/doctor" className="flex items-center gap-2 font-semibold">
                        <Logo className="h-6 w-6" />
                        <span>MediTrack - Doctor Portal</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                       <Link href="/dashboard/doctor">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <UserNav />
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <AppointmentsClient
                    initialAppointments={doctorAppointments}
                    patients={patients}
                    doctors={doctors}
                />
            </main>
        </div>
    );
}
