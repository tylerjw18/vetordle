import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'VETordle — Daily Small Animal Diagnosis Game',
  description: 'A daily veterinary diagnosis puzzle for vet students and clinicians. Guess the small animal diagnosis from progressive clinical clues.',
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
