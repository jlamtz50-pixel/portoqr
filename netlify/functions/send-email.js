exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const RESEND_KEY = "re_gXKmQrKb_GSdJoE3xKdHMaVpPsoJHJ4xm";

  try {
    const payload = JSON.parse(event.body);
    const { to, subject, html } = payload;

    if (!to || !subject || !html) {
      return { statusCode: 400, body: JSON.stringify({ error: "Faltan campos" }) };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "PortoQR <contacto@foodrestco.com>",
        to: [to],
        subject,
        html
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error Resend");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true, id: data.id })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
