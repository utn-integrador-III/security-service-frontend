// frontend/src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // ESTE DIV ES EL QUE DEBE TENER EL FONDO OSCURO Y LA ESTRUCTURA FLEXBOX
    <div className="flex flex-col min-h-screen text-text-light center-dark">
      <Header />
      {/* El main debe crecer para empujar el footer hacia abajo */}
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;