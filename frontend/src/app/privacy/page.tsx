
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm uppercase tracking-widest font-bold text-foreground mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At Narrative, we are committed to maintaining the trust and confidence of our visitors to our web site. In particular, we want you to know that Narrative is not in the business of selling, renting or trading email lists with other companies and businesses for marketing purposes.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Collection of Information</h2>
        <p>
          We collect non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how our visitors use the website.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Cookies</h2>
        <p>
          We use "cookies" to help us identify and track visitors, their usage of our website, and their website access preferences. Visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using our website.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. User Data</h2>
        <p>
          If you choose to register on our website, we store the personal information you provide in your user profile. All users can see, edit, or delete their personal information at any time. Website administrators can also see and edit that information.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Security</h2>
        <p>
          The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Changes to This Policy</h2>
        <p>
          Narrative may change its Privacy Policy from time to time, and in Narrative's sole discretion. We encourage visitors to frequently check this page for any changes to its Privacy Policy.
        </p>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm">
            Questions? Contact us at <a href="mailto:hello@narrative.com" className="text-primary hover:underline">hello@narrative.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
