import HTMLPage from './_includes/components/html-page';

function notFound() {
  return (
    <HTMLPage>
      <header>
        <h1>404</h1>
      </header>

      <p>
        Page cannot be found. <a  href="/">Return to burnt.io</a>
      </p>
    </HTMLPage>
  )
}

notFound.data = {
  permalink: "404.html",
};

export default notFound;
