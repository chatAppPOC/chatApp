import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // General UI
      welcome: "Welcome to Activision Player Support",

      // Chat-specific messages
      thankYou: "Thank you for contacting us. Have a nice day!",
      caseCreated:
        "A case has been created with ID: {{caseId}}. We will get back to you soon!",

      // Chat window header
      chatHeader: "Activision Support Chat",
      online: "Online",

      // Placeholder or default messages
      noOptions: "No further options available.",

      // Error messages
      errorGeneric: "An error occurred. Please try again.",

      // Language selection
      languageSelector: {
        english: "English",
        spanish: "Español",
        french: "Français",
        hindi: "हिंदी",
        tamil: "தமிழ்",
      },

      // Chat input hints
      chatInput: {
        placeholder: "Type your message here",
        enterHint: "Press Enter to send, Shift + Enter for new line",
      },
    },
  },
  es: {
    translation: {
      // General UI
      welcome: "Bienvenido al Soporte de Jugadores de Activision",

      // Chat-specific messages
      thankYou: "Gracias por contactarnos. ¡Que tengas un buen día!",
      caseCreated:
        "Se ha creado un caso con ID: {{caseId}}. ¡Nos pondremos en contacto pronto!",

      // Chat window header
      chatHeader: "Activision Soporte Chat",
      online: "En línea",

      // Placeholder or default messages
      noOptions: "No hay más opciones disponibles.",

      // Error messages
      errorGeneric: "Ocurrió un error. Por favor, inténtelo de nuevo.",

      // Language selection
      languageSelector: {
        english: "Inglés",
        spanish: "Español",
        french: "Francés",
        hindi: "हिंदी",
        tamil: "தமிழ்",
      },

      // Chat input hints
      chatInput: {
        placeholder: "Escribe tu mensaje aquí",
        enterHint: "Presiona Enter para enviar, Shift + Enter para nueva línea",
      },
    },
  },
  fr: {
    translation: {
      // General UI
      welcome: "Bienvenue sur le Support des Joueurs Activision",

      // Chat-specific messages
      thankYou: "Merci de nous avoir contactés. Bonne journée !",
      caseCreated:
        "Un cas a été créé avec l'ID : {{caseId}}. Nous vous recontacterons bientôt !",

      // Chat window header
      chatHeader: "Activision Assistance Chat",
      online: "En ligne",

      // Placeholder or default messages
      noOptions: "Aucune option supplémentaire disponible.",

      // Error messages
      errorGeneric: "Une erreur s'est produite. Veuillez réessayer.",

      // Language selection
      languageSelector: {
        english: "Anglais",
        spanish: "Espagnol",
        french: "Français",
        hindi: "हिंदी",
        tamil: "தமிழ்",
      },

      // Chat input hints
      chatInput: {
        placeholder: "Tapez votre message ici",
        enterHint:
          "Appuyez sur Entrée pour envoyer, Maj + Entrée pour une nouvelle ligne",
      },
    },
  },
  hi: {
    translation: {
      // General UI
      welcome: "Activision खिलाड़ी सहायता में स्वागत है",

      // Chat-specific messages
      thankYou: "हमसे संपर्क करने के लिए धन्यवाद। अपना दिन अच्छा बिताएं!",
      caseCreated:
        "एक केस बनाया गया है ID: {{caseId}}। हम जल्द ही आपसे संपर्क करेंगे!",

      // Chat window header
      chatHeader: "Activision सहायता चैट",
      online: "ऑनलाइन",

      // Placeholder or default messages
      noOptions: "कोई और विकल्प उपलब्ध नहीं है।",

      // Error messages
      errorGeneric: "एक त्रुटि हुई है। कृपया फिर से प्रयास करें।",

      // Language selection
      languageSelector: {
        english: "अंग्रेज़ी",
        spanish: "स्पेनिश",
        french: "फ्रेंच",
        hindi: "हिंदी",
        tamil: "தமிழ்",
      },

      // Chat input hints
      chatInput: {
        placeholder: "अपना संदेश यहां टाइप करें",
        enterHint: "भेजने के लिए Enter दबाएं, नई पंक्ति के लिए Shift + Enter",
      },
    },
  },
  ta: {
    translation: {
      // General UI
      welcome: "Activision பிளேயர் ஆதரவுக்கு வரவேற்பு",

      // Chat-specific messages
      thankYou: "எங்களைத் தொடர்பு கொண்டதற்கு நன்றி. நல்ல நாள் வாழ்த்துகிறோம்!",
      caseCreated:
        "ஒரு வழக்கு உருவாக்கப்பட்டுள்ளது ID: {{caseId}}. நாங்கள் விரைவில் தொடர்பு கொள்வோம்!",

      // Chat window header
      chatHeader: "Activision ஆதரவு அரட்டை",
      online: "இணைய வழி",

      // Placeholder or default messages
      noOptions: "மேலும் வழிகள் இல்லை.",

      // Error messages
      errorGeneric: "ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",

      // Language selection
      languageSelector: {
        english: "ஆங்கிலம்",
        spanish: "ஸ்பானிஷ்",
        french: "பிரெஞ்சு",
        hindi: "இந்தி",
        tamil: "தமிழ்",
      },

      // Chat input hints
      chatInput: {
        placeholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்",
        enterHint: "அனுப்ப Enter, புதிய வரிக்கு Shift + Enter",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already escapes values
  },
});

export default i18n;
