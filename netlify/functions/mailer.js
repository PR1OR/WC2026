exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not set in Netlify environment variables" }) };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const callApi = async (messages) => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages,
        }),
      });
      if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
      return res.json();
    };

    const initialMessages = [{ role: "user", content: prompt }];
    let data = await callApi(initialMessages);

    // Handle web search tool use loop
    let attempts = 0;
    while (data.stop_reason === "tool_use" && attempts < 3) {
      attempts++;
      const assistantMsg = { role: "assistant", content: data.content };
      const toolResults = data.content
        .filter((b) => b.type === "tool_use")
        .map((b) => ({ type: "tool_result", tool_use_id: b.id, content: "Search completed" }));
      const nextMessages = [...initialMessages, assistantMsg, { role: "user", content: toolResults }];
      data = await callApi(nextMessages);
    }

    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return { statusCode: 200, headers, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
