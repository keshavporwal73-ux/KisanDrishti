import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'pa';

interface Translations {
  appName: string;
  tagline: string;
  centralMessage: string;
  startAudit: string;
  demoMode: string;
  calibrationSheet: string;
  records: string;
  protocol: string;
  observedEvidence: string;
  unverified: string;
  brokenDamaged: string;
  discoloration: string;
  foreignObjects: string;
  criticalDefects: string;
  minorDefects: string;
  coverage: string;
  opticalQuality: string;
  failureTitle: string;
  failureMessage: string;
  recaptureButton: string;
  rulerTool: string;
  comparisonTool: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'KisanDrishti',
    tagline: 'Evidence Before Valuation',
    centralMessage: 'KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.',
    startAudit: 'Start New Audit',
    demoMode: 'Demo Mode',
    calibrationSheet: 'Calibration Sheet',
    records: 'Evidence Records',
    protocol: 'Protocol Rules',
    observedEvidence: 'OBSERVED VISUAL EVIDENCE',
    unverified: 'UNVERIFIED (Laboratory Only)',
    brokenDamaged: 'Broken / Damaged',
    discoloration: 'Discoloration',
    foreignObjects: 'Foreign Objects',
    criticalDefects: 'Critical Visual Defects',
    minorDefects: 'Minor Visual Defects',
    coverage: 'Grid Dispersion',
    opticalQuality: 'Optical Quality',
    failureTitle: 'Reliable visual evidence could not be established.',
    failureMessage: 'The optical calibration checks fell below acceptable thresholds. Please recapture the sample under better conditions.',
    recaptureButton: 'Recapture with Corrected Settings',
    rulerTool: 'Millimeter Ruler Tool',
    comparisonTool: 'Side-by-Side Comparison',
  },
  hi: {
    appName: 'किसानदृष्टि',
    tagline: 'मूल्यांकन से पहले साक्ष्य',
    centralMessage: 'किसानदृष्टि फसल का मूल्य तय नहीं करता। यह मानकीकृत दृश्य साक्ष्य बनाता है जिसे दोनों पक्ष देख सकें।',
    startAudit: 'नया ऑडिट शुरू करें',
    demoMode: 'डेमो मोड',
    calibrationSheet: 'कैलिब्रेशन शीट',
    records: 'साक्ष्य रिकॉर्ड',
    protocol: 'प्रोटोकॉल नियम',
    observedEvidence: 'प्रत्यक्ष दृश्य साक्ष्य',
    unverified: 'असत्यापित (केवल प्रयोगशाला)',
    brokenDamaged: 'टूटे / क्षतिग्रस्त दाने',
    discoloration: 'रंग परिवर्तन / सिकुड़े दाने',
    foreignObjects: 'विजातीय वस्तुएं (कंकड़/बीज)',
    criticalDefects: 'गंभीर दृश्य दोष',
    minorDefects: 'सामान्य दृश्य दोष',
    coverage: 'ग्रिड फैलाव',
    opticalQuality: 'ऑप्टिकल गुणवत्ता',
    failureTitle: 'विश्वसनीय दृश्य साक्ष्य स्थापित नहीं किया जा सका।',
    failureMessage: 'ऑप्टिकल कैलिब्रेशन जांच सीमा से कम पाई गई। कृपया बेहतर रोशनी और सही कोण में पुनः फोटो लें।',
    recaptureButton: 'सही सेटिंग्स के साथ दोबारा फोटो लें',
    rulerTool: 'मिलीमीटर पैमाना टूल',
    comparisonTool: 'तुलनात्मक विश्लेषण',
  },
  pa: {
    appName: 'ਕਿਸਾਨਦ੍ਰਿਸ਼ਟੀ',
    tagline: 'ਮੁੱਲ ਤੈਅ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਬੂਤ',
    centralMessage: 'ਕਿਸਾਨਦ੍ਰਿਸ਼ਟੀ ਫਸਲ ਦਾ ਮੁੱਲ ਤੈਅ ਨਹੀਂ ਕਰਦੀ। ਇਹ ਮਿਆਰੀ ਵਿਜ਼ੂਅਲ ਸਬੂਤ ਬਣਾਉਂਦੀ ਹੈ ਜਿਸਦੀ ਦੋਵੇਂ ਧਿਰਾਂ ਪੜਤਾਲ ਕਰ ਸਕਣ।',
    startAudit: 'ਨਵਾਂ ਆਡਿਟ ਸ਼ੁਰੂ ਕਰੋ',
    demoMode: 'ਡੈਮੋ ਮੋਡ',
    calibrationSheet: 'ਕੈਲੀਬ੍ਰੇਸ਼ਨ ਸ਼ੀਟ',
    records: 'ਸਬੂਤ ਰਿਕਾਰਡ',
    protocol: 'ਪ੍ਰੋਟੋਕੋਲ ਨਿਯਮ',
    observedEvidence: 'ਵੇਖੇ ਗਏ ਵਿਜ਼ੂਅਲ ਸਬੂਤ',
    unverified: 'ਗੈਰ-ਪ੍ਰਮਾਣਿਤ (ਸਿਰਫ ਲੈਬ)',
    brokenDamaged: 'ਟੁੱਟੇ / ਨੁਕਸਾਨੇ ਦਾਣੇ',
    discoloration: 'ਬਦਰੰਗ / ਸੁੰਗੜੇ ਦਾਣੇ',
    foreignObjects: 'ਬਾਹਰੀ ਵਸਤਾਂ (ਪੱਥਰ/ਬੀਜ)',
    criticalDefects: 'ਗੰਭੀਰ ਵਿਜ਼ੂਅਲ ਨੁਕਸ',
    minorDefects: 'ਮਾਮੂਲੀ ਵਿਜ਼ੂਅਲ ਨੁਕਸ',
    coverage: 'ਗਰਿੱਡ ਫੈਲਾਅ',
    opticalQuality: 'ਆਪਟੀਕਲ ਕੁਆਲਿਟੀ',
    failureTitle: 'ਭਰੋਸੇਯੋਗ ਵਿਜ਼ੂਅਲ ਸਬੂਤ ਸਥਾਪਤ ਨਹੀਂ ਹੋ ਸਕੇ।',
    failureMessage: 'ਆਪਟੀਕਲ ਕੈਲੀਬ੍ਰੇਸ਼ਨ ਜਾਂਚ ਮਿਆਰ ਤੋਂ ਘੱਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਚੰਗੀ ਰੋਸ਼ਨੀ ਅਤੇ ਸਿੱਧੇ ਕੋਣ ਵਿੱਚ ਦੁਬਾਰਾ ਫੋਟੋ ਲਓ।',
    recaptureButton: 'ਸਹੀ ਸੈਟਿੰਗਾਂ ਨਾਲ ਦੁਬਾਰਾ ਫੋਟੋ ਖਿੱਚੋ',
    rulerTool: 'ਮਿਲੀਮੀਟਰ ਰੂਲਰ ਟੂਲ',
    comparisonTool: 'ਤੁਲਨਾਤਮਕ ਵਿਸ਼ਲੇਸ਼ਣ',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kd_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'pa')) {
        setLanguage(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('kd_lang', lang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
