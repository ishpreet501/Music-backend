const { Resend } = require("resend");
const contactModel = require("../Model/contact");

const escapeHtml = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Email, Message).",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_resend_api_key_here") {
      console.error("❌ RESEND_API_KEY is not defined in backend .env file.");
      return res.status(500).json({
        success: false,
        message:
          "Resend API key missing hai! Kripya backend/.env me apna valid RESEND_API_KEY dalein.",
      });
    }

    const resend = new Resend(apiKey);
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "sishpreet135@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Preet Music <onboarding@resend.dev>";
    const selectedSubject = subject || "Booking";

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [receiverEmail],
      replyTo: email,
      subject: `[Preet Music] New Contact Form: ${selectedSubject} from ${name}`,
      html: `
        <div style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b10; color: #ffffff;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #161622; border-radius: 12px; overflow: hidden; border: 1px solid #28283a;">
            <tr>
              <td style="background: linear-gradient(135deg, #e63946, #b01a2b); padding: 28px 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">PREET MUSIC</h1>
                <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">New Contact & Booking Inquiry</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px;">
                <div style="background-color: #1e1e2d; border-radius: 8px; padding: 18px; margin-bottom: 20px; border: 1px solid #303046;">
                  <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #d0d0df;">
                    <tr>
                      <td width="30%" style="color: #8c8ca5; font-weight: 600;">Sender:</td>
                      <td style="color: #ffffff; font-weight: 700;">${escapeHtml(name)}</td>
                    </tr>
                    <tr>
                      <td style="color: #8c8ca5; font-weight: 600;">Email:</td>
                      <td><a href="mailto:${escapeHtml(email)}" style="color: #ff6b7b; text-decoration: none;">${escapeHtml(email)}</a></td>
                    </tr>
                    <tr>
                      <td style="color: #8c8ca5; font-weight: 600;">Subject / Category:</td>
                      <td style="color: #ffffff;">${escapeHtml(selectedSubject)}</td>
                    </tr>
                    <tr>
                      <td style="color: #8c8ca5; font-weight: 600;">Received:</td>
                      <td style="color: #a0a0b5;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
                    </tr>
                  </table>
                </div>

                <div style="background-color: #1e1e2d; border-radius: 8px; padding: 20px; border-left: 4px solid #e63946;">
                  <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #ff6b7b; letter-spacing: 0.5px;">Message</h3>
                  <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #f0f0f5; white-space: pre-wrap;">${escapeHtml(message)}</p>
                </div>

                <div style="margin-top: 25px; text-align: center;">
                  <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: #e63946; color: #ffffff; padding: 12px 28px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(230, 57, 70, 0.4);">
                    Reply to ${escapeHtml(name)}
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #10101a; padding: 16px; text-align: center; border-top: 1px solid #252538; font-size: 12px; color: #6a6a80;">
                Notification generated by Preet Music Official Website &bull; Powered by Resend
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);

      // Save to database with status 'failed'
      try {
        await contactModel.create({
          name,
          email,
          subject: selectedSubject,
          message,
          status: "failed",
        });
      } catch (dbErr) {
        console.error("Database save failed:", dbErr.message);
      }

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to deliver email through Resend.",
      });
    }

    // Save to database with status 'sent'
    try {
      await contactModel.create({
        name,
        email,
        subject: selectedSubject,
        message,
        resendEmailId: data?.id,
        status: "sent",
      });
    } catch (dbErr) {
      console.error("Database save warning:", dbErr.message);
    }

    console.log("✅ Resend email sent successfully! ID:", data?.id);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully! We will get in touch soon.",
      emailId: data?.id,
    });
  } catch (err) {
    console.error("🔥 Error in sendContactEmail:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error while processing your request.",
    });
  }
};

module.exports = { sendContactEmail };
