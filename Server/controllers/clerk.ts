import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../configs/prisma.js";
const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);
    //Getting data from the request

    const { data, type } = evt;
    //switch case for different events
    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            id: data.id,
            email: data.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });
        break;
      }

      case "user.updated": {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            email: data.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });
        break;
      }
      case "user.deleted": {
        await prisma.user.delete({
          where: {
            id: data.id,
          },
        });
        break;
      }
      case "paymentAttempt.updated": {
        if (
          (data.charge_type === "recurring" ||
            data.charge_type === "checkout") &&
          data.status === "paid"
        ) {
          const credits = { pro: 80, premimum: 240 };
          const clerkUserId = data?.payer?.user_id;
          const planIdRaw = data?.subscription_items?.[0]?.plan?.slug;
          // ✅ Validate user
          if (!clerkUserId) {
            return res.status(400).json({ message: "User ID missing" });
          }

          // ✅ Validate plan safely
          if (!planIdRaw || !(planIdRaw in credits)) {
            return res.status(400).json({ message: "Invalid plan" });
          }

          const planId = planIdRaw as keyof typeof credits;

          if (planId !== "pro" && planId !== "premimum") {
            return res.status(400).json({
              message: "Invalid plan",
            });
          }
          console.log(planId);
          try {
            await prisma.user.update({
              where: { id: clerkUserId },
              data: {
                credits: {
                  increment: credits[planId],
                },
              },
            });
            console.log(`✅ Credits added for ${planId}`);
          } catch (error) {
            console.error("❌ User update failed:", error);
            return res.status(400).json({
              message: "DB update failed",
            });
          }
        }
        break;
      }
      default: {
        break;
      }
    }
    res.status(200).json({
      received: true,
      message: "Webhook received successfully: " + type,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ received: false, message: "Webhook received failed" });
  }
};

export default clerkWebhook;
