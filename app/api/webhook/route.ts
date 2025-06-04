import { parseWebhookEvent, verifyAppKeyWithNeynar } from "@farcaster/frame-node";
import { saveNotificationToken, deleteNotificationToken } from "@/lib/edge-config";
import { NextResponse } from "next/server";

type WebhookEvent = {
  fid: number;
} & (
  | { event: "frame_added"; notificationDetails?: { token: string; url: string; } }
  | { event: "frame_removed" }
  | { event: "notifications_enabled"; notificationDetails: { token: string; url: string; } }
  | { event: "notifications_disabled" }
);

export async function POST(req: Request) {
  try {
    const data = (await parseWebhookEvent(await req.text(), verifyAppKeyWithNeynar)) as unknown as WebhookEvent;

    switch (data.event) {
      case "frame_added":
      case "notifications_enabled": {
        if (data.notificationDetails) {
          await saveNotificationToken(
            data.fid,
            data.notificationDetails.token,
            data.notificationDetails.url
          );
        }
        break;
      }

      case "frame_removed":
      case "notifications_disabled": {
        await deleteNotificationToken(data.fid);
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: "Invalid webhook data",
        details: error.message
      }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}