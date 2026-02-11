"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";
import { getMockNotification } from "@/lib/actions";

export function NotificationHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const showRandomNotification = async () => {
      try {
        const result = await getMockNotification();
        if (result.success && result.notification) {
          toast({
            title: "Recent Activity",
            description: result.notification,
            action: (
              <div className="p-1 rounded-full bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            ),
          });
        }
      } catch (error) {
        // Silently fail if Genkit isn't running
      }
    };

    // Show first notification after a short delay
    const firstTimeout = setTimeout(showRandomNotification, 5000);

    // Then show notifications at a random interval
    const interval = setInterval(showRandomNotification, Math.random() * 15000 + 10000); // 10-25 seconds

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [toast]);

  return null;
}
