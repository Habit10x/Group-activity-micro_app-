export const metadata = {
  title: "SHARP – Team Competition",
  description: "Articulation exercise for teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#FAFAF8" }}>
        {children}
      </body>
    </html>
  );
}
