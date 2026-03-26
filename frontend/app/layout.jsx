/**
 * Root Layout - Applies to all pages
 * CSC 489 - Spring 2026
 */

export const metadata = {
  title: 'Capstone Project',
  description: 'CSC 489 Web Application Security',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
