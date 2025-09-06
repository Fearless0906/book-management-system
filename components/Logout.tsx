"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutProps {
  collapsed?: boolean;
}

export function Logout({ collapsed = false }: LogoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`w-full ${collapsed ? "px-2" : ""}`}
      title={collapsed ? "Logout" : undefined}
    >
      {collapsed ? (
        <LogOut className="h-4 w-4" />
      ) : (
        <>
          Logout <LogOut className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
}
