"use client"


import { HairForm } from '@/components/gucci-form';
import { Header } from '@/components/header';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-brown-50">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <HairForm />
    </div>
  );
}