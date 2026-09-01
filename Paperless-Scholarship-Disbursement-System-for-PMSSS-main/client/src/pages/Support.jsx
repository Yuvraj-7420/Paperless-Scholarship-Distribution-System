import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import './Support.css';

const Support = () => {
  const faqs = [
    { q: 'How do I track my application status?', a: 'You can track your application in the "My Applications" tab on the sidebar.' },
    { q: 'What documents are required for PMSSS?', a: 'Usually, Income Certificate, Marksheets, and Aadhaar card are required.' },
    { q: 'When will I receive the scholarship amount?', a: 'Once approved, the amount is disbursed via DBT within 15-30 working days.' }
  ];

  return (
    <div className="support-container">
      <div className="page-header">
        <h2>Help & Support</h2>
      </div>

      <div className="support-grid">
        <div className="contact-section">
          <div className="card">
            <h3>Contact Us</h3>
            <p className="text-secondary mb-2">Have questions? Reach out to our support team.</p>
            
            <div className="contact-methods">
              <div className="contact-item">
                <Mail size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-secondary text-sm">support@govscholar.gov.in</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Helpline</p>
                  <p className="text-secondary text-sm">1800-11-22-33 (9 AM - 6 PM)</p>
                </div>
              </div>
              <div className="contact-item">
                <MessageSquare size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-secondary text-sm">Average wait: 5 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <div className="card">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <p className="faq-question font-medium">{faq.q}</p>
                  <p className="faq-answer text-secondary text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
