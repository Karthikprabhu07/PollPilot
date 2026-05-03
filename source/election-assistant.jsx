import React, { useState, useRef, useEffect, Component } from "react";
import './election-assistant.css';
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const LANGUAGES = [
  { code: "en", label: "English",    native: "English"    },
  { code: "hi", label: "Hindi",      native: "हिन्दी"      },
  { code: "ta", label: "Tamil",      native: "தமிழ்"       },
  { code: "te", label: "Telugu",     native: "తెలుగు"      },
  { code: "mr", label: "Marathi",    native: "मराठी"       },
  { code: "kn", label: "Kannada",    native: "ಕನ್ನಡ"       },
  { code: "ml", label: "Malayalam",  native: "മലയാളം"     },
  { code: "bn", label: "Bengali",    native: "বাংলা"       },
  { code: "ur", label: "Urdu",       native: "اردو"        },
  { code: "ar", label: "Arabic",     native: "العربية"    },
  { code: "es", label: "Spanish",    native: "Español"     },
  { code: "fr", label: "French",     native: "Français"    },
  { code: "de", label: "German",     native: "Deutsch"     },
  { code: "zh", label: "Chinese",    native: "中文"         },
  { code: "ja", label: "Japanese",   native: "日本語"       },
  { code: "ko", label: "Korean",     native: "한국어"       },
  { code: "ru", label: "Russian",    native: "Русский"     },
  { code: "pt", label: "Portuguese", native: "Português"   },
  { code: "ha", label: "Hausa",      native: "Hausa"       },
  { code: "yo", label: "Yoruba",     native: "Yorùbá"      },
  { code: "ig", label: "Igbo",       native: "Igbo"        }
];

