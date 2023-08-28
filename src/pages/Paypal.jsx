import { useState } from 'react';

import { DowellPaypal } from '@dowelllabs/dowellpayment'; // Adjust the path to the actual location of Payment.js

const PayPal = () => {
  const [paymentResult, setPaymentResult] = useState();
  const [approvalUrl, setApprovalUrl] = useState();
  const [paymentId, setPaymentId] = useState();
  const apiKey = import.meta.env.VITE_API_KEY;
  const paypal_client_id = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const paypal_secret_key = import.meta.env.VITE_PAYPAL_SECRET_KEY;
  const mode = import.meta.env.VITE_MODE;

  const handleInitializePayment = async () => {
    try {
      const userEnteredPrice = 500.5; // Example user input (replace with actual user input)
      let formattedPrice = parseFloat(userEnteredPrice).toFixed(2);

      const initializationResult = await new DowellPaypal().initializePayment({
        apiKey: apiKey,
        price: formattedPrice,
        product: 'Product Name',
        currency_code: 'usd',
        callback_url: 'https://www.google.com',
        paypal_client_id: paypal_client_id,
        paypal_secret_key: paypal_secret_key,
        mode: mode,
      });
      console.log(initializationResult);

      const data = JSON.parse(initializationResult);
      setApprovalUrl(data.approval_url);
      setPaymentId(data.payment_id);
    } catch (error) {
      console.error('Error while initializing payment', error);
    }
  };

  const handleVerifyPayment = async () => {
    try {
      const response = await new DowellPaypal().verifyPayment({
        apiKey: apiKey,
        paypal_client_id: paypal_client_id,
        paypal_secret_key: paypal_secret_key,
        paymentId: paymentId,
        mode: mode,
      });

      if (response === 'false') {
        console.error('Payment verification failed:', response);
      } else {
        setPaymentResult(response);
      }
    } catch (error) {
      console.error('Error verifying payment:', error.message);
    }
  };

  return (
    <div>
      <h1>PayPal Payment Component</h1>
      <button onClick={handleInitializePayment}>Initiate Payment</button>
      <a href={approvalUrl}>{approvalUrl}</a>
      <hr />
      {approvalUrl && (
        <div>
          <button onClick={handleVerifyPayment}>Verify Payment</button>
          <p>Payment Result:</p>
          <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PayPal;
