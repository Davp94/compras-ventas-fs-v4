
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-purple/theme.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
         <PrimeReactProvider>
            {children}
         </PrimeReactProvider>
      </body>
    </html>
  );
}
