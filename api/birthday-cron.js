
import { timingSafeEqual } from "crypto";

function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;

  // Protect the endpoint using timing-safe comparison to prevent side-channel timing attacks
  const authHeader = req.headers.authorization || "";
  const expectedAuth = `Bearer ${secret}`;

  if (!secret || !safeCompare(authHeader, expectedAuth)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const year = new Date().getUTCFullYear();
    const today = new Date().toISOString().slice(5, 10);

    // Match Feb 29 birthdays on March 1 in non-leap years
    const isLeapYear =
      year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0);

    const birthdaysToMatch = [today];

    if (!isLeapYear && today === "03-01") {
      birthdaysToMatch.push("02-29");
    }

    const dbResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/birthday_subscribers?select=id,email,birthday,last_sent_year&subscribed=eq.true&limit=1000`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!dbResponse.ok) {
      throw new Error("Failed to fetch subscribers");
    }

    const subscribers = await dbResponse.json();

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const birthday = subscriber.birthday.slice(5);

      if (
        !birthdaysToMatch.includes(birthday) ||
        subscriber.last_sent_year === year
      ) {
        continue;
      }

      const emailResponse = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL,
            to: [subscriber.email],
            subject: "Happy Birthday from MyAgeNow! 🎂",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.7">
                <h1>Happy Birthday! 🎂</h1>
                <p>Everyone at MyAgeNow wishes you a wonderful birthday.</p>
                <p>May your year ahead be filled with happiness and success!</p>
                <p>
                  Visit <a href="https://myagenow.today/">
                  MyAgeNow</a> to calculate your age.
                </p>
              </div>
            `
          })
        }
      );

      if (!emailResponse.ok) {
        console.error(
          "Resend error:",
          await emailResponse.text()
        );
        failed++;
        continue;
      }

      const updateResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/birthday_subscribers?id=eq.${subscriber.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization:
              `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            last_sent_year: year
          })
        }
      );

      if (!updateResponse.ok) {
        console.error("Failed to update sent-year record.");
        failed++;
        continue;
      }

      sent++;
    }

    return res.status(200).json({
      success: true,
      checked: subscribers.length,
      sent,
      failed,
      year
    });
  } catch (error) {
    console.error("Birthday cron error:", error);

    return res.status(500).json({
      error: "Birthday email job failed."
    });
  }
}
