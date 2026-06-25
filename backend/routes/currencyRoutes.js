const express = require('express');

const router = express.Router();

const FALLBACK_RATES = {
  USD: 1,
  UZS: 12650,
  RUB: 78,
};

let cachedRates = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

router.get('/rates', async (req, res) => {
  if (cachedRates && Date.now() - cachedAt < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      data: cachedRates,
      cached: true,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    });
    const payload = await response.json();

    if (!response.ok || payload.result !== 'success' || !payload.rates) {
      throw new Error('Currency provider returned an invalid response');
    }

    cachedRates = {
      base: 'USD',
      rates: {
        USD: 1,
        UZS: payload.rates.UZS || FALLBACK_RATES.UZS,
        RUB: payload.rates.RUB || FALLBACK_RATES.RUB,
      },
      updatedAt: payload.time_last_update_utc || new Date().toUTCString(),
      provider: payload.provider || 'https://www.exchangerate-api.com',
    };
    cachedAt = Date.now();

    return res.status(200).json({
      success: true,
      data: cachedRates,
      cached: false,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: {
        base: 'USD',
        rates: FALLBACK_RATES,
        updatedAt: null,
        provider: 'fallback',
      },
      fallback: true,
      message: 'Live exchange rate provider is unavailable',
    });
  } finally {
    clearTimeout(timeout);
  }
});

module.exports = router;
