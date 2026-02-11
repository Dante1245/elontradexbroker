import { DashboardHeader } from "@/components/dashboard-header";
import { SettingsForm } from "@/components/settings-form";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsFormSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-11" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <Separator />
          <Suspense fallback={<SettingsFormSkeleton />}>
            <SettingsForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
