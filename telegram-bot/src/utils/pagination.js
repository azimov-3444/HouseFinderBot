const normalizePage = (page = 1) => Math.max(Number(page) || 1, 1);

module.exports = { normalizePage };
