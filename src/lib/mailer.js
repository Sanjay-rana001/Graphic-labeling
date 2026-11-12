import nodemailer from "nodemailer";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function createTransporter() {
  const user = process.env.SMTP_USER || "souravgraphicmetallabel@gmail.com";
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function buildAttachments(enquiry) {
  const attachments = [];
  if (
    enquiry.designFile?.previewUrl &&
    typeof enquiry.designFile.previewUrl === "string" &&
    enquiry.designFile.previewUrl.startsWith("data:")
  ) {
    const match = enquiry.designFile.previewUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      attachments.push({
        filename: enquiry.designFile.fileName || "design-sample",
        content: match[2],
        encoding: "base64",
        contentType: match[1],
      });
    }
  }
  return attachments;
}

/**
 * Send:
 * 1) Executive B2B Lead Dossier email to Sourav Graphic & Metal Label
 * 2) Instant Confirmation & Acknowledgement email to Customer (if customer email provided)
 */
export async function sendEnquiryEmail(enquiry) {
  const result = {
    sent: false,
    ownerSent: false,
    customerSent: false,
    error: null,
  };

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.warn("[mailer] SMTP credentials not configured; skipping email.");
      result.error = "missing_credentials";
      return result;
    }

    const fromUser = process.env.SMTP_USER || "souravgraphicmetallabel@gmail.com";
    const ownerEmail = process.env.SMTP_TO || fromUser;

    const specs = enquiry.specifications || {};
    const digits = String(enquiry.phone || "").replace(/\D/g, "");
    const waCustomer = digits.length === 10 ? `91${digits}` : digits;
    const customerEmail = isValidEmail(enquiry.email) ? enquiry.email.trim() : "";

    const waReplyText = encodeURIComponent(
      `Hello ${enquiry.customerName},\n\nThank you for your enquiry (${enquiry.id}) at *Sourav Graphic & Metal Label*.\n\n*Product:* ${enquiry.category}\n*Quantity:* ${enquiry.quantity} pcs\n*Specs:* ${specs.thickness || "-"} | ${specs.colour || "-"} | ${specs.holes || "-"}\n\nHere is our factory-direct B2B quotation for your requirement:`
    );

    const attachments = buildAttachments(enquiry);

    // ─── 1. EXECUTIVE B2B LEAD EMAIL TO OWNER ──────────────────────────────
    const ownerSubject = `New B2B Lead [${enquiry.id}] • ${enquiry.category} (${enquiry.quantity} pcs) — ${enquiry.customerName}`;

    const ownerHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 660px; margin: 0 auto; background: #0b0d13; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px 26px; color: #09090b;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; opacity: 0.85;">
                  New Website Lead &bull; ${escapeHtml(enquiry.source || "Website Enquiry")}
                </div>
                <h1 style="margin: 5px 0 0; font-size: 21px; font-weight: 900; letter-spacing: -0.3px;">
                  ${escapeHtml(enquiry.category)} &mdash; ${escapeHtml(enquiry.quantity)} pcs
                </h1>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <span style="display: inline-block; background: #09090b; color: #fbbf24; font-family: monospace; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 8px;">
                  ${escapeHtml(enquiry.id)}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 24px 26px;">
          <!-- Quick Action Bar -->
          <div style="margin-bottom: 20px; padding: 14px 16px; background: #141722; border: 1px solid #27272a; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 10px;">
              Instant Lead Actions
            </div>
            <div>
              ${
                waCustomer
                  ? `<a href="https://wa.me/${escapeHtml(waCustomer)}?text=${waReplyText}" style="display: inline-block; background: #25D366; color: #09090b; font-weight: 800; font-size: 12px; padding: 9px 15px; border-radius: 8px; text-decoration: none; margin-right: 8px; margin-bottom: 6px;">
                      Send Quote on WhatsApp &rarr;
                    </a>`
                  : ""
              }
              <a href="tel:${escapeHtml(enquiry.phone)}" style="display: inline-block; background: #f59e0b; color: #09090b; font-weight: 800; font-size: 12px; padding: 9px 15px; border-radius: 8px; text-decoration: none; margin-right: 8px; margin-bottom: 6px;">
                Call ${escapeHtml(enquiry.phone)}
              </a>
              ${
                customerEmail
                  ? `<a href="mailto:${escapeHtml(customerEmail)}?subject=${encodeURIComponent(`Quotation for ${enquiry.category} [${enquiry.id}] - Sourav Graphic & Metal Label`)}" style="display: inline-block; background: #1e293b; color: #f8fafc; font-weight: 700; font-size: 12px; padding: 9px 15px; border-radius: 8px; text-decoration: none; border: 1px solid #334155; margin-bottom: 6px;">
                      Reply via Email
                    </a>`
                  : ""
              }
            </div>
          </div>

          <!-- Buyer Contact Details -->
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #f59e0b; margin-bottom: 8px;">
            Buyer / Company Details
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #11131c; border-radius: 10px; overflow: hidden; border: 1px solid #1f2433; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; width: 155px; border-bottom: 1px solid #1f2433;">Buyer / Company</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #ffffff; border-bottom: 1px solid #1f2433;">${escapeHtml(enquiry.customerName)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Mobile / WhatsApp</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #34d399; border-bottom: 1px solid #1f2433;">${escapeHtml(enquiry.phone)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Email Address</td>
              <td style="padding: 10px 14px; color: #e2e8f0; border-bottom: 1px solid #1f2433;">${customerEmail ? escapeHtml(customerEmail) : "<span style='color:#64748b;'>Not provided</span>"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8;">City / Delivery Address</td>
              <td style="padding: 10px 14px; color: #e2e8f0;">${escapeHtml(enquiry.address)}</td>
            </tr>
          </table>

          <!-- Technical Specifications -->
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #f59e0b; margin-bottom: 8px;">
            Technical Specifications
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #11131c; border-radius: 10px; overflow: hidden; border: 1px solid #1f2433;">
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; width: 155px; border-bottom: 1px solid #1f2433;">Product / Material</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #ffffff; border-bottom: 1px solid #1f2433;">${escapeHtml(enquiry.category)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Required Quantity</td>
              <td style="padding: 10px 14px; font-weight: 800; color: #fbbf24; border-bottom: 1px solid #1f2433;">${escapeHtml(enquiry.quantity)} pcs</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Gauge / Thickness</td>
              <td style="padding: 10px 14px; color: #e2e8f0; border-bottom: 1px solid #1f2433;">${escapeHtml(specs.thickness || "—")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Mounting / Holes</td>
              <td style="padding: 10px 14px; color: #e2e8f0; border-bottom: 1px solid #1f2433;">${escapeHtml(specs.holes || "—")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8; border-bottom: 1px solid #1f2433;">Printing Side</td>
              <td style="padding: 10px 14px; color: #e2e8f0; border-bottom: 1px solid #1f2433;">${escapeHtml(specs.side || "—")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #94a3b8;">Finish / Colour / Grade</td>
              <td style="padding: 10px 14px; color: #e2e8f0;">${escapeHtml(specs.colour || "—")}</td>
            </tr>
          </table>

          ${
            enquiry.designFile?.fileName
              ? `<div style="margin-top: 16px; padding: 12px 14px; background: #0c192c; border: 1px solid #1e3a5f; border-radius: 10px; font-size: 12px; color: #7dd3fc;">
                  <strong>Uploaded Design / Sample File:</strong> ${escapeHtml(enquiry.designFile.fileName)} (${Math.round((enquiry.designFile.fileSize || 0) / 1024)} KB) &mdash; <em>Attached to this email</em>
                </div>`
              : ""
          }

          <div style="margin-top: 16px; padding: 12px 14px; background: #141722; border-radius: 10px; border: 1px solid #27272a; font-size: 12px; color: #cbd5e1; line-height: 1.55;">
            <strong style="color: #f8fafc;">Requirement Notes:</strong><br/>
            ${escapeHtml(enquiry.notes)}
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 14px 26px; background: #07080c; font-size: 11px; color: #64748b; border-top: 1px solid #1f2433;">
          Received at ${escapeHtml(enquiry.createdAt || new Date().toISOString())} &bull; Sourav Graphic &amp; Metal Label (GSTIN: 06EFEPK5404R1Z2)
          ${customerEmail ? "<br/><span style='color:#34d399;'>&#10003; Automated acknowledgement email also sent to buyer.</span>" : ""}
        </div>
      </div>
    `;

    const ownerText = [
      `NEW B2B WEBSITE LEAD [${enquiry.id}]`,
      `Source: ${enquiry.source || "Website Form"}`,
      `Buyer: ${enquiry.customerName}`,
      `Phone: ${enquiry.phone}`,
      customerEmail ? `Email: ${customerEmail}` : "",
      `Address: ${enquiry.address}`,
      `Product: ${enquiry.category}`,
      `Quantity: ${enquiry.quantity} pcs`,
      `Specs: Thickness ${specs.thickness || "-"} | Holes ${specs.holes || "-"} | Side ${specs.side || "-"} | Colour/Grade ${specs.colour || "-"}`,
      enquiry.designFile?.fileName ? `Uploaded File: ${enquiry.designFile.fileName}` : "",
      `Notes: ${enquiry.notes}`,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: `"Sourav Graphic Lead Desk" <${fromUser}>`,
      to: ownerEmail,
      replyTo: customerEmail || undefined,
      subject: ownerSubject,
      text: ownerText,
      html: ownerHtml,
      attachments,
    });

    result.ownerSent = true;
    result.sent = true;

    // ─── 2. AUTO-ACKNOWLEDGEMENT EMAIL TO CUSTOMER (IF EMAIL PROVIDED) ─────
    if (customerEmail) {
      try {
        const customerSubject = `Enquiry Received [${enquiry.id}] — ${enquiry.category} | Sourav Graphic & Metal Label`;
        const customerHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; color: #0f172a; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #09090b; padding: 20px 26px; border-bottom: 3px solid #f59e0b;">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #fbbf24;">
                Sourav Graphic &amp; Metal Label
              </div>
              <h2 style="margin: 4px 0 0; font-size: 19px; font-weight: 800; color: #ffffff;">
                Thank You! Your Enquiry is Confirmed (${escapeHtml(enquiry.id)})
              </h2>
            </div>

            <div style="padding: 24px 26px; font-size: 13.5px; line-height: 1.6; color: #334155;">
              <p style="margin-top: 0;">Dear <strong>${escapeHtml(enquiry.customerName)}</strong>,</p>
              <p>
                Thank you for reaching out to <strong>Sourav Graphic &amp; Metal Label</strong>. We have received your custom industrial nameplate / label requirement and logged it under Reference ID <strong>${escapeHtml(enquiry.id)}</strong>.
              </p>
              <p>
                Our production &amp; quotation team is reviewing your specifications. You will receive our <strong>factory-direct B2B quote &amp; dispatch timeline within 2&ndash;4 business hours</strong>.
              </p>

              <div style="margin: 18px 0; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #d97706; margin-bottom: 8px;">
                  Submitted Requirement Summary
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                  <tr>
                    <td style="padding: 5px 0; color: #64748b; width: 140px;">Product:</td>
                    <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${escapeHtml(enquiry.category)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b;">Quantity:</td>
                    <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${escapeHtml(enquiry.quantity)} pcs</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b;">Thickness / Gauge:</td>
                    <td style="padding: 5px 0; color: #0f172a;">${escapeHtml(specs.thickness || "—")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b;">Mounting / Holes:</td>
                    <td style="padding: 5px 0; color: #0f172a;">${escapeHtml(specs.holes || "—")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b;">Finish / Colour:</td>
                    <td style="padding: 5px 0; color: #0f172a;">${escapeHtml(specs.colour || "—")}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 18px;">
                <a href="https://wa.me/918447507195?text=${encodeURIComponent(`Hi Sourav Graphic, I submitted enquiry ${enquiry.id} for ${enquiry.category} (${enquiry.quantity} pcs). Please share the quote.`)}" style="display: inline-block; background: #128C7E; color: #ffffff; font-weight: 700; font-size: 12.5px; padding: 10px 18px; border-radius: 8px; text-decoration: none; margin-right: 8px;">
                  Chat Directly on WhatsApp &rarr;
                </a>
                <a href="tel:+918447507195" style="display: inline-block; background: #f59e0b; color: #09090b; font-weight: 700; font-size: 12.5px; padding: 10px 18px; border-radius: 8px; text-decoration: none;">
                  Call +91 84475 07195
                </a>
              </div>
            </div>

            <div style="padding: 16px 26px; background: #f1f5f9; font-size: 11.5px; color: #475569; border-top: 1px solid #e2e8f0;">
              <strong>Sourav Kumar</strong> (Founder &amp; Proprietor) &bull; Sourav Graphic &amp; Metal Label<br/>
              DC 696 (313), 33 Feet Road, Near SS Tools, Sector 50, Faridabad, Haryana 121001<br/>
              GSTIN: 06EFEPK5404R1Z2 &bull; Email: souravgraphicmetallabel@gmail.com
            </div>
          </div>
        `;

        const customerText = [
          `Dear ${enquiry.customerName},`,
          ``,
          `Thank you for contacting Sourav Graphic & Metal Label!`,
          `We have received your enquiry (${enquiry.id}) for ${enquiry.quantity} pcs of ${enquiry.category} (${specs.thickness || "-"}, ${specs.colour || "-"}).`,
          `Our team will share your factory-direct B2B quotation within 2-4 business hours.`,
          ``,
          `For urgent bulk orders, call or WhatsApp Sourav Kumar directly at +91 84475 07195.`,
          ``,
          `Regards,`,
          `Sourav Graphic & Metal Label`,
          `Sector 50, Faridabad, Haryana 121001 | GSTIN: 06EFEPK5404R1Z2`,
        ].join("\n");

        await transporter.sendMail({
          from: `"Sourav Graphic & Metal Label" <${fromUser}>`,
          to: customerEmail,
          replyTo: ownerEmail,
          subject: customerSubject,
          text: customerText,
          html: customerHtml,
        });

        result.customerSent = true;
      } catch (custErr) {
        console.error("[mailer] Failed to send customer acknowledgement email:", custErr);
      }
    }

    return result;
  } catch (err) {
    console.error("[mailer] Failed to send enquiry email:", err);
    result.error = err?.message || "smtp_error";
    return result;
  }
}
