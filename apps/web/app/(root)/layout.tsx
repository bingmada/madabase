import "../globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="1925B816DE0B8EE2EF64514E52A1D382" />
        <meta name="p:domain_verify" content="b0c3e6f557905e271f2868a46ca16d75" />
      </head>
      <body>{children}</body>
    </html>
  );
}
