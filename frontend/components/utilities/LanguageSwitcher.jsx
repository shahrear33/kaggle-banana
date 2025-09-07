"use client"

import { useLanguage } from '@/lib/language/LanguageContext';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center justify-center min-w-8 h-8 rounded-full bg-primary text-white font-medium text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      aria-label={`Switch to ${language === 'en' ? 'Bengali' : 'English'}`}
    >
      {language === 'en' ? 'Bn' : 'En'}
    </motion.button>
  );
};

export default LanguageSwitcher;
