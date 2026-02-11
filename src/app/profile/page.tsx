import { DashboardHeader } from "@/components/dashboard-header";
import { ProfileForm } from "@/components/profile-form";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information.
            </p>
          </div>
          <Separator />
          <Suspense fallback={<ProfileFormSkeleton />}>
            <ProfileForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
