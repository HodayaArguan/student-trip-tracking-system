function dmsToDecimal(degrees, minutes, seconds, direction) {
  const deg = Number(degrees);
  const min = Number(minutes);
  const sec = Number(seconds);

  if (Number.isNaN(deg) || Number.isNaN(min) || Number.isNaN(sec)) {
    throw new Error('Invalid DMS values');
  }

  const decimal = Math.abs(deg) + min / 60 + sec / 3600;
  const normalizedDirection = direction ? String(direction).trim().toUpperCase() : '';

  if (normalizedDirection === 'S' || normalizedDirection === 'W') {
    return -decimal;
  }

  return deg < 0 ? -decimal : decimal;
}

module.exports = {
  dmsToDecimal,
};
