
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, birthday, consent, website } = req.body || {};

    // Honeypot field: bots should not fill this in.
    if (website) {
      return res.status(200).json({ message: "Request received." });
    }

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof birthday !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(birthday) ||
      consent !== true
    ) {
      return res.status(400).json({
        error: "Enter a valid email, birthday, and consent."
      });
    }

    const [year, month, day] = birthday.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day ||
      year < 1900 ||
      date > today
    ) {
      return res.status(400).json({
        error: "Enter a valid birthday."
      });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/birthday_subscribers?on_conflict=email`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          birthday,
          consent: true,
          subscribed: true
        })
      }
    );

    if (!response.ok) {
      console.error("Supabase signup failed:", await response.text());
      return res.status(500).json({
        error: "We couldn't save your signup. Please try again."
      });
    }

    return res.status(200).json({
      message: "Your birthday reminder signup was saved."
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
