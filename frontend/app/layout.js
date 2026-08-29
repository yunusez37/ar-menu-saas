export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}