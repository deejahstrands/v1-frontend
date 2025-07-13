import React from 'react';

const DisclaimersContent: React.FC = () => (
  <div className="space-y-4 text-sm sm:text-base text-gray-800">
    <div>
      <h3 className="font-semibold mb-1">Ready to wear</h3>
      <p className="italic my-2">“The wig can be teddy to wear straight out of the box right ?”</p>
      <p className="font-semibold mb-2">Wrong</p>
      <p className="mb-2">By &quot;ready to wear&quot; it&apos;s not &quot;ready&quot; in the literal sense. Think about ready to bake cookies. They&apos;re pre-mixed and shaped, but you still need to put them in the oven, adjust baking time for your specific oven, and maybe add your own finishing touches.</p>
      <p>Same with wigs, a ready to wear wig gives you the foundation, but you&apos;ll still need to adjust the cap size with the band, tint the lace and style it to frame your face perfectly. The &quot;ready&quot; part just means the hard work of creating the basic structure is done for you - but the personalisation that makes it look natural on YOU still needs to happen.</p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Colour disclaimer</h4>
      <p>Please note that the colour of your unit may vary, despite every effort to provide accurate images of each unit, phones and computer screens cannot be relied upon to accurately represent colors.</p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Texture disclaimer</h4>
      <p>Any unit with a “bodywave” like appearance is only a temporary style. It is straight hair that is barrel curled and will not last long. Watch your GG classes when you’re ready to reveal your hair.</p>
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