import { Resend } from "resend";
import { NextResponse } from "next/server";

// ====== ⚙️ À MODIFIER FACILEMENT ======
const FROM = process.env.EMAIL_FROM || "MatiasMaster <surprise@maison-lehech.fr>";
const TO = process.env.EMAIL_TO || "mativink2@gmail.com";
const SUBJECT = "Confirmation de commande MatiasMaster";
// =======================================

const escapeHtml = (s = "") =>
  String(s).slice(0, 120).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function buildHtml(eventName) {
  const clicked = eventName
    ? `<p style="margin:0 0 24px;font-size:13px;color:#9ca3af;text-align:center;font-style:italic;">
         (Désolé pour la fausse joie concernant « ${escapeHtml(eventName)} »…)
       </p>`
    : "";

  const ear = (side) =>
    `<td valign="top"><div style="width:60px;height:60px;border-radius:50%;background-color:#111827;margin-${side}:-14px;"></div></td>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#fef3c7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Prépare tes affaires, on part à Disney !</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fef3c7;padding:40px 16px;">
    <tr><td align="center">

      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(220,38,38,0.15);">

        <!-- HEADER : fond rouge + Mickey -->
        <tr>
          <td align="center" style="background-color:#dc2626;background-image:linear-gradient(160deg,#ef4444,#b91c1c);padding:44px 20px 36px;">
            <div style="font-size:18px;letter-spacing:10px;color:#fde68a;margin-bottom:22px;">✦ &nbsp;✧ &nbsp;✦ &nbsp;✧ &nbsp;✦</div>

            <!-- MICKEY : 3 ronds -->
            <table role="presentation" cellspacing="0" cellpadding="0" align="center">
              <tr>
                ${ear("right")}
                <td valign="bottom"><div style="width:100px;height:100px;border-radius:50%;background-color:#111827;"></div></td>
                ${ear("left")}
              </tr>
            </table>

            <div style="margin-top:26px;font-size:12px;letter-spacing:4px;color:#fecaca;text-transform:uppercase;">MatiasMaster présente</div>
            <h1 style="margin:8px 0 0;font-size:34px;line-height:1.15;color:#ffffff;letter-spacing:-0.5px;">
              Bazinga
            </h1>
          </td>
        </tr>

        <!-- CORPS -->
        <tr><td style="padding:40px 40px 12px;">
          <h2 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:#111827;text-align:center;letter-spacing:-0.5px;">
            2 places pour Disneyland Paris le 3 décembre 2026 
          </h2>

          ${clicked}


        </td></tr>

        <!-- TICKET -->
        <tr><td style="padding:0 32px 8px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fffbeb;border:2px solid #111827;border-radius:16px;">
            <tr>
              <td style="padding:24px 24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b45309;font-weight:bold;">Réservation confirmée</div>
                <div style="font-size:22px;font-weight:700;color:#111827;margin-top:8px;">Disneyland Paris</div>
                <div style="font-size:15px;color:#4b5563;margin-top:4px;">2 entrées · 2 parcs</div>
                <div style="font-size:13px;color:#6b7280;margin-top:10px;">Règlement effectué avec la CB de Matias Master 💳</div>
              </td>
              <td width="130" align="center" style="border-left:2px dashed #111827;padding:24px 12px;background-color:#fde68a;">
                <div style="font-size:11px;letter-spacing:2px;color:#92400e;font-weight:bold;">LE</div>
                <div style="font-size:44px;line-height:1;font-weight:800;color:#111827;margin:4px 0;">3</div>
                <div style="font-size:15px;font-weight:700;color:#111827;letter-spacing:1px;">DÉC. 2026</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- TO-DO -->
        <tr><td align="center" style="padding:28px 40px 12px;">

        </td></tr>

        <!-- SIGNATURE -->
        <tr><td align="center" style="padding:20px 40px 44px;">
          <p style="margin:0;font-size:20px;color:#111827;font-weight:600;">Once again, you’ve fallen for one of my classic pranks.</p>
        </td></tr>
      </table>

      <div style="text-align:center;margin-top:20px;font-size:12px;color:#b45309;">
        Service billetterie MatiasMaster · 100 % faux site, 100 % vrai cadeau
      </div>

    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY manquante" }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: SUBJECT,
      html: buildHtml(body?.event),
      text: `Votre billet pour ${body?.event || ""} » est prêt ! 🎟️`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}