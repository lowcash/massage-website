'use client'

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { selectedService } = useBooking();

  // Prepare WhatsApp message with selected service
  const getWhatsAppUrl = () => {
    const phoneNumber = '420605579643';
    let message = 'Dobrý den, chtěl(a) bych se informovat o masáži.\n\nMoje jméno: [Vyplňte prosím]\nTelefon: [Vyplňte prosím]';
    
    if (selectedService) {
      message = `Dobrý den, mám zájem o: ${selectedService}\n\nMoje jméno: [Vyplňte prosím]\nTelefon: [Vyplňte prosím]`;
    }
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{ delay: 1 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="fixed bottom-8 left-8 z-40 p-4 bg-[#de397e] text-white rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-[0_10px_30px_rgba(222,57,126,0.4)]"
      aria-label="Kontaktujte nás na WhatsApp"
    >
      {/* Pulse animation ring */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-[#de397e] rounded-full"
      />
      
      <MessageCircle className="w-6 h-6 relative z-10" />
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#2c2c2c]/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
        >
          Napište nám na WhatsApp
        </motion.div>
      )}
    </motion.a>
  );
}