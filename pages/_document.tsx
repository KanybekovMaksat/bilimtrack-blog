import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru" translate="no" data-scroll-behavior="smooth">
      <Head>
        <meta name="google" content="notranslate" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..800&family=Inter:wght@400..700&family=Orbitron:wght@500..900&display=swap"
          rel="stylesheet"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