const TRANSLATIONS = {
  en: {
    newChat: "New chat", search: "Search", selectLang: "Select Language", signIn: "Sign In", signOut: "Sign Out", guestMode: "Guest Mode",
    welcomeTitle: "Your Election Guide", welcomeSubtitle: "Civic intelligence for every democracy", selectYourLang: "Select your language", currently: "Currently", continueIn: "Continue in",
    placeholder: "Message PollPilot...", footer: "PollPilot can make mistakes. Check important info.",
    historyToday: "Today", historyYesterday: "Yesterday", historyOlder: "Older", historyPinned: "Pinned", noHistory: "No conversations yet",
    askVoter: "Ask about voter registration →", rename: "Rename", delete: "Delete", pin: "Pin chat", unpin: "Unpin chat", retry: "Retry",
    prompts: ["How do I register to vote?", "What happens during counting?", "When are the next elections?", "Rules & Eligibility"]
  },
  hi: {
    newChat: "नई चैट", search: "खोजें", selectLang: "भाषा चुनें", signIn: "साइन इन करें", signOut: "साइन आउट", guestMode: "अतिथि मोड",
    welcomeTitle: "आपका चुनाव मार्गदर्शक", welcomeSubtitle: "हर लोकतंत्र के लिए नागरिक बुद्धिमत्ता", selectYourLang: "अपनी भाषा चुनें", currently: "वर्तमान में", continueIn: "जारी रखें",
    placeholder: "PollPilot को संदेश भेजें...", footer: "PollPilot गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करें।",
    historyToday: "आज", historyYesterday: "कल", historyOlder: "पुराना", historyPinned: "पिन किया गया", noHistory: "अभी तक कोई बातचीत नहीं",
    askVoter: "मतदाता पंजीकरण के बारे में पूछें →", rename: "नाम बदलें", delete: "मिटाएं", pin: "चैट पिन करें", unpin: "चैट अनपिन करें", retry: "पुनः प्रयास करें",
    prompts: ["मैं वोट देने के लिए पंजीकरण कैसे करूँ?", "गणना के दौरान क्या होता है?", "अगলে चुनाव कब हैं?", "नियम और पात्रता"]
  },
  ta: {
    newChat: "புதிய அரட்டை", search: "தேடு", selectLang: "மொழியைத் தேர்ந்தெடுக்கவும்", signIn: "உள்நுழைய", signOut: "வெளியேறு", guestMode: "விருந்தினர் பயன்முறை",
    welcomeTitle: "உங்கள் தேர்தல் வழிகாட்டி", welcomeSubtitle: "ஒவ்வொரு ஜனநாயகத்திற்கும் குடிமை நுண்ணறிவு", selectYourLang: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", currently: "தற்போது", continueIn: "தொடரவும்",
    placeholder: "PollPilot-க்கு செய்தி அனுப்பவும்...", footer: "PollPilot பிழைகளைச் செய்யலாம். முக்கியத் தகவலைச் சரிபார்க்கவும்.",
    historyToday: "இன்று", historyYesterday: "நேற்று", historyOlder: "பழையது", historyPinned: "பின்தொடரப்பட்டது", noHistory: "இன்னும் உரையாடல்கள் இல்லை",
    askVoter: "வாக்காளர் பதிவு பற்றி கேளுங்கள் →", rename: "பெயரை மாற்றவும்", delete: "நீக்கவும்", pin: "அரட்டையை பின் செய்யவும்", unpin: "அரட்டையை அன்ஃபின் செய்யவும்", retry: "மீண்டும் முயற்சிக்கவும்",
    prompts: ["நான் வாக்களிக்க எவ்வாறு பதிவு செய்வது?", "எண்ணிக்கையின் போது என்ன நடக்கும்?", "அடுத்த தேர்தல்கள் எப்போது?", "விதிகள் மற்றும் தகுதி"]
  },
  te: {
    newChat: "కొత్త చాట్", search: "వెతకండి", selectLang: "భాషను ఎంచుకోండి", signIn: "సైన్ ఇన్", signOut: "సైన్ అవుట్", guestMode: "గెస్ట్ మోడ్",
    welcomeTitle: "మీ ఎన్నికల గైడ్", welcomeSubtitle: "ప్రతి ప్రజాస్వామ్యం కోసం పౌర మేధస్సు", selectYourLang: "మీ భాషను ఎంచుకోండి", currently: "ప్రస్తుతం", continueIn: "కొనసాగించండి",
    placeholder: "PollPilot కి సందేశం పంపండి...", footer: "PollPilot తప్పులు చేయవచ్చు. ముఖ్యమైన సమాచారాన్ని తనిఖీ చేయండి.",
    historyToday: "ఈరోజు", historyYesterday: "నిన్న", historyOlder: "పాతవి", historyPinned: "పిన్ చేయబడింది", noHistory: "ఇంకా సంభాషణలు లేవు",
    askVoter: "ఓటరు నమోదు గురించి అడగండి →", rename: "పేరు మార్చు", delete: "తొలగించు", pin: "చాట్‌ను పిన్ చేయండి", unpin: "చాట్‌ను అన్‌పిన్ చేయండి", retry: "మళ్ళీ ప్రయత్నించండి",
    prompts: ["నేను ఓటు వేయడానికి ఎలా నమోదు చేసుకోవాలి?", "కౌంటింగ్ సమయంలో ఏమి జరుగుతుంది?", "తదుపరి ఎన్నికలు ఎప్పుడు?", "నియమాలు మరియు అర్హత"]
  },
  mr: {
    newChat: "नवीन चॅट", search: "शोधा", selectLang: "भाषा निवडा", signIn: "साइन इन करा", signOut: "साइन आउट", guestMode: "पाहुणा मोड",
    welcomeTitle: "तुमचे निवडणूक मार्गदर्शक", welcomeSubtitle: "प्रत्येक लोकशाहीसाठी नागरी बुद्धिमत्ता", selectYourLang: "तुमची भाषा निवडा", currently: "सध्या", continueIn: "सुरू ठेवा",
    placeholder: "PollPilot ला संदेश पाठवा...", footer: "PollPilot चुका करू शकतो. महत्त्वाची माहिती तपासा.",
    historyToday: "आज", historyYesterday: "काल", historyOlder: "जुने", historyPinned: "पिन केलेले", noHistory: "अजून संभाषण नाही",
    askVoter: "मतदार नोंदणीबद्दल विचారా →", rename: "नाव बदला", delete: "हटवा", pin: "चॅट पिन करा", unpin: "चॅट अनपिन करा", retry: "पुन्हा प्रयत्न करा",
    prompts: ["मी मतदानासाठी नोंदणी कशी करू?", "मोजणी दरम्यान काय होते?", "पुढील निवडणुका कधी आहेत?", "नियम आणि पात्रता"]
  },
  kn: {
    newChat: "ಹೊಸ ಚಾಟ್", search: "ಹುಡುಕಿ", selectLang: "ಭಾಷೆಯನ್ನು ಆರಿಸಿ", signIn: "ಸೈನ್ ಇನ್", signOut: "ಸೈನ್ ಔಟ್", guestMode: "ಅತಿಥಿ ಮೋಡ್",
    welcomeTitle: "ನಿಮ್ಮ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿ", welcomeSubtitle: "ಪ್ರತಿ ಪ್ರಜಾಪ್ರಭುತ್ವಕ್ಕಾಗಿ ನಾಗರಿಕ ಬುದ್ಧಿವಂತಿಕೆ", selectYourLang: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ", currently: "ಪ್ರಸ್ತುತ", continueIn: "ಮುಂದುವರಿಸಿ",
    placeholder: "PollPilot ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ...", footer: "PollPilot ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಪ್ರಮುಖ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    historyToday: "ಇಂದು", historyYesterday: "ನಿನ್ನೆ", historyOlder: "ಹಳೆಯದು", historyPinned: "ಪಿನ್ ಮಾಡಲಾಗಿದೆ", noHistory: "ಇನ್ನೂ ಯಾವುದೇ ಸಂಭಾಷಣೆಗಳಿಲ್ಲ",
    askVoter: "ಮತದಾರರ ನೋಂದಣಿ ಬಗ್ಗೆ ಕೇಳಿ →", rename: "ಹೆಸರು ಬದಲಿಸಿ", delete: "ಅಳಿಸಿ", pin: "ಚಾಟ್ ಪಿನ್ ಮಾಡಿ", unpin: "ಚಾಟ್ ಅನ್ಪಿನ್ ಮಾಡಿ", retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    prompts: ["ನಾನು ಮತದಾನಕ್ಕೆ ಹೇಗೆ ನೋಂದಾಯಿಸಿಕೊಳ್ಳುವುದು?", "ಎಣಿಕೆಯ ಸಮಯದಲ್ಲಿ ಏನಾಗುತ್ತದೆ?", "ಮುಂದ್ರಿನ ಚುನಾವಣೆಗಳು ಯಾವಾಗ?", "ನಿಯಮಗಳು ಮತ್ತು ಅರ್ಹತೆ"]
  },
  ml: {
    newChat: "പുതിയ ചാറ്റ്", search: "തിരయുക", selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക", signIn: "സൈൻ ഇൻ ചെയ്യുക", signOut: "സൈൻ ഔട്ട്", guestMode: "ഗസ്റ്റ് മോഡ്",
    welcomeTitle: "നിങ്ങളുടെ തിരഞ്ഞെടുപ്പ് സഹായി", welcomeSubtitle: "ഓരോ ജനാധിപത്യത്തിനും സിവിക് ഇൻ്റലിజൻസ്", selectYourLang: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", currently: "നിലവിൽ", continueIn: "തുടരുക",
    placeholder: "PollPilot-ലേക്ക് സന്ദേശം അയക്കുക...", footer: "PollPilot തെറ്റുകൾ വരുത്തിയേക്കാം. പ്രധാന വിവരങ്ങൾ പരിശോധിക്കുക.",
    historyToday: "ഇന്ന്", historyYesterday: "ഇന്നലെ", historyOlder: "പഴയത്", historyPinned: "പിൻ ചെയ്തു", noHistory: "സംഭാഷണങ്ങളൊന്നുമില്ല",
    askVoter: "വോട്ടർ രജിസ്ട്രേഷനെക്കുറിച്ച് ചോദിക്കുക →", rename: "പേര് മാറ്റുക", delete: "ഡിലീറ്റ് ചെയ്യുക", pin: "ചാറ്റ് പിൻ ചെയ്യുക", unpin: "ചാറ്റ് അൺപിൻ ചെയ്യുക", retry: "വീണ്ടും ശ്രമിക്കുക",
    prompts: ["ഞാൻ എങ്ങനെ ವോട്ട് ചെയ്യാൻ രജിസ്റ്റർ ചെയ്യും?", "വോട്ടെണ്ണൽ സമയത്ത് എന്താണ് സംഭവിക്കുന്നത്?", "അടുത്ത തിരഞ്ഞെടുപ്പുകൾ എപ്പോഴാണ്?", "നിയമങ്ങളും യോഗ്യതയും"]
  },
  bn: {
    newChat: "নতুন চ্যাট", search: "খুঁজুন", selectLang: "ভাষা নির্বাচন করুন", signIn: "সাইন ইন করুন", signOut: "সাইন আউট", guestMode: "গেস্ট মোড",
    welcomeTitle: "আপনার নির্বাচন গাইড", welcomeSubtitle: "প্রতিটি গণতন্ত্রের জন্য নাগরিক বুদ্ধিমত্তা", selectYourLang: "আপনার ভাষা নির্বাচন করুন", currently: "বর্তমানে", continueIn: "চালিয়ে যান",
    placeholder: "PollPilot-কে মেসেজ করুন...", footer: "PollPilot ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।",
    historyToday: "আজ", historyYesterday: "গতকাল", historyOlder: "পুরানো", historyPinned: "পিন করা", noHistory: "এখনও কোন কথোপকথন নেই",
    askVoter: "ভোটার নিবন্ধন সম্পর্কে জিজ্ঞাসা করুন →", rename: "নাম পরিবর্তন করুন", delete: "মুছে ফেলুন", pin: "চ্যাট পিন করুন", unpin: "চ্যাট আনপিন করুন", retry: "আবার চেষ্টা করুন",
    prompts: ["আমি কীভাবে ভোট দেওয়ার জন্য নিবন্ধন করব?", "গণনার সময় কী ঘটে?", "পরবর্তী নির্বাচন কবে?", "নিয়ম ও যোগ্যতা"]
  },
  ur: {
    newChat: "نئی چیٹ", search: "تلاش کریں", selectLang: "زبان منتخب کریں", signIn: "سائن ان", signOut: "سائن آؤٹ", guestMode: "مہمان موڈ",
    welcomeTitle: "آپ کا انتخابی گائیڈ", welcomeSubtitle: "ہر جمہوریت کے لیے شہری ذہانت", selectYourLang: "اپنی زبان منتخب کریں", currently: "فی الحال", continueIn: "جاری رکھیں",
    placeholder: "پیغام بھیجیں...", footer: "غلطیاں کر سکتا ہے۔ معلومات چیک کریں۔",
    historyToday: "آج", historyYesterday: "گزشتہ روز", historyOlder: "پرانا", historyPinned: "پن شدہ", noHistory: "ابھی تک کوئی گفتگو نہیں",
    askVoter: "رجسٹریشن کے بارے میں پوچھیں ←", rename: "نام تبدیل کریں", delete: "حذف کریں", pin: "چیٹ پن کریں", unpin: "چیٹ ان پن کریں", retry: "دوبارہ کوشش کریں",
    prompts: ["میں ووٹ کے لیے کیسے رجسٹر ہوں؟", "گنتی کے دوران کیا ہوتا ہے؟", "اگلے انتخابات کب ہیں؟", "قواعد و اہلیت"]
  },
  ar: {
    newChat: "دردشة جديدة", search: "بحث", selectLang: "اختر اللغة", signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", guestMode: "وضع الضيف",
    welcomeTitle: "دليلك الانتخابي", welcomeSubtitle: "الذكاء المدني لكل ديمقراطية", selectYourLang: "اختر لغتك", currently: "حالياً", continueIn: "استمرار بـ",
    placeholder: "أرسل رسالة...", footer: "قد يرتكب أخطاء. تحقق من المعلومات.",
    historyToday: "اليوم", historyYesterday: "أمس", historyOlder: "قديم", historyPinned: "مثبت", noHistory: "لا توجد محادثات بعد",
    askVoter: "اسأل عن التسجيل ←", rename: "تغيير الاسم", delete: "حذف", pin: "تثبيت الدردشة", unpin: "إلغاء التثبيت", retry: "إعادة المحاولة",
    prompts: ["كيف أسجل للتصويت؟", "ماذا يحدث أثناء العد؟", "متى الانتخابات القادمة؟", "القواعد والأهلية"]
  },
  es: {
    newChat: "Nueva charla", search: "Buscar", selectLang: "Seleccionar idioma", signIn: "Iniciar sesión", signOut: "Cerrar sesión", guestMode: "Modo invitado",
    welcomeTitle: "Tu guía electoral", welcomeSubtitle: "Inteligencia cívica para cada democracia", selectYourLang: "Selecciona tu idioma", currently: "Actualmente", continueIn: "Continuar en",
    placeholder: "Enviar mensaje...", footer: "Puede cometer errores. Verifique la información.",
    historyToday: "Hoy", historyYesterday: "Ayer", historyOlder: "Anterior", historyPinned: "Fijado", noHistory: "Aún no hay conversaciones",
    askVoter: "Preguntar sobre el registro ←", rename: "Renombrar", delete: "Eliminar", pin: "Fijar chat", unpin: "Desfijar chat", retry: "Reintentar",
    prompts: ["¿Cómo me registro para votar?", "¿Qué pasa durante el conteo?", "¿Cuándo son las próximas elecciones?", "Reglas y elegibilidad"]
  },
  fr: {
    newChat: "Nouveau chat", search: "Rechercher", selectLang: "Choisir la langue", signIn: "Se connecter", signOut: "Se déconnecter", guestMode: "Mode invité",
    welcomeTitle: "Votre guide électoral", welcomeSubtitle: "Intelligence civique pour chaque démocratie", selectYourLang: "Choisissez votre langue", currently: "Actualmente", continueIn: "Continuer en",
    placeholder: "Envoyer un message...", footer: "Peut faire des erreurs. Vérifiez les infos.",
    historyToday: "Aujourd'hui", historyYesterday: "Hier", historyOlder: "Plus ancien", historyPinned: "Épinglé", noHistory: "Aucune conversation",
    askVoter: "S'informer sur l'inscription ←", rename: "Renommer", delete: "Supprimer", pin: "Épingler", unpin: "Désépingler", retry: "Réessayer",
    prompts: ["Comment s'inscrire pour voter ?", "Que se passe-t-il pendant le dépouillement ?", "Quand sont les prochaines élections ?", "Règles et éligibilité"]
  },
  de: {
    newChat: "Neuer Chat", search: "Suchen", selectLang: "Sprache wählen", signIn: "Anmelden", signOut: "Abmelden", guestMode: "Gastmodus",
    welcomeTitle: "Ihr Wahlhelfer", welcomeSubtitle: "Staatsbürgerliche Intelligenz für jede Demokratie", selectYourLang: "Wählen Sie Ihre Sprache", currently: "Aktuell", continueIn: "Weiter auf",
    placeholder: "Nachricht senden...", footer: "Kann Fehler machen. Infos prüfen.",
    historyToday: "Heute", historyYesterday: "Gestern", historyOlder: "Älter", historyPinned: "Angeheftet", noHistory: "Noch keine Chats",
    askVoter: "Nach Registrierung fragen ←", rename: "Umbenennen", delete: "Löschen", pin: "Anheften", unpin: "Lösen", retry: "Wiederholen",
    prompts: ["Wie registriere ich mich?", "Was passiert bei der Auszählung?", "Wann sind die nächsten Wahlen?", "Regeln & Berechtigung"]
  },
  zh: {
    newChat: "新建对话", search: "搜索", selectLang: "选择语言", signIn: "登录", signOut: "退出登录", guestMode: "访客模式",
    welcomeTitle: "您的选举指南", welcomeSubtitle: "为每个民主国家提供公民智慧", selectYourLang: "选择您的语言", currently: "当前", continueIn: "继续使用",
    placeholder: "向 PollPilot 发送消息...", footer: "可能会犯错。请检查重要信息。",
    historyToday: "今天", historyYesterday: "昨天", historyOlder: "更早", historyPinned: "已固定", noHistory: "暂无对话",
    askVoter: "询问选民登记 →", rename: "重命名", delete: "删除", pin: "固定对话", unpin: "取消固定", retry: "重试",
    prompts: ["我如何登记投票？", "计票期间会发生什么？", "下次选举是什么时候？", "规则与资格"]
  },
  ja: {
    newChat: "新しいチャット", search: "検索", selectLang: "言語を選択", signIn: "サインイン", signOut: "サインアウト", guestMode: "ゲストモード",
    welcomeTitle: "あなたの選挙ガイド", welcomeSubtitle: "すべての民主主義のための市民的知性", selectYourLang: "言語を選択してください", currently: "現在", continueIn: "次で続行",
    placeholder: "PollPilot にメッセージを送信...", footer: "間違いを犯す可能性があります。情報を確認してください。",
    historyToday: "今日", historyYesterday: "昨日", historyOlder: "以前", historyPinned: "ピン留め済み", noHistory: "会話はまだありません",
    askVoter: "有権者登録について聞く →", rename: "名前を変更", delete: "削除", pin: "チャットを固定", unpin: "固定を解除", retry: "再試行",
    prompts: ["投票のためにどのように登録しますか？", "開票中に何が起こりますか？", "次の選挙はいつですか？", "ルールと資格"]
  },
  ko: {
    newChat: "새 채팅", search: "검색", selectLang: "언어 선택", signIn: "로그인", signOut: "로그아웃", guestMode: "게스트 모드",
    welcomeTitle: "당신의 선거 가이드", welcomeSubtitle: "모든 민주주의를 위한 시민 지능", selectYourLang: "언어를 선택하세요", currently: "현재", continueIn: "계속하기",
    placeholder: "PollPilot에게 메시지 보내기...", footer: "실수를 할 수 있습니다. 정보를 확인하세요.",
    historyToday: "오늘", historyYesterday: "어제", historyOlder: "오래된", historyPinned: "고정됨", noHistory: "대화가 없습니다",
    askVoter: "유권자 등록에 대해 문의 →", rename: "이름 바꾸기", delete: "삭제", pin: "채팅 고정", unpin: "고정 해제", retry: "재시도",
    prompts: ["투표 등록은 어떻게 하나요?", "개표 중에 무슨 일이 일어나나요?", "다음 선거는 언제인가요?", "규칙 및 자격"]
  }
};

