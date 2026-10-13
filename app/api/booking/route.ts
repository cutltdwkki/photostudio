import { NextResponse } from "next/server";

type BookingBody = {
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isValidPhone(digits: string) {
  return digits.length === 11 && digits.startsWith("7");
}

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json(
      { error: "Некорректный формат запроса." },
      { status: 400 },
    );
  }

  const name = asTrimmedString(body.name);
  const phoneDigits = digitsOnly(asTrimmedString(body.phone));
  const comment = asTrimmedString(body.comment);

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Укажи корректное имя." },
      { status: 400 },
    );
  }

  if (!isValidPhone(phoneDigits)) {
    return NextResponse.json(
      { error: "Укажи корректный телефон." },
      { status: 400 },
    );
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "Отправка заявок ещё не подключена. Добавь BOOKING_WEBHOOK_URL на сервере или свяжись с нами напрямую.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: phoneDigits,
        comment: comment || undefined,
        source: "photodream-site",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Не удалось передать заявку. Попробуй ещё раз чуть позже или напиши нам напрямую.",
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error:
          "Не удалось передать заявку. Попробуй ещё раз чуть позже или напиши нам напрямую.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
