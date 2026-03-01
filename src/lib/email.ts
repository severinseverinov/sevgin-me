/**
 * Send transactional email.
 * Uses Resend if RESEND_API_KEY is set; otherwise no-op in development.
 */

const RESEND_API = "https://api.resend.com/emails";

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    from ??
    process.env.EMAIL_FROM ??
    "Sevgin Serbest <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] RESEND_API_KEY not set – skipping send:", {
        to,
        subject,
      });
      return { ok: true };
    }
    return { ok: false, error: "Email not configured (RESEND_API_KEY)" };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: (data as { message?: string }).message ?? res.statusText,
      };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to send email";
    return { ok: false, error: msg };
  }
}