const QUICK_PROMPTS = [
  { id: 0, arrow: "→" },
  { id: 1, arrow: "→" },
  { id: 2, arrow: "→" },
  { id: 3, arrow: "→" },
];

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function buildSystemPrompt(langLabel) {
  return `You are PollPilot, a premium, nonpartisan global election education assistant. Respond entirely in ${langLabel}. Be concise, highly professional, and format responses with markdown. Do not hallucinate.`;
}

async function callGroqAPI(cleanHistory, language, onChunk) {
  const langLabel = LANGUAGES.find(l => l.code === language)?.label ?? "English";
  const url = `https://api.groq.com/openai/v1/chat/completions`;
  
  const messages = [
    { role: "system", content: buildSystemPrompt(langLabel) },
    ...cleanHistory
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.2,
      stream: true
    }),
  });
  
  if (!response.ok) {
    let errMessage = `API Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (response.status === 429) {
        errMessage = "Groq rate limit exceeded. Please wait a moment.";
      } else if (errorData?.error?.message) {
        errMessage = errorData.error.message;
      }
    } catch (e) {}
    throw new Error(errMessage);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep the last incomplete line in the buffer
    
    for (const line of lines) {
      if (line.startsWith("data: ") && !line.includes("[DONE]")) {
        try {
          const parsed = JSON.parse(line.slice(6));
          const token = parsed.choices?.[0]?.delta?.content || "";
          fullContent += token;
          if (onChunk) onChunk(fullContent);
        } catch (e) {}
      }
    }
  }
  return fullContent || "I couldn't process that request.";
}

function renderMarkdown(text) {
  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  function processInline(str) {
    const parts = []; let cursor = 0, match;
    inlineRegex.lastIndex = 0;
    while ((match = inlineRegex.exec(str)) !== null) {
      if (match.index > cursor) parts.push(str.substring(cursor, match.index));
      const m = match[0];
      if (m.startsWith("**")) parts.push(<strong key={match.index}>{m.slice(2,-2)}</strong>);
      else if (m.startsWith("*")) parts.push(<em key={match.index}>{m.slice(1,-1)}</em>);
      else {
        const lbl = m.match(/\[(.*?)\]/)?.[1], url = m.match(/\((.*?)\)/)?.[1];
        parts.push(lbl && url ? <a key={match.index} href={url} target="_blank" rel="noopener noreferrer">{lbl}</a> : <span key={match.index}>{m}</span>);
      }
      cursor = inlineRegex.lastIndex;
    }
    if (cursor < str.length) parts.push(str.substring(cursor));
    return parts.length ? parts : str;
  }
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} style={{height:'8px'}} />;
    if (line.trim().startsWith("- ")) return <li key={i}>{processInline(line.trim().slice(2))}</li>;
    return <p key={i}>{processInline(line)}</p>;
  });
}

// ─── Icons ─────────────────────────────────────────────────────────────────
const IconMenu    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconLogo    = () => <svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm12-5H7v2h10v-2zm0-4H7v2h10v-2zm0-4H7v2h10V6z"/></svg>;
const IconMic     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
const IconTrash   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconPlus    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;


const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconSend    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const IconCheck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconChevron = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IconGlobe   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconLang    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const IconEdit    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconPinChat = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.5l-2.5-3v-6a4.5 4.5 0 0 0-9 0v6L5 15.5V17z"/></svg>;
const IconThreeDots = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>;
const IconMoon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconSun       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconCopy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconThumbsUp = ({ filled }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const IconThumbsDown = ({ filled }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>;
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;

// ─── Language Sheet ─────────────────────────────────────────────────────────
function LanguageSheet({ language, setLanguage, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = LANGUAGES.filter(l =>
    l.native.toLowerCase().includes(search.toLowerCase()) ||
    l.label.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="lang-sheet-overlay" onClick={onClose}>
      <div className="lang-sheet" onClick={e => e.stopPropagation()}>
        <div className="lang-sheet-handle" />
        <div className="lang-sheet-header">
          <IconSearch />
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="lang-sheet-label">{TRANSLATIONS[language]?.selectLang || "Select Language"}</div>
        <div className="lang-sheet-body">
          {filtered.map(l => (
            <div
              key={l.code}
              className={`lang-row ${language === l.code ? 'active' : ''}`}
              onClick={() => { setLanguage(l.code); onClose(); }}
            >
              <div className="lang-row-text">
                <span className="lang-native">{l.native}</span>
                {l.label !== l.native && <span className="lang-latin">{l.label}</span>}
              </div>
              {language === l.code && <div className="lang-check"><IconCheck /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const stepPrompts = {
  1: "Guide me step by step through voter registration. What do I need and how do I check my status?",
  2: "How do I research election candidates and understand the key issues before voting?",
  3: "How do I find my nearest polling station and what are the voting timelines I should know?",
  4: "Explain the complete process of casting my vote — both mail-in and in-person options.",
  5: "How does vote counting and result tracking work after election day?"
};

const stepTitles = {
  1: "Registration",
  2: "Learn Issues",
  3: "Polling Place",
  4: "Cast Your Vote",
  5: "Track Results"
};

const stepSubtitles = {
  1: "Check your voter registration status",
  2: "Understand candidates and their positions",
  3: "Find your nearest polling station",
  4: "Mail-in or in-person voting guide",
  5: "Follow the vote counting process"
};

const stepEmojis = {
  1: "📋",
  2: "📰",
  3: "📍",
  4: "✅",
  5: "📊"
};

function ElectionRoadmap({ activeStep, onStepClick }) {
  return (
    <div className="roadmap-container">
      <div className="roadmap-title">Election Roadmap</div>
      <div className="roadmap-steps">
        {[1,2,3,4,5].map(n => (
          <div 
            key={n} 
            className={`roadmap-step ${activeStep === n ? 'active' : ''}`}
            onClick={() => onStepClick(n)}
          >
            <div className="step-badge">{n}</div>
            <div className="step-icon">{stepEmojis[n]}</div>
            <div className="step-title">{stepTitles[n]}</div>
            <div className="step-subtitle">{stepSubtitles[n]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function ElectionAssistant() {
  const { isLoaded, isSignedIn, user } = useUser();
  const activeUserId = isSignedIn ? user.id : 'guest';
  const historyStorageKey = `pollpilot_history_${activeUserId}`;

  const [messages, setMessages]               = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [historySessions, setHistorySessions] = useState([]);
  const [input, setInput]                     = useState("");
  const [language, setLanguage]               = useState(() => localStorage.getItem("pollpilot_language") || "en");
  const [electionBadge, setElectionBadge]     = useState("Civic Intelligence");
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [isRecording, setIsRecording]         = useState(false);
  const [showLangSheet, setShowLangSheet]     = useState(false);
  // FIX: language-only onboarding
  const [onboardingDone, setOnboardingDone]   = useState(
    () => localStorage.getItem("pollpilot_onboarding") === "true"
  );
  const [histSearch, setHistSearch]           = useState("");
  const [dropdownId, setDropdownId]           = useState(null);
  const [theme, setTheme]                     = useState(() => localStorage.getItem("pollpilot_theme") || "light");
  const [copiedIndex, setCopiedIndex]         = useState(null);
  const [msgFeedback, setMsgFeedback]         = useState({});
  const [activeStep, setActiveStep]           = useState(null);
  const [completedSteps, setCompletedSteps]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('pollpilot_progress')) || []; } catch { return []; }
  });

  const messagesEndRef  = useRef(null);
  const recognitionRef  = useRef(null);
  const textareaRef     = useRef(null);
  const msgRefs         = useRef({});

  const activeLang = LANGUAGES.find(l => l.code === language);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setDropdownId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Persist language
  useEffect(() => { localStorage.setItem("pollpilot_language", language); }, [language]);

  // Handle Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pollpilot_theme", theme);
  }, [theme]);

  // Load chat history
  useEffect(() => {
    try {
      const h = localStorage.getItem(historyStorageKey);
      if (h) {
        setHistorySessions(JSON.parse(h));
      } else {
        setHistorySessions([]);
      }
    } catch {
      setHistorySessions([]);
    }
    // Also reset current active chat when user changes
    setMessages([]);
    setActiveSessionId(null);
  }, [historyStorageKey]);

  useEffect(() => { 
    localStorage.setItem(historyStorageKey, JSON.stringify(historySessions)); 
  }, [historySessions]);

  useEffect(() => {
    localStorage.setItem('pollpilot_progress', JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    const lastIndex = messages.length - 1;
    const lastMsg = messages[lastIndex];

    if (lastMsg?.role === 'assistant' && !lastMsg?.isStreaming) {
      const el = msgRefs.current[lastIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [messages]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (isLoading || lastMsg?.isStreaming || lastMsg?.role === 'user') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleDismissOnboarding = () => {
    setOnboardingDone(true);
    localStorage.setItem("pollpilot_onboarding", "true");
  };

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleFeedback = (i, type) => {
    setMsgFeedback(prev => ({
      ...prev,
      [i]: prev[i] === type ? null : type
    }));
  };

  const handleSend = async (text = input, isRetry = false, stepNumber = null) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    let currentSessionId = activeSessionId;
    let newMessages = [];

    if (!isRetry) { 
      newMessages = [...messages, { role: "user", content: trimmed }];
      setMessages(newMessages); 
      setInput(""); 
    } else {
      newMessages = messages.slice(0, -1);
      setMessages(newMessages);
    }
    
    if (!currentSessionId) {
      currentSessionId = Date.now();
      setActiveSessionId(currentSessionId);
      const title = trimmed.slice(0, 35) + (trimmed.length > 35 ? "…" : "");
      setHistorySessions(prev => [{ id: currentSessionId, title, messages: newMessages, date: new Date().toISOString() }, ...prev]);
    } else {
      setHistorySessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: newMessages } : s));
    }

    setIsLoading(true);
    textareaRef.current?.focus();

    try {
      const rawHistory = newMessages;
      const cleanHistory = [];
      for (const m of rawHistory) {
        if (m.isError) continue;
        const role = m.role === "user" ? "user" : "assistant";
        if (cleanHistory.length === 0 && role === "assistant") continue;
        if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === role) {
          cleanHistory[cleanHistory.length - 1].content += "\n\n" + m.content;
        } else {
          cleanHistory.push({ role, content: m.content });
        }
      }
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "", isStreaming: true }]);

      await callGroqAPI(cleanHistory, language, (text) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: text, isStreaming: true };
          return updated;
        });
      });

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], isStreaming: false };
        setHistorySessions(hist => hist.map(s => s.id === currentSessionId ? { ...s, messages: updated } : s));
        return updated;
      });
      if (stepNumber && !completedSteps.includes(stepNumber)) {
        setCompletedSteps(prev => [...prev, stepNumber]);
      }
    } catch (err) {
      setIsLoading(false);
      setMessages(prev => {
        const errorMessage = err.message || "Unable to connect. Please try again.";
        const updated = [...prev, { role: "assistant", content: errorMessage, isError: true, lastQuery: trimmed, isStreaming: false }];
        setHistorySessions(hist => hist.map(s => s.id === currentSessionId ? { ...s, messages: updated } : s));
        return updated;
      });
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };



  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const rec = new SR();
    rec.lang = language === "en" ? "en-US" : language;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => {
        const trimmedPrev = prev.trim();
        return trimmedPrev ? `${trimmedPrev} ${transcript}` : transcript;
      });
    };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
  };

  const handleRename = (id, e) => {
    e.stopPropagation();
    const session = historySessions.find(s => s.id === id);
    if (!session) return;
    const newTitle = window.prompt("Rename chat:", session.title);
    if (newTitle && newTitle.trim()) {
      setHistorySessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle.trim() } : s));
    }
    setDropdownId(null);
  };

  const handlePin = (id, e) => {
    e.stopPropagation();
    setHistorySessions(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
    setDropdownId(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this chat?")) {
      setHistorySessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) {
        setMessages([]);
        setActiveSessionId(null);
      }
    }
    setDropdownId(null);
  };

  // Group history by date and pinned
  const groupedHistory = React.useMemo(() => {
    const filtered = historySessions.filter(s =>
      !histSearch || s.title.toLowerCase().includes(histSearch.toLowerCase())
    );
    const groups = { Pinned: [], Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };
    const now = new Date();
    filtered.forEach(s => {
      if (s.pinned) {
        groups.Pinned.push(s);
        return;
      }
      const d = s.date ? new Date(s.date) : new Date();
      const diff = Math.floor((now - d) / 86400000);
      if (diff === 0) groups.Today.push(s);
      else if (diff === 1) groups.Yesterday.push(s);
      else if (diff < 7) groups["Previous 7 Days"].push(s);
      else groups.Older.push(s);
    });
    return groups;
  }, [historySessions, histSearch]);

  const hasMessages = messages.length > 0;
  const hasHistory  = historySessions.length > 0;

  if (!isLoaded) return <div className="pp-root" />;

  return (
    <div className="pp-root">
      {/* Overlay for mobile sidebar */}
      <div className={`overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`pp-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sb-top-row">
            <div className="sb-search">
              <IconSearch />
              <input
                type="text"
                placeholder={t.search}
                value={histSearch}
                onChange={e => setHistSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="sb-action" onClick={handleNewChat}>
            <IconEdit /> <span>{t.newChat}</span>
          </div>
          
          <div className="civic-progress">
            <p className="progress-label">ELECTION ROADMAP</p>
            <div className="progress-steps">
              {[1,2,3,4,5].map(n => (
                <div 
                  key={n}
                  className={`progress-dot ${completedSteps.includes(n) ? 'done' : ''}`}
                  title={stepTitles[n]}
                  onClick={() => { setActiveStep(n); handleSend(stepPrompts[n], false, n); if (window.innerWidth <= 768) setSidebarOpen(false); }}
                />
              ))}
            </div>
            <p className="progress-text">{completedSteps.length}/5 steps explored</p>
          </div>
        </div>

        <div className="sidebar-content">
          {hasHistory ? (
            Object.entries(groupedHistory).map(([group, sessions]) =>
              sessions.length > 0 ? (
                <React.Fragment key={group}>
                  <div className="hist-group">{group}</div>
                  {sessions.map((sess) => (
                    <div key={sess.id} className="hist-item-wrap">
                      <div
                        className={`hist-item ${activeSessionId === sess.id ? 'active' : ''}`}
                        onClick={() => { setMessages(sess.messages); setActiveSessionId(sess.id); if (window.innerWidth <= 768) setSidebarOpen(false); }}
                      >
                        <div className="hist-title">{sess.title}</div>
                        <button
                          className="hist-options-btn"
                          onClick={e => { e.stopPropagation(); setDropdownId(sess.id === dropdownId ? null : sess.id); }}
                        >
                          <IconThreeDots />
                        </button>
                      </div>
                      {dropdownId === sess.id && (
                        <div className="hist-dropdown" onClick={e => e.stopPropagation()}>
                          <button onClick={(e) => handleRename(sess.id, e)}>
                            <IconEdit /> Rename
                          </button>
                          <button onClick={(e) => handlePin(sess.id, e)}>
                            <IconPinChat /> {sess.pinned ? "Unpin chat" : "Pin chat"}
                          </button>
                          <button className="danger" onClick={(e) => handleDelete(sess.id, e)}>
                            <IconTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ) : null
            )
          ) : (
            <div className="hist-empty">
              <span>{t.noHistory}</span>
              <button
                className="hist-empty-chip"
                onClick={() => { setInput(t.prompts[0]); setSidebarOpen(false); }}
              >
                {t.askVoter}
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
            </SignedIn>
            <SignedOut>G</SignedOut>
          </div>
          <div className="profile-name" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <SignedIn>
              <span style={{ lineHeight: '1.2' }}>{user?.firstName || 'User'}</span>
              <SignOutButton>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--txt-muted)', fontSize: '11px', cursor: 'pointer', padding: 0, marginTop: '2px', textDecoration: 'underline' }}>{t.signOut}</button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>{t.guestMode}</SignedOut>
          </div>

          <button 
            className="theme-toggle-btn sb-theme-toggle" 
            onClick={(e) => { e.stopPropagation(); setTheme(t => t === 'light' ? 'dark' : 'light'); }}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pp-main">
        {/* Header */}
        <header className="pp-header">
          <div className="hdr-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <IconMenu />
            </button>
          </div>

          <div className="hdr-title-center">
            <span>PollPilot</span>
          </div>

          <div className="hdr-actions">

            {/* FIX: single language selector only, no country in header */}
            <button className="lang-selector-btn" onClick={() => setShowLangSheet(true)}>
              <IconGlobe />
              {activeLang?.native || "English"}
              <IconChevron />
            </button>

            {/* FIX: sign in as text link, not pill button */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="signin-link">{t.signIn}</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
            </SignedIn>
          </div>
        </header>

        {/* Chat Area */}
        <div className="chat-area">
          {!hasMessages ? (
            <div className="welcome-state">
              {/* FIX: globe watermark z-index 0, behind everything */}
              <svg className="globe-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>

              <h1 className="welcome-title">{t.welcomeTitle}</h1>
              <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

              {!onboardingDone ? (
                /* FIX: language-only onboarding — single card, compact */
                <div className="onboarding-lang">
                  <div className="ob-lang-card" onClick={() => setShowLangSheet(true)}>
                    <IconLang />
                    <div className="ob-lang-card-text">
                      <strong>{t.selectYourLang}</strong>
                      <span>{t.currently}: {activeLang?.native || "English"}</span>
                    </div>
                  </div>
                  <button className="ob-continue-btn" onClick={handleDismissOnboarding}>
                    {t.continueIn} {activeLang?.native || "English"}
                  </button>
                </div>
              ) : (
                /* FIX: 2x2 grid always */
                <div className="starters-grid">
                  {QUICK_PROMPTS.map((q, i) => (
                    <div 
                      key={i} 
                      className="starter" 
                      onClick={() => {
                        handleDismissOnboarding(); 
                        handleSend(t.prompts[q.id]);
                      }}
                    >
                      <span>{t.prompts[q.id]}</span>
                      <span className="starter-arrow">{q.arrow}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <ElectionRoadmap 
                activeStep={activeStep} 
                onStepClick={(n) => {
                  setActiveStep(n);
                  handleSend(stepPrompts[n], false, n);
                }} 
              />
            </div>
          ) : (
            messages.map((m, i) => {
              const isLastBotMsg = m.role !== 'user' && i === messages.length - 1;
              return (
              <div key={i} ref={el => msgRefs.current[i] = el} className={`msg-wrap ${m.role !== 'user' ? 'msg-bot-wrap' : 'msg-user-wrap'}`}>
                <div className={`msg-inner ${m.role !== 'user' ? 'msg-bot' : 'msg-user'}`}>
                  <div className={m.role !== 'user' ? 'bubble-bot' : 'bubble-user'}>
                    {m.role !== 'user'
                      ? (m.isStreaming ? <>{m.content}<span className="streaming-cursor">▍</span></> : renderMarkdown(m.content))
                      : m.content
                    }
                    {m.isError && (
                      <button
                        onClick={() => handleSend(m.lastQuery, true)}
                        style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        ↺ Retry
                      </button>
                    )}
                  </div>
                  {m.role !== 'user' && !m.isStreaming && !m.isError && (
                    <div className="msg-actions">
                      <button className="msg-action-btn" onClick={() => handleCopy(m.content, i)} title="Copy">
                        {copiedIndex === i ? <IconCheck /> : <IconCopy />} Copy
                      </button>
                      <button className={`msg-action-btn ${msgFeedback[i] === 'liked' ? 'active' : ''}`} onClick={() => handleFeedback(i, 'liked')} title="Like">
                        <IconThumbsUp filled={msgFeedback[i] === 'liked'} /> Like
                      </button>
                      <button className={`msg-action-btn ${msgFeedback[i] === 'disliked' ? 'active' : ''}`} onClick={() => handleFeedback(i, 'disliked')} title="Dislike">
                        <IconThumbsDown filled={msgFeedback[i] === 'disliked'} /> Dislike
                      </button>
                      {isLastBotMsg && (
                        <button className="msg-action-btn" onClick={() => {
                          const lastUserMsg = [...messages].reverse().find(msg => msg.role === 'user');
                          if (lastUserMsg) handleSend(lastUserMsg.content, true);
                        }} title="Regenerate">
                          <IconRefresh /> Regenerate
                        </button>
                      )}
                    </div>
                  )}
                  <div className="msg-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )})
          )}

          {isLoading && (
            <div className="msg-wrap msg-bot-wrap">
              <div className="msg-inner msg-bot">
                <div className="bubble-bot">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            {!hasMessages && (
              <div className="suggestion-chips">
                <button className="chip" onClick={() => window.open('https://voters.eci.gov.in/', '_blank')}>Voter Helpline Website</button>
                <button className="chip" onClick={() => handleSend("How to find my polling location")}>Polling Locations</button>
                <button className="chip" onClick={() => handleSend("How does absentee voting work")}>Absentee Voting</button>
              </div>
            )}
            <div className="input-box">
              <button className={`btn-mic ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
                {isRecording ? (
                  <div className="mic-waves">
                    <span /><span /><span /><span /><span />
                  </div>
                ) : (
                  <IconMic />
                )}
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                rows={1}
              />
              <button
                className={`btn-send ${input.trim() ? 'active' : ''}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
              >
                <IconSend />
              </button>
            </div>
            <div className="input-footer">{t.footer}</div>
          </div>
        </div>
      </main>

      {/* Language Sheet — always accessible on both mobile and desktop */}
      {showLangSheet && (
        <LanguageSheet
          language={language}
          setLanguage={setLanguage}
          onClose={() => setShowLangSheet(false)}
        />
      )}
      <style>{`
.sb-action {
  display: flex; align-items: center; gap: 12px; padding: 12px;
  border-radius: 8px; cursor: pointer; color: var(--txt-main);
  font-weight: 500; font-size: 14px; margin-bottom: 4px;
}
.sb-action:hover { background: var(--card-hover); }

.sb-top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.sb-search {
  flex: 1; display: flex; align-items: center; background: rgba(0,0,0,0.05);
  padding: 8px 12px; border-radius: 99px; gap: 8px; color: var(--txt-muted);
}
.sb-search input { border: none; background: transparent; outline: none; flex: 1; font-size: 14px; color: var(--txt-main); }

.sidebar-content { flex: 1; overflow-y: auto; padding-right: 4px; }
.hist-group { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--txt-muted); margin: 20px 0 8px 4px; font-weight: 600; }

.hist-item-wrap { position: relative; margin-bottom: 2px; }
.hist-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 8px; cursor: pointer; color: var(--txt-main);
  -webkit-tap-highlight-color: transparent;
}
.hist-item:hover, .hist-item.active { background: var(--card-hover); }
.hist-title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; padding-right: 8px; }

