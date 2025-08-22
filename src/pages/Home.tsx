import React from 'react';
import HeroSection from '../components/WelcomeCard';
import FeatureCard from '../components/FeatureCard';
import StatCard from '../components/StatCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section - Centrado verticalmente */}
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <HeroSection
            title="Bienvenido a Security"
            subtitle="Plataforma integral de seguridad que centraliza la gestión de autenticación, autorización y control de acceso para todas tus aplicaciones empresariales."
          />
        </div>
      </section>

      {/* Features Section - Layout mejorado */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          {/* Header de Características */}
          <div className="flex justify-center mb-16">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl px-8 py-4 border border-turquesa/30 shadow-xl">
              <h2 className="text-turquesa text-2xl font-bold text-center">Características Principales</h2>
            </div>
          </div>
          
          {/* Grid de Features - Mejor distribución */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon="🔒"
              title="Autenticación Segura"
              description="Sistema robusto de autenticación para proteger tus aplicaciones con los más altos estándares de seguridad."
            />
            
            <FeatureCard
              icon="👥"
              title="Gestión de Roles"
              description="Define y administra roles personalizados con permisos específicos para cada usuario en tu organización."
            />
            
            <FeatureCard
              icon="🛡️"
              title="Control de Permisos"
              description="Asigna permisos granulares para cada funcionalidad de tu sistema con máximo control y flexibilidad."
            />
            
            <FeatureCard
              icon="🏢"
              title="Multi-Aplicación"
              description="Gestiona múltiples aplicaciones desde una plataforma centralizada con integración completa."
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Posicionamiento mejorado */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              value="100%"
              label="Seguridad Garantizada"
            />
            
            <StatCard
              value="24/7"
              label="Monitoreo Continuo"
            />
            
            <StatCard
              value="∞"
              label="Aplicaciones Soportadas"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;