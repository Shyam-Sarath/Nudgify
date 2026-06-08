import './globals.css';

export const metadata = {
  title: 'Nudgify Admin Dashboard',
  description: 'Manage food marketplace platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
