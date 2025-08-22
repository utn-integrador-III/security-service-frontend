import React from 'react';
import HeroSection from '../components/WelcomeCard';
import FeatureCard from '../components/FeatureCard';
import StatCard from '../components/StatCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Hero Section */}
        <div className="mb-16">
          <HeroSection
            title="Bienvenido a Security"
            subtitle="Plataforma integral de seguridad que centraliza la gestión de autenticación, autorización y control de acceso para todas tus aplicaciones empresariales."
          />
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="flex justify-end mb-8">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg px-6 py-3 border border-turquesa/30">
              <h2 className="text-turquesa text-xl font-bold">Características Principales</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl ml-auto">
            <FeatureCard
              icon="🔒"
              title="Autenticación Segura"
              description="Sistema robusto de autenticación para proteger tus aplicaciones"
            />
            
            <FeatureCard
              icon="👥"
              title="Gestión de Roles"
              description="Define y administra roles personalizados con permisos específicos"
            />
            
            <FeatureCard
              icon="🛡️"
              title="Control de Permisos"
              description="Asigna permisos granulares para cada funcionalidad de tu sistema"
            />
            
            <FeatureCard
              icon="🏢"
              title="Multi-Aplicación"
              description="Gestiona múltiples aplicaciones desde una plataforma centralizada"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
    </div>
  );
};

export default Home;