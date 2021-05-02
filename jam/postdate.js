const suffix = (n) => [,'st','nd','rd'][n/10%10^1&&n%10] || 'th';

const customizeDate = (localeDate) => {
  return localeDate
    .toString()
    .split(' ')
    .map((segment, i) => i === 0 ? segment + suffix(segment) : segment)
    .join(' ')
}

function postdate(date) {
  return date ? (
    `<time datetime="${date.toISOString().split('T')[0]}">
      ${customizeDate(date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }))}
    </time>`
  ) : '';
}

module.exports = postdate;
