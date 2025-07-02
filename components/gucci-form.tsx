'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { frontalHairImages, hairData } from '@/lib/size-data';
import { FormData, PayPalPaymentData } from '@/types/form';
import { CheckCircle, ShoppingBag, XCircle, Loader2 } from 'lucide-react';
import { PayPalButton } from './PayPalButton';

export function HairForm() {
  const [formData, setFormData] = useState<Omit<FormData, 'selectedItems'>>({
    name: '',
    email: '',
    deliveryAddress: '',
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [paymentCompleted] = useState(false);
  const [paymentData] = useState<PayPalPaymentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const maxQuantity = 10;
  const totalPrice = hairData.price;
  

  
  const handleImageSelect = (image: string) => {
    const isSelected = selectedImages.includes(image);
    
    if (isSelected) {
      setSelectedImages(prev => prev.filter(img => img !== image));
    } else {
      if (selectedImages.length >= maxQuantity) {
        alert(`You can select a maximum of ${maxQuantity} frontal hairs.`);
        return;
      }
      setSelectedImages(prev => [...prev, image]);
    }
  };



  const handleSubmit = async () => {
    if (!paymentCompleted) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: { ...formData, selectedItems: selectedImages.map(img => ({ image: img })) },
          paymentData,
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // No longer auto-submit after payment; user must click the button
  }, [paymentCompleted]);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-red-50 to-brown-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">💇‍♀️ Frontal Hair Collection</h1>
          <div className="bg-dark-maroon max-w-4xl mx-auto">
            <p className="text-2xl text-white font-semibold">
              Select up to 10 frontal hairs from our collection for a fixed price of <span className="font-bold text-white">${totalPrice}</span>.
            </p>
            <p className="text-3xl text-white font-semibold mt-4">
              Delivers in Gaborone, Botswana in 4-7 days, <span className="font-bold text-white">Free Shipping!</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-brown-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Select Your Frontal Hairs
                  </div>
                  <span className="text-lg font-semibold text-red-600">{selectedImages.length} / {maxQuantity} selected</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {frontalHairImages.map((image) => {
                    const isSelected = selectedImages.includes(image);
                    return (
                      <div
                        key={image}
                        onClick={() => handleImageSelect(image)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-red-500 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-red-300 hover:scale-102'
                        }`}
                      >
                        <img
                          src={`/images/${image}`}
                          alt={`Frontal Hair ${image}`}
                          className="w-full h-20 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-red-600 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
                <CardTitle className="text-brown-800">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Full Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="border-brown-300 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="border-brown-300 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Delivery Address</label>
                  <Textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    className="border-brown-300 focus:border-red-500 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
                <CardTitle className="text-brown-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brown-600">Selected Items:</span>
                  <span className="font-semibold text-brown-800">{selectedImages.length} frontal hairs</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-brown-800">Total:</span>
                  <span className="text-red-600">${totalPrice}</span>
                </div>
                <PayPalButton />
                <button
                  className={`mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${!paymentCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={!paymentCompleted || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Order submitted successfully!</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <XCircle className="w-5 h-5" />
                    <span>Error submitting order. Please try again.</span>
                  </div>
                )}
                
                {isSubmitting && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting order...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}