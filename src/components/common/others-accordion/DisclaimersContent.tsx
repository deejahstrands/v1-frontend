import React from 'react';

const DisclaimersContent: React.FC = () => (
  <div className="space-y-4 text-sm sm:text-base text-gray-800">
    <div>
      <h4 className="font-semibold mb-2">Colour disclaimer</h4>
      <p>Please note that the colour of your unit may vary, despite every effort to provide accurate images of each unit, phones and computer screens cannot be relied upon to accurately represent colors.</p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Length disclaimer</h4>
      <p>When selecting your desired hair length, keep in mind that styling will affect the final appearance. Curling hair significantly impacts its length:</p>
      <ul className="list-disc pl-5">
        <li>Curls can reduce hair length by up to 4 inches</li>
        <li>For example: To achieve 26-inch curled hair, opt for straight hair <strong>that&apos;s 28-30 inches long</strong></li>
      </ul>
    </div>
  </div>
);

export default DisclaimersContent; 