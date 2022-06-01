const Head = ({ title, description }) => (
  <head>
    <meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{title}</title>
    {description && <meta name="description" content={description}/>}
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
    <link href="/assets/css/style.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Recursive&display=swap" rel="stylesheet"/>
  </head>
);

export default Head;
