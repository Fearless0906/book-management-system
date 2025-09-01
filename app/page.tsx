"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  const login = () => {
    router.push("/login")
  }

  return (
    <div>
      <h1>Main landing page</h1>

      <Button variant="default" onClick={login}>Login</Button>
    </div>
  );
}
