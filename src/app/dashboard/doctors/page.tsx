import { AppShell } from "@/components/app-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doctors } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Brain, Bone, Baby, Star, MessageSquare, Phone, GraduationCap, Languages } from "lucide-react";
import type { Department } from "@/lib/types";
import { Button } from "@/components/ui/button";

const departmentIcons: Record<Department, React.ElementType> = {
  Cardiology: Heart,
  Neurology: Brain,
  Orthopedics: Bone,
  Pediatrics: Baby,
  General: Stethoscope,
};

export default function DoctorsPage() {
  const activeDoctors = doctors.filter(d => d.status === 'Active' || d.status === 'On Leave');

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Our Doctors
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeDoctors.map((doctor) => {
            const Icon = departmentIcons[doctor.department] || Stethoscope;
            return (
            <Card key={doctor.id} className="transition-all duration-200 hover:shadow-lg hover:scale-105 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/avatars/${doctor.id}.png`} alt={doctor.name} data-ai-hint="doctor headshot" />
                  <AvatarFallback>{doctor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.department}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow pb-6">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{doctor.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Languages className="h-4 w-4" />
                    <span>{doctor.languages.join(", ")}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availability.map((slot) => (
                      <Badge key={slot} variant="secondary">{slot}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </AppShell>
  );
}
