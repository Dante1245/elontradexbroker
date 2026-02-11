
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


export function BroadcastMessages() {
    const { toast } = useToast();
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const initiateSend = () => {
        if (!message.trim()) {
            toast({
                title: "Error",
                description: "Message cannot be empty.",
                variant: "destructive",
            });
            return; // Prevent showing confirmation for empty message
        }
        setShowConfirmation(true);
    };

    const confirmSend = async () => {
        setShowConfirmation(false); // Close confirmation
        setIsSending(true);

        // In a real app, this would call a server action to send the message.
        // For this prototype, we simulate the action.

        toast({
            title: "Broadcast Sent",
            description: "Your message has been sent to all users.",
        });
        
        setMessage("");
        setIsSending(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Broadcast Message</CardTitle>
        <CardDescription>
          Send an announcement or message to all users.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="broadcast-message">Message</Label>
          <Textarea
            id="broadcast-message"
            placeholder="Type your announcement here..."
            className="min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button onClick={initiateSend} disabled={isSending || !message.trim()}>
            {isSending ? "Sending..." : "Send Broadcast"}
        </Button>

        {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Confirm Broadcast</h3>
                    <p>Are you sure you want to send this message to all users?</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
                        <Button onClick={confirmSend} disabled={isSending}>Confirm</Button>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
