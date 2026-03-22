import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import type {
  Request as ExpressRequest,
  Response,
  NextFunction,
} from "express";

// Arcjet client
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect from common attacks
    shield({ mode: "LIVE" }),

    //Bot detection
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // allow Google etc.
    }),

    // Rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 5, // seconds
      capacity: 5,
    }),
  ],
});

// Middleware
export async function arcjetMiddleware(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  if (!process.env.ARCJET_KEY) {
    return next();
  }

  try {
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // Use global Fetch Request (Node 18+)
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      }
    }

    headers.set("x-forwarded-for", req.ip);

    const request = new globalThis.Request(url, {
      method: req.method,
      headers,
    });

    const decision = await aj.protect(req, { requested: 1 });

    console.log("Arcjet decision:", decision);

    if (decision.isDenied()) {
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({
          error: "Too Many Requests",
        });
      }

      if (decision.reason?.isBot?.()) {
        return res.status(403).json({
          error: "No bots allowed",
        });
      }

      return res.status(403).json({
        error: "Forbidden",
      });
    }

    return next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    return next();
  }
}
