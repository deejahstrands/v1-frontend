import React from 'react';

const ShippingInfoContent: React.FC = () => (
  <div className="space-y-4 text-sm sm:text-base text-gray-800">
    <div>
      <h3 className="font-semibold mb-1">Order Processing & Delivery</h3>
      <p>All orders placed on the website are subject to a 20-25 business day (excluding potential delays) processing window PRIOR to shipment (processing time = time used to make your unit). Once shipped, here are the approximate delivery times based on your location:</p>
      <ul className="list-disc pl-5">
        <li>Domestic: 3-5 Business Days</li>
        <li>International: 5-7 Business Days</li>
      </ul>
      <p>When your order is shipped out you will receive a shipping confirmation email containing your tracking information.</p>
    </div>
    <div>
      <h4 className="font-semibold">Liability</h4>
      <p>Please note once your order is shipped, I am not liable for lost/stolen/missing packages as they&apos;re handled by Royal Mail.</p>
      <p>If you believe your package is lost, stolen or missing, I cannot refund/compensate you - we recommend opening a claim with ROYAL MAIL.</p>
    </div>
    <div>
      <h4 className="font-semibold">Shipping and Returns Disclaimers</h4>
      <ul className="list-decimal pl-5">
        <li><b>Changes to your order:</b> Once your order is SHIPPED we cannot modify it. This means, we cannot change the delivery address, shipping method or item(s) within the order.</li>
        <li><b>Verify your shipping address:</b> Please verify your shipping address is correct prior to completing check out. We do not replace or refund orders that are unable to be delivered due to incorrect or incomplete addresses.</li>
        <li><b>Lost, stolen or missing packages:</b> Once your order is shipped, we no longer have control over the delivery. If you believe your package is lost, stolen or missing we recommend opening a claim with the shipping courier.</li>
        <li><b>Refunds:</b> We do not issue refunds to orders that are scanned &quot;Delivered&quot;. If your tracking is showing your package was delivered but you have not received it, we suggest contacting your local post office and opening a claim.</li>
        <li><b>Tracking numbers:</b> Tracking numbers can be found within your shipping confirmation email which is sent to the email address used to place the order. Tracking numbers may take up to 48 hours to validate.</li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold">Returns policy</h4>
      <p>Due to the nature of the customised wigs we do not offer returns. Exchange only.</p>
    </div>
    <div>
      <h4 className="font-semibold">Returns & Exchanges</h4>
      <p>We only accept returns if the wig is damaged by us.</p>
      <ul className="list-decimal pl-5">
        <li><b>Return shipping costs:</b> Customers are responsible for return postage costs. We will issue a return label via email & the cost will be deducted from your refund.</li>
        <li><b>Tracking numbers:</b> If an order is being returned to us, you must provide us with a tracking number to ensure proof of delivery. Refunds will not be issued until we&apos;ve received the returned order.</li>
      </ul>
    </div>
  </div>
);

export default ShippingInfoContent; 