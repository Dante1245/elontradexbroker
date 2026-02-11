import { AdminLayout } from "@/components/admin/admin-layout";
import { UserManagement } from "@/components/admin/user-management";
import { SiteSettings } from "@/components/admin/site-settings";
import { DashboardMetrics } from "@/components/admin/dashboard-metrics";
import { BroadcastMessages } from "@/components/admin/broadcast-messages";
import { WithdrawalRequests } from "@/components/admin/withdrawal-requests";
import { AdminAgent } from "@/components/admin/admin-agent";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";


export default function AdminPage() {
  return (
    <AdminLayout>
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
            <div className="space-y-6">
              <DashboardMetrics />
              <Separator />
              <AdminAgent />
            </div>
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="withdrawals">
            <WithdrawalRequests />
        </TabsContent>
        <TabsContent value="broadcast">
            <BroadcastMessages />
        </TabsContent>
        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
