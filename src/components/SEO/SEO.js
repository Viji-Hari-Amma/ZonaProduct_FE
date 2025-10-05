import { Helmet } from "react-helmet";

const SEO = ({ title, description, url = window.location.href }) => {
  return (
    <Helmet>
      <title>{title} | Hariharan's Portfolio</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="hariharan, developer, portfolio, react, frontend, backend" />
    </Helmet>
  );
};

export default SEO;
