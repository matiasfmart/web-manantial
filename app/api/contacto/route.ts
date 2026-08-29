import { NextResponse } from "next/server";
import { getChurchInfo } from "@/lib/data";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contacto] Falta configurar RESEND_API_KEY");
    return NextResponse.json(
      { error: "El formulario no está disponible por ahora. Escribinos por WhatsApp mientras tanto." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Completá todos los campos." }, { status: 400 });
  }

  const churchInfo = await getChurchInfo();
  const to = churchInfo.email && churchInfo.email !== "-" ? churchInfo.email : undefined;

  if (!to) {
    console.error("[contacto] Falta configurar un email institucional (churchInfo.email)");
    return NextResponse.json(
      { error: "El formulario no está disponible por ahora. Escribinos por WhatsApp mientras tanto." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to,
        reply_to: email,
        subject: `Nuevo mensaje de contacto — ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      }),
    });

    if (!res.ok) {
      console.error("[contacto] Resend respondió", res.status, await res.text());
      return NextResponse.json(
        { error: "No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contacto] Error llamando a Resend:", err);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp." },
      { status: 500 }
    );
  }
}
