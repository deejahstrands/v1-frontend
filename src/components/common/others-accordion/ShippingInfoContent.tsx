import React from 'react';

const ShippingInfoContent: React.FC = () => (
  <div className="space-y-4 text-sm sm:text-base text-gray-800">
    <div>
      <h3 className="font-semibold mb-1">Order Processing & Delivery</h3>
      <p>All orders placed on the website are subject to a 10-14 business day (excluding potential delays) processing window PRIOR to shipment (processing time = time used to make your unit). Once shipped, here are the approximate delivery times based on your location:</p>
      <ul className="list-disc pl-5">
        <li>Domestic: 3-5 Business Days</li>
        <li>International: 5-10 Business Days</li>
      </ul>
      <p>When your order is shipped out you will receive a shipping confirmation email containing your tracking information.</p>
    </div>
    <div>
      <h4 className="font-semibold">Shipping and Returns Disclaimers</h4>
      <ul className="list-decimal pl-5">
        <li><b>Verify your shipping address:</b> Please verify your shipping address is correct prior to completing check out. We do not replace or refund orders that are unable to be delivered due to incorrect or incomplete addresses.</li>
        <li><b>Lost, stolen or missing packages:</b> Once your order is shipped, we no longer have control over the delivery. If you believe your package is lost, stolen or missing we recommend opening a claim with the shipping courier.</li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold">Returns policy</h4>
      <p>Due to the nature of the customised wigs we do not offer returns. Exchange only.</p>
    </div>
    <div>
      <h4 className="font-semibold">Returns & Exchanges</h4>
      <p>We only accept returns if the wig is damaged by us.</p>
      <p><b>Return shipping costs:</b> Customers are responsible for return postage costs.</p>
    </div>
  </div>
);

export default ShippingInfoContent; 