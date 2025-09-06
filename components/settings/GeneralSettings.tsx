import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GeneralSettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export function GeneralSettings({ user }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and manage your profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={user.name} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user.email} type="email" readOnly />
        </div>
        <p className="text-sm text-muted-foreground">
          To change your name or email, please contact an administrator.
        </p>
      </CardContent>
    </Card>
  );
}
