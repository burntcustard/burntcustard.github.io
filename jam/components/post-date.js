const suffix = (n) => [,'st','nd','rd'][n/10%10^1&&n%10] || 'th';

function postdate(date) {
  const machineReadableDate = date
    .toISOString()
    .split('T')[0];

  const humanReadableDate = date
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    .replace(/\d+(?=\s)/, (day) => day + suffix(day));

  return (`<time datetime="${machineReadableDate}">
      ${humanReadableDate}
    </time>`);
}

module.exports = postdate;
