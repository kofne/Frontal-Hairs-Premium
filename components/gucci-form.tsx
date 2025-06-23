'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { sizeData } from '@/lib/size-data';
import { FormData, SelectedItem, PayPalPaymentData } from '@/types/form';
import { CheckCircle, AlertCircle, ShoppingBag, XCircle, Loader2 } from 'lucide-react';

export function GucciForm() {
  const [formData, setFormData] = useState<Omit<FormData, 'selectedItems'>>({
    name: '',
    email: '',
    deliveryAddress: '',
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [itemSizes, setItemSizes] = useState<Record<string, string>>({});

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<PayPalPaymentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPayPalReady, setIsPayPalReady] = useState(false);

  const maxQuantity = 10;
  const totalPrice = 250;
  
  const isFormValid = formData.name && formData.email && formData.deliveryAddress && selectedItems.length > 0;

  useEffect(() => {
    if (!isFormValid || paymentCompleted || isPayPalReady) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.setAttribute('data-sdk-integration-source', 'developer-studio');
    script.addEventListener('load', () => {
      setIsPayPalReady(true);
      // @ts-ignore
      paypal.Buttons({
        createOrder: async () => {
          try {
            console.log('Attempting to create PayPal order with amount:', totalPrice);
            
            const res = await fetch('/api/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: totalPrice }),
            });
            
            console.log('Response status:', res.status);
            console.log('Response headers:', Object.fromEntries(res.headers.entries()));
            
            // Get the raw response text first
            const responseText = await res.text();
            console.log('Raw response text:', responseText);
            
            let data;
            try {
              data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
              console.error('Failed to parse API response:', parseError);
              console.error('Response text was:', responseText);
              throw new Error(`Invalid API response format: ${responseText}`);
            }
            
            console.log('Parsed API response data:', data);
            
            if (!res.ok) {
              console.error('Create order API error:', data);
              const errorMessage = data?.error || data?.message || `HTTP ${res.status}: ${res.statusText}`;
              throw new Error(errorMessage);
            }
            
            if (!data || !data.id) {
              console.error('No order ID in response:', data);
              throw new Error('Invalid order response - missing order ID');
            }
            
            console.log('PayPal order created successfully:', data.id);
            return data.id;
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            throw error;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const capture = await actions.order.capture();
            alert(`🎉 Payment Success! Thanks, ${capture.payer.name.given_name}`);
            handlePaymentSuccess(capture);
    } catch (error) {
            console.error('Payment capture error:', error);
            setSubmitStatus('error');
          }
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          setSubmitStatus('error');
        },
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);
  }, [isFormValid, paymentCompleted, isPayPalReady]);

  
  const handleImageSelect = (category: 'kids' | 'ladies' | 'mens', image: string) => {
    const itemKey = `${category}-${image}`;
    const isSelected = selectedItems.some(item => item.category === category && item.image === image);
    
    if (isSelected) {
      setSelectedItems(prev => prev.filter(item => !(item.category === category && item.image === image)));
      const newSizes = {...itemSizes};
      delete newSizes[itemKey];
      setItemSizes(newSizes);
    } else {
      if (selectedItems.length >= maxQuantity) {
        alert(`You can select a maximum of ${maxQuantity} tracksuits.`);
        return;
      }
      const defaultSize = sizeData[category].sizes[0].value;
      setSelectedItems(prev => [...prev, { category, image, size: defaultSize }]);
      setItemSizes(prev => ({...prev, [itemKey]: defaultSize }));
    }
  };
  
  const handleSizeChange = (itemKey: string, size: string) => {
    setItemSizes(prev => ({...prev, [itemKey]: size}));
    setSelectedItems(prev => prev.map(item => {
      if (`${item.category}-${item.image}` === itemKey) {
        return {...item, size};
      }
      return item;
    }));
  };

  const handlePaymentSuccess = (payment: any) => {
    setPaymentCompleted(true);
    setPaymentData({
      orderID: payment.id,
      payerID: payment.payer.payer_id,
      paymentID: payment.purchase_units[0].payments.captures[0].id,
    });
  };

  const handleSubmit = async () => {
    if (!paymentCompleted) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: { ...formData, selectedItems },
          paymentData,
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(paymentCompleted) {
        handleSubmit();
    }
  }, [paymentCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-brown-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-brown-800 mb-4">🛍️ Gucci Tracksuit Collection</h1>
          <p className="text-xl text-brown-600 max-w-3xl mx-auto">
            Select up to 10 tracksuits from any category for a fixed price of <span className="font-bold text-red-600">${totalPrice}</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-brown-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Select Your Tracksuits
                  </div>
                  <span className="text-lg font-semibold text-red-600">{selectedItems.length} / {maxQuantity} selected</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(sizeData).map(([category, data]) => (
                  <div key={category}>
                    <h3 className="text-2xl font-bold text-brown-700 mb-2 capitalize">
                      {category === 'kids' ? '👶' : category === 'ladies' ? '👩' : '👨'} {data.name}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-2">
                      {data.images.map((image) => {
                        const isSelected = selectedItems.some(item => item.category === category && item.image === image);
                        return (
                          <div
                            key={image}
                            className={`cursor-pointer border-3 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                              isSelected ? 'border-red-500 scale-105 shadow-lg' : 'border-brown-200 hover:border-brown-400'
                            }`}
                            onClick={() => handleImageSelect(category as any, image)}
                          >
                            <img src={`/images/${data.folder}/${image}`} alt={image} className="w-full h-32 md:h-40 object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200 sticky top-8">
              <CardHeader><CardTitle className="text-brown-800">Your Order</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {selectedItems.map(item => {
                      const itemKey = `${item.category}-${item.image}`;
                      return (
                        <div key={itemKey} className="flex items-center gap-3">
                          <img src={`/images/${sizeData[item.category].folder}/${item.image}`} className="w-16 h-16 rounded-md object-cover" />
                          <div className="flex-1">
                            <Select value={itemSizes[itemKey]} onValueChange={(size) => handleSizeChange(itemKey, size)}>
                              <SelectTrigger className="border-brown-300"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {sizeData[item.category].sizes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                           <Button variant="ghost" size="icon" onClick={() => handleImageSelect(item.category, item.image)}>
                              <XCircle className="w-5 h-5 text-red-500"/>
                           </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-brown-600 text-center">Select tracksuits to begin.</p>}
                
                <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border-brown-300"/>
                <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-brown-300"/>
                <Textarea placeholder="Delivery Address" value={formData.deliveryAddress} onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})} className="border-brown-300"/>

                <div className="border-t border-brown-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-brown-800">Total:</span>
                    <span className="text-2xl font-bold text-red-600">${totalPrice}</span>
                  </div>
                  
                  {isFormValid && !paymentCompleted && (
                    <div id="paypal-button-container">
                        {!isPayPalReady && (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                <span>Loading Payment Options...</span>
                            </div>
                        )}
                    </div>
                  )}
                  
                  {paymentCompleted && (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Order'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {submitStatus === 'success' && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Order Submitted Successfully!</h3>
                  <p>You will receive a confirmation email shortly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {submitStatus === 'error' && (
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Submission Failed</h3>
                  <p>Please try again or contact support.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}