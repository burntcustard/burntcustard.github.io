const Head = ({ title, description }) => (
  <head>
    <meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{title}</title>
    {description && <meta name="description" content={description}/>}
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
    <link href="/assets/css/style.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Arvo:wght@700&family=Fira+Code:wght@400;700&family=Fira+Sans:wght@600&display=swap" rel="stylesheet"/> 
  </head>
);

export default Head;