.hist-options-btn {
  background: transparent; border: none; color: var(--txt-muted); cursor: pointer;
  padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  -webkit-tap-highlight-color: transparent; outline: none;
}
.hist-options-btn:hover { color: var(--txt-main); background: rgba(0,0,0,0.05); }

.hist-dropdown {
  position: absolute; top: 30px; right: 10px; z-index: 100;
  background: #2D2D2D; color: #fff; border-radius: 12px; padding: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2); width: 160px;
  display: flex; flex-direction: column;
}
.hist-dropdown button {
  background: transparent; border: none; color: #fff; padding: 10px 12px;
  text-align: left; cursor: pointer; font-size: 14px; border-radius: 8px;
  display: flex; align-items: center; gap: 10px; -webkit-tap-highlight-color: transparent; outline: none;
}
.hist-dropdown button:hover { background: rgba(255,255,255,0.1); }
.hist-dropdown button.danger { color: #ff6b6b; }
      `}</style>
    </div>
  );
}

// ─── Error Boundary ──────────────────────────────────────────────────────────
class PollPilotErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#F7F4EF', fontFamily:'sans-serif' }}>
          <h2 style={{ color: '#1B2D4F' }}>Something went wrong</h2>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop:'16px', padding:'10px 24px', borderRadius:'99px', background:'#1B2D4F', color:'#fff', border:'none', cursor:'pointer', fontSize:'14px' }}
          >
            Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PollPilotApp() {
  return (
    <PollPilotErrorBoundary>
      <ElectionAssistant />
    </PollPilotErrorBoundary>
  );
}
