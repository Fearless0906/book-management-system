import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ModeToggle } from "../themeToggle";

export function AppearanceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span>Toggle Theme</span>
        <ModeToggle />
      </CardContent>
    </Card>
  );
}
