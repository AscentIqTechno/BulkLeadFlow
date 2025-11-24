export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay SDK loaded');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Utility to format amount for display
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${(amount / 100).toFixed(2)}`;
  } else if (currency === 'USD') {
    return `$${(amount / 100).toFixed(2)}`;
  }
  return `${(amount / 100).toFixed(2)} ${currency}`;
};