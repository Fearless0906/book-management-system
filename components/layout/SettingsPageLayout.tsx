import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

interface SettingsPageLayoutProps {
  user: {
    name: string;
    email: string;
  };
}

export function SettingsPageLayout({ user }: SettingsPageLayoutProps) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralSettings user={user} />
          </TabsContent>
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
