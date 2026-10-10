
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  const reply = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "POST method required" });
  }

  let input;

  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  const allowedPairs = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "AUD/USD",
    "USD/BDT"
  ];

  const allowedTimeframes = ["1m", "5m", "15m"];
  const allowedMarkets = ["real", "otc"];

  if (
    !allowedPairs.includes(input.pair) ||
    !allowedTimeframes.includes(input.timeframe) ||
    !allowedMarkets.includes(input.market)
  ) {
    return reply(400, { error: "Invalid market settings" });
  }

  /*
   * Live-data provider is not configured yet.
   * Never invent prices or return a fake BUY/SELL signal.
   * Add a provider-specific adapter before enabling analysis.
   */

  if (!process.env.MARKET_DATA_API_URL ||
      !process.env.MARKET_DATA_API_KEY) {
    return reply(503, {
      signal: "WAIT",
      message:
        "Live market data is not configured. No verified signal available.",
      indicators: {
        EMA: "Unavailable",
        RSI: "Unavailable",
        MACD: "Unavailable",
        BollingerBands: "Unavailable",
        Stochastic: "Unavailable",
        ADX: "Unavailable",
        ATR: "Unavailable",
        SupportResistance: "Unavailable",
        CandlestickPatterns: "Unavailable"
      }
    });
  }

  return reply(503, {
    signal: "WAIT",
    message:
      "API credentials are present, but the provider-specific data adapter and candle validation must be configured before analysis."
  });
};
