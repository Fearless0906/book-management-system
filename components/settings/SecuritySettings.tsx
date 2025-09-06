import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Change Password</span>
          <Button variant="outline" asChild>
            <Link href="/forgot-password">Change Password</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Two-Factor Authentication</span>
          <Button variant="outline" disabled>
            Enable 2FA (Coming Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
