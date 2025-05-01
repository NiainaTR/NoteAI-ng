"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out successfully.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "error signing out",
        description: "there is a problem signing out",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      className="bg-doc text-white"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <>
          <LogOut className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      )}
    </Button>
  );
}
