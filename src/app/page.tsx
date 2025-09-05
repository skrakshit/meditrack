import Link from "next/link";
import { Stethoscope, User, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getDashboardLink(role: string) {
    switch (role.toLowerCase()) {
        case "laboratory":
            return "/dashboard/laboratory";
        case "admin":
             return "/dashboard";
        default:
            return "/dashboard";
    }
}


function LoginForm({ role }: { role: string }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Link
            href="#"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input id={`${role}-password`} type="password" required />
      </div>
      <Button type="submit" className="w-full" asChild>
        <Link href={getDashboardLink(role)}>Login as {role}</Link>
      </Button>
    </div>
  );
}


export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Tabs defaultValue="admin" className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Stethoscope className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">MediTrack</CardTitle>
          <CardDescription>
            Select your role to login to your account
          </CardDescription>
        </CardHeader>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admin"><User className="h-4 w-4 mr-1"/>Admin</TabsTrigger>
          <TabsTrigger value="lab"><FlaskConical className="h-4 w-4 mr-1"/>Laboratory</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <Card>
            <CardContent className="pt-6">
              <LoginForm role="Admin" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lab">
           <Card>
            <CardContent className="pt-6">
              <LoginForm role="Laboratory" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
