'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

export function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <header className="bg-cover bg-center bg-no-repeat border-b border-brown-200 sticky top-0 z-50" style={{ backgroundImage: 'url(/images/headers.jpeg)' }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,255,255,0.6)]">💇‍♀️ Frontal Hair Collection</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Contact Us Container */}
            <div className="bg-contact-blue p-1 px-2 rounded-md inline-flex flex-col items-center w-auto">
              <h2 className="text-bright-blue text-lg font-bold mb-0 text-center leading-tight">Contact Us</h2>
              <div className="flex items-center gap-1 mb-0 mt-1">
                <p className="text-white text-xs leading-tight">Get in touch with us today!</p>
                
                {/* Quick Contact Button */}
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100 text-xs px-2 py-1 h-auto">
                      <Mail className="w-3 h-3 mr-1" />
                      Quick Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-brown-800">
                        <Mail className="w-6 h-6" />
                        Contact & Enquiries
                      </DialogTitle>
                    </DialogHeader>
                    <ContactForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 