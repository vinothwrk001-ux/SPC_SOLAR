import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SEOHead from '../../components/ui/SEOHead';
import PageHero from '../../components/ui/PageHero';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, Stagger } from '../../components/motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-card mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 bg-white flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-heading text-base text-black">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-red flex-shrink-0 ml-4"
        >
          <FiChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 text-gray-500 text-sm font-body leading-relaxed border-t border-gray-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubsidyPage = () => {
  const faqs = [
    { q: "What is PM Surya Ghar Muft Bijli Yojana?", a: "It is a central government scheme aimed at providing free electricity up to 300 units every month for one crore households through rooftop solar setups." },
    { q: "Who is eligible for the solar subsidy?", a: "Indian citizens with their own house, a valid electricity connection, and a suitable roof for solar panel installation are eligible." },
    { q: "How much subsidy can I get?", a: "You can get ₹30,000 per kW up to 2kW, ₹18,000 for the 3rd kW. The maximum subsidy is capped at ₹78,000." },
    { q: "Can I get a subsidy for a 5kW system?", a: "Yes, you can install a 5kW system, but the maximum central subsidy provided will be capped at ₹78,000." },
    { q: "Do I need to pay the full amount upfront?", a: "No, many banks offer collateral-free loans up to ₹2 lakhs at around 7% interest for rooftop solar installations under this scheme." },
    { q: "How is the subsidy credited?", a: "Once the installation is complete and net metering is installed, the DISCOM inspects the setup. After approval, the subsidy is directly credited to your bank account within 30 days." },
    { q: "What documents are required?", a: "You need an electricity bill (past 6 months), Aadhar card, bank passbook, and a passport-size photo." },
    { q: "Can SPC Solar help me with the application?", a: "Absolutely! We are an authorized vendor and will assist you end-to-end, from application to installation and subsidy claiming." }
  ];

  return (
    <div>
      <SEOHead
        title="PM Surya Ghar Muft Bijli Yojana — ₹78,000 Solar Subsidy | SPC Solar"
        description="Learn everything about the PM Surya Ghar scheme. Get up to ₹78,000 central subsidy for your rooftop solar installation with SPC Solar."
      />

      <PageHero
        label="Government Initiative"
        title="PM SURYA GHAR "
        highlight="SUBSIDY"
        subtitle="Get up to ₹78,000 central government subsidy for your rooftop solar installation — we handle everything."
      />


      {/* What is it & Table */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading mb-4">Scheme Overview</h2>
            <p className="text-gray mb-6 leading-relaxed">
              Launched to promote sustainable energy, the PM Surya Ghar scheme aims to provide up to 300 units of free electricity every month to 1 crore households. By installing a rooftop solar system, you not only reduce your electricity bill to zero but also contribute to a greener nation. The government provides substantial financial assistance directly to your bank account.
            </p>
          </div>
          <div>
            <div className="bg-white p-6 rounded-card shadow-card border-t-4 border-t-red">
              <h3 className="text-xl font-heading mb-4 text-center">Central Subsidy Structure</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-light text-black">
                      <th className="py-3 px-4 font-accent">System Size</th>
                      <th className="py-3 px-4 font-accent">Subsidy Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray text-sm">
                    <tr className="border-b border-gray-light">
                      <td className="py-3 px-4">Up to 2 kW</td>
                      <td className="py-3 px-4 font-bold text-black">₹30,000 per kW</td>
                    </tr>
                    <tr className="border-b border-gray-light bg-surface">
                      <td className="py-3 px-4">2 kW – 3 kW</td>
                      <td className="py-3 px-4 font-bold text-black">₹18,000 for the extra kW</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Above 3 kW</td>
                      <td className="py-3 px-4 font-bold text-red">₹78,000 (Maximum Cap)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility & Documents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-heading mb-6">Eligibility Criteria</h2>
            <ul className="space-y-4">
              {[
                "Must be an Indian citizen",
                "Must own a house with a concrete/suitable roof",
                "Must have an active electricity connection",
                "Should not have availed any other solar subsidy previously"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <FiCheckCircle className="text-red mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="text-gray">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-heading mb-6">Required Documents</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray bg-surface p-6 rounded-card">
              <li>Recent Electricity Bill (last 6 months)</li>
              <li>Aadhar Card / PAN Card</li>
              <li>Bank Passbook / Cancelled Cheque</li>
              <li>Passport size photograph</li>
              <li>Property Ownership Proof (if required by local DISCOM)</li>
            </ol>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading mb-12 text-center text-white">How to Apply (5-Step Process)</h2>
          <div className="flex flex-col md:flex-row justify-between relative space-y-8 md:space-y-0">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-gray-light opacity-20"></div>
            
            {[
              { step: 1, title: "Register on Portal", desc: "Select your state & electricity distribution company." },
              { step: 2, title: "Feasibility Approval", desc: "Wait for DISCOM approval for your application." },
              { step: 3, title: "Installation", desc: "SPC Solar installs the plant following MNRE standards." },
              { step: 4, title: "Net Metering", desc: "Submit plant details and apply for net meter." },
              { step: 5, title: "Subsidy Credit", desc: "Subsidy is credited to your bank within 30 days." }
            ].map((s) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5 px-2">
                <div className="w-12 h-12 rounded-full bg-red flex items-center justify-center font-accent font-bold text-xl mb-4 border-4 border-black">
                  {s.step}
                </div>
                <h4 className="font-heading text-lg mb-2">{s.title}</h4>
                <p className="text-xs text-gray-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading mb-8 text-center">Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-heading mb-6">Calculate Your Savings & Subsidy</h2>
          <p className="text-gray mb-8">
            Use our intelligent quotation generator to find out exactly how much you will save and the subsidy amount you are eligible for.
          </p>
          <Link to="/quotation">
            <Button variant="primary">Check How Much You Save</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SubsidyPage;
