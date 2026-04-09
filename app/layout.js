// app/layout.js
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: "Holistic Self Score — รู้จักตัวเองผ่านดวงดาวและจิตวิทยา",
  description: "แบบประเมินจิตวิทยาเชิงโหราศาสตร์ 12 มิติ พร้อม AI วิเคราะห์เฉพาะบุคคล",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=Anuphan:wght@300;400;500;600&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-90KWXQTB76"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-90KWXQTB76');
          `}
        </Script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
