import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: unknown) => { render: (container: HTMLElement) => void };
    };
  }
}

export function PayPalButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    function renderPayPalButtons() {
      // @ts-expect-error - PayPal SDK types not available
      if (window.paypal && container.childNodes.length === 0) {
        // @ts-expect-error - PayPal SDK types not available
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          },
          fundingSource: undefined,
          createOrder: function (data: unknown, actions: { order: { create: (order: unknown) => Promise<string> } }) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: "250.00",
                },
              }],
            });
          },
          onApprove: function (data: unknown, actions: { order: { capture: () => Promise<{ payer: { name: { given_name: string } } }> } }) {
            return actions.order.capture().then(function (details: { payer: { name: { given_name: string } } }) {
              alert('Transaction completed by ' + details.payer.name.given_name + '!');
            });
          },
        }).render(container);
      }
    }

    // Check if PayPal SDK is already loaded
    if (typeof window !== "undefined" && window.paypal) {
      renderPayPalButtons();
    } else {
      // Wait for PayPal SDK to load
      const checkPayPal = setInterval(() => {
        // @ts-expect-error - PayPal SDK types not available
        if (window.paypal) {
          clearInterval(checkPayPal);
          renderPayPalButtons();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkPayPal), 10000);
    }
  }, []);

  return <div ref={ref} style={{ maxWidth: 400, width: '100%' }} />;
} 