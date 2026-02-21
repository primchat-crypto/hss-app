// app/layout.js
export const metadata = {
  title: "Holistic Self Score — รู้จักตัวเองผ่านดวงดาวและจิตวิทยา",
  description: "แบบประเมินจิตวิทยาเชิงโหราศาสตร์ 12 มิติ พร้อม AI วิเคราะห์เฉพาะบุคคล",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Thai', 'DM Sans', -apple-system, sans-serif; background: #F8FAFC; color: #1E293B; -webkit-font-smoothing: antialiased; }
          @keyframes hss-spin { to { transform: rotate(360deg) } }
          @keyframes hss-blink { 50% { opacity: 0 } }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
