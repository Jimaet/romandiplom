export async function handler(event) {
  try {
    // Проверка, что есть тело запроса
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Пустое тело запроса" }),
      };
    }

    let prompt;
    try {
      const parsed = JSON.parse(event.body);
      prompt = parsed.prompt;
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Невалидный JSON в теле запроса" }),
      };
    }

    // Проверка, что есть prompt
    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Параметр 'prompt' отсутствует или не строка" }),
      };
    }

    // Запрос к Yandex GPT
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Authorization": "Bearer AQVNzn4lu8GL0qtDP94czMV0uDfq9AuP8JqxqFxA",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelUri: "gpt://b1gcddg3cp5v2mjc8knl/yandexgpt-lite",
        completionOptions: {
          stream: false,
          temperature: 0.3,
          maxTokens: 1000,
        },
        messages: [
          { role: "system", text: "Привет" },
          { role: "user", text: prompt },
        ],
      }),
    });

    const data = await response.json();

    // Проверка ответа от Yandex
    if (
      !data.result ||
      !data.result.alternatives ||
      !data.result.alternatives[0] ||
      !data.result.alternatives[0].message ||
      !data.result.alternatives[0].message.text
    ) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Некорректный ответ от Yandex GPT", fullResponse: data }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        reply: data.result.alternatives[0].message.text,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Неизвестная ошибка" }),
    };
  }
}
