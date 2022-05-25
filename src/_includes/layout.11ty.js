class Layout {
  data() {
    return {
      title: 'My test layout',
    };
  }

  render(data) {
    return `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
        </head>

        <body>
          <header>
            ${['Home', 'Work', 'Blog'].map((item) => {
              const regex = new RegExp(`\/${item}\/?`, 'i');
              const isCurrent = (
                (item === 'Home' && data.page.url === '/') ||
                (regex.test(data.page.url))
              );
              return `
                <a
                  href="/${item === 'Home' ? '' : item.toLowerCase()}"
                  ${isCurrent ? 'aria-current="page"' : ''}
                >
                  ${item}
                </a>
              `;
            }).join('')}
          </header>

          <pre>
            ${JSON.stringify(data.page)}
          </pre>

          ${data.content}
        </body>
      </html>
    `;
  }
}

module.exports = Layout;
