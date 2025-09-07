"use client"

import { createContext, useContext, useState, useEffect } from 'react';

// Create the language context with default values to prevent hydration errors
const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
  t: (key) => key,
  isLoaded: false
});

// Create a provider component
export function LanguageProvider({ children }) {
  // Initialize with default values to avoid hydration mismatch
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Load translations based on selected language
  useEffect(() => {
    if (!isMounted) return;
    
    const loadTranslations = async () => {
      try {
        // Dynamically import translations based on language
        const translationModule = await import(`./translations/${language}.js`);
        setTranslations(translationModule.default);
        // Save language preference to localStorage
        localStorage.setItem('language', language);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if translation file not found
        if (language !== 'en') {
          setLanguage('en');
        }
      }
    };

    loadTranslations();
  }, [language, isMounted]);

  // Function to toggle language between English and Bengali
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'bn' : 'en');
  };

  // Function to get translation for a specific key
  const t = (key) => {
    if (!translations || !translations[key]) {
      return key; // Return key as fallback if translation not found
    }
    return translations[key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}
