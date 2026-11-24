import type { CertificatePlaceholderVars } from "./certificateCopy";
import { fillCertificateCopy } from "./certificateCopy";

export type ThirdLegalBlock = {
  heading: string;
  body: string;
  dir?: "rtl" | "ltr";
  fontClass?: string;
};

function normLangKey(lang: string): string {
  return lang.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Third column = language that is neither English nor Arabic (usually target). */
export function resolveTrilingualThirdLanguageName(
  sourceLang: string,
  targetLang: string
): string {
  const isEn = (l: string) => /^english$/i.test(l.trim());
  const isAr = (l: string) => /^arabic$/i.test(l.trim());
  if (!isEn(sourceLang) && !isAr(sourceLang)) return sourceLang.trim();
  if (!isEn(targetLang) && !isAr(targetLang)) return targetLang.trim();
  return targetLang.trim();
}

function compactVars(vars: CertificatePlaceholderVars) {
  return {
  ...vars,
  sourceLangThird: vars.sourceLang,
  targetLangThird: vars.targetLang,
  };
}

/**
 * Professional single-paragraph legal blocks (EN · AR · third language).
 * Third-language strings use the same placeholders as the official template.
 */
const THIRD_LEGAL_TEMPLATES: Record<
  string,
  { heading: string; body: string; dir?: "rtl" | "ltr"; fontClass?: string }
> = {
  hindi: {
    heading: "प्रमाणन",
    dir: "ltr",
    fontClass: "leading-[1.55]",
    body: "{{officeNameEn}} प्रमाणित करता है कि संलग्न {{sourceLang}} दस्तावेज़ संलग्न {{targetLang}} दस्तावेज़ का सत्य और सटीक अनुवाद है, और यह अनुवाद एक योग्य अनुवादक द्वारा तैयार किया गया था। यह प्रमाणन केवल अनुवाद की शुद्धता से संबंधित है और मूल दस्तावेज़ की प्रामाणिकता या विषयवस्तु की पुष्टि नहीं करता है। इस प्रकार, हम {{issueDateLongEn}} को रियाद, सऊदी अरब में अपने हस्ताक्षर और आधिकारिक मुहर द्वारा इस अनुवाद को प्रमाणित करते हैं।",
  },
  french: {
    heading: "Attestation",
    body: "{{officeNameEn}} atteste que le document en {{sourceLang}} ci-joint constitue une traduction fidèle et exacte du document en {{targetLang}} ci-joint, et que cette traduction a été réalisée par un traducteur qualifié. La présente attestation porte exclusivement sur l'exactitude de la traduction et ne vaut pas attestation de l'authenticité ni du contenu du document original. En conséquence, nous certifions cette traduction par notre signature et sceau officiel le {{issueDateLongEn}}, à Riyad, Royaume d'Arabie saoudite.",
  },
  spanish: {
    heading: "Certificación",
    body: "{{officeNameEn}} certifica que el documento adjunto en {{sourceLang}} es una traducción fiel y exacta del documento adjunto en {{targetLang}}, y que dicha traducción fue preparada por un traductor cualificado. Esta certificación se refiere únicamente a la exactitud de la traducción y no constituye aval de la autenticidad, legalidad o contenido del documento original. Por tanto, certificamos esta traducción con nuestra firma y sello oficial el {{issueDateLongEn}}, en Riad, Reino de Arabia Saudita.",
  },
  german: {
    heading: "Beglaubigung",
    body: "{{officeNameEn}} bestätigt hiermit, dass die beigefügte Urkunde in {{sourceLang}} eine wahrheitsgetreue und genaue Übersetzung der beigefügten Urkunde in {{targetLang}} ist und dass die Übersetzung von einem qualifizierten Übersetzer erstellt wurde. Diese Beglaubigung bezieht sich ausschließlich auf die Richtigkeit der Übersetzung und belegt nicht die Echtheit oder den Inhalt des Originaldokuments. Entsprechend beglaubigen wir diese Übersetzung mit Unterschrift und offiziellem Siegel am {{issueDateLongEn}} in Riad, Königreich Saudi-Arabien.",
  },
  urdu: {
    heading: "تصدیق",
    dir: "rtl",
    fontClass: "font-urdu",
    body: "{{officeNameEn}} تصدیق کرتا ہے کہ منسلک {{sourceLang}} دستاویز منسلک {{targetLang}} دستاویز کا درست اور مکمل ترجمہ ہے، اور یہ ترجمہ ایک اہل مترجم نے مرتب کیا ہے۔ یہ تصدیق صرف ترجمے کی درستگی سے متعلق ہے اور اصل دستاویز کی صداقت یا مواد کی تصدیق نہیں کرتی۔ لہٰذا ہم {{issueDateLongEn}} کو ریاض، مملکتِ سعودی عرب میں اپنے دستخط اور سرکاری مہر سے اس ترجمے کی تصدیق کرتے ہیں۔",
  },
  telugu: {
    heading: "ధృవీకరణ",
    dir: "ltr",
    body: "{{officeNameEn}} జతచేసిన {{sourceLang}} పత్రం జతచేసిన {{targetLang}} పత్రం యొక్క సరైన మరియు ఖచ్చితమైన అనువాదమని ధృవీకరిస్తుంది, మరియు ఈ అనువాదం అర్హత కలిగిన అనువాదకుడిచే తయారు చేయబడింది. ఈ ధృవీకరణ అనువాద ఖచ్చితత్వానికి మాత్రమే సంబంధించినది మరియు అసలు పత్రం యొక్క ప్రామాణికతను ధృవీకరించదు. తదనుగుణంగా, మేము {{issueDateLongEn}} న రియాద్, సౌదీ అరేబియాలో మా సంతకం మరియు అధికారిక ముద్రతో ఈ అనువాదాన్ని ధృవీకరిస్తాము.",
  },
  tamil: {
    heading: "சான்றிதழ்",
    body: "{{officeNameEn}} இணைக்கப்பட்ட {{sourceLang}} ஆவணம் இணைக்கப்பட்ட {{targetLang}} ஆவணத்தின் உண்மையான மற்றும் துல்லியமான மொழிபெயர்ப்பு என்று சான்றளிக்கிறது, மேலும் இந்த மொழிபெயர்ப்பு தகுதிவாய்ந்த மொழிபெயர்ப்பாளரால் தயாரிக்கப்பட்டது. இந்த சான்று மொழிபெயர்ப்பின் துல்லியத்தை மட்டுமே பற்றியது; அசல் ஆவணத்தின் நம்பகத்தன்மையை உறுதிப்படுத்துவதில்லை. அதன்படி, {{issueDateLongEn}} அன்று ரியாத், சவூதி அரேபியாவில் எங்கள் கையொப்பம் மற்றும் அதிகாரப்பூர்வ முத்திரையுடன் இந்த மொழிபெயர்ப்பை சான்றளிக்கிறோம்.",
  },
  malayalam: {
    heading: "സാക്ഷ്യപ്പെടുത്തൽ",
    body: "{{officeNameEn}} എന്നത് അറ്റാച്ചുചെയ്ത {{sourceLang}} രേഖ, അറ്റാച്ചുചെയ്ത {{targetLang}} രേഖയുടെ ശരിയും കൃത്യവുമായ വിവർത്തനമാണെന്നും യോഗ്യതയുള്ള വിവർത്തകൻ തയ്യാറാക്കിയതാണെന്നും സാക്ഷ്യപ്പെടുത്തുന്നു. ഈ സാക്ഷ്യപ്പെടുത്തൽ വിവർത്തനത്തിന്റെ കൃത്യതയുമായി മാത്രം ബന്ധപ്പെട്ടിരിക്കുന്നു. അതിനാൽ {{issueDateLongEn}} ന് റിയാദിൽ, സൗദി അറേബ്യയിൽ ഞങ്ങളുടെ ഒപ്പും ഔപചാരിക മുദ്രയും കൊണ്ട് ഈ വിവർത്തനം സാക്ഷ്യപ്പെടുത്തുന്നു.",
  },
  bengali: {
    heading: "সনদপত্র",
    body: "{{officeNameEn}} ঘোষণা করে যে সংযুক্ত {{sourceLang}} নথিটি সংযুক্ত {{targetLang}} নথির একটি সত্য এবং নির্ভুল অনুবাদ, এবং এই অনুবাদটি একজন যোগ্য অনুবাদক প্রস্তুত করেছেন। এই সনদপত্র শুধুমাত্র অনুবাদের নির্ভুলতার সাথে সম্পর্কিত এবং মূল নথির সত্যতা নিশ্চিত করে না। সুতরাং, আমরা {{issueDateLongEn}} তারিখে রিয়াদ, সৌদি আরবে আমাদের স্বাক্ষর ও সরকারি সীলমোহর দ্বারা এই অনুবাদ প্রত্যয়িত করছি।",
  },
  chinese: {
    heading: "认证",
    body: "{{officeNameEn}} 兹证明所附{{sourceLang}}文件为所附{{targetLang}}文件真实、准确的翻译，且该翻译由合格译员完成。本证明仅涉及翻译准确性，不对原件的真实性、合法性或内容承担责任。据此，我们于{{issueDateLongEn}}在沙特阿拉伯利雅得签署并加盖公章，认证本翻译。",
  },
  mandarin: {
    heading: "认证",
    body: "{{officeNameEn}} 兹证明所附{{sourceLang}}文件为所附{{targetLang}}文件真实、准确的翻译，且该翻译由合格译员完成。本证明仅涉及翻译准确性，不对原件的真实性、合法性或内容承担责任。据此，我们于{{issueDateLongEn}}在沙特阿拉伯利雅得签署并加盖公章，认证本翻译。",
  },
  portuguese: {
    heading: "Certificação",
    body: "{{officeNameEn}} certifica que o documento anexo em {{sourceLang}} é uma tradução fiel e exata do documento anexo em {{targetLang}}, preparada por um tradutor qualificado. Esta certificação refere-se exclusivamente à exatidão da tradução e não atesta a autenticidade ou o conteúdo do documento original. Assim, certificamos esta tradução com nossa assinatura e selo oficial em {{issueDateLongEn}}, em Riade, Reino da Arábia Saudita.",
  },
  italian: {
    heading: "Certificazione",
    body: "{{officeNameEn}} certifica che il documento allegato in {{sourceLang}} è una traduzione fedele e accurata del documento allegato in {{targetLang}}, redatta da un traduttore qualificato. La presente certificazione riguarda esclusivamente l'accuratezza della traduzione e non attesta l'autenticità o il contenuto del documento originale. Pertanto, certifichiamo la presente traduzione con firma e sigillo ufficiale in data {{issueDateLongEn}}, a Riyad, Regno dell'Arabia Saudita.",
  },
  russian: {
    heading: "Заверение",
    body: "{{officeNameEn}} удостоверяет, что прилагаемый документ на языке {{sourceLang}} является достоверным и точным переводом прилагаемого документа на языке {{targetLang}}, выполненным квалифицированным переводчиком. Настоящее заверение относится исключительно к точности перевода и не подтверждает подлинность или содержание оригинала. Таким образом, мы заверяем данный перевод своей подписью и официальной печатью {{issueDateLongEn}} в Эр-Рияде, Королевство Саудовская Аравия.",
  },
  turkish: {
    heading: "Tasdik",
    body: "{{officeNameEn}}, ekli {{sourceLang}} belgesinin ekli {{targetLang}} belgesinin doğru ve eksiksiz bir çevirisi olduğunu ve çevirinin nitelikli bir çevirmen tarafından hazırlandığını tasdik eder. Bu belge yalnızca çevirinin doğruluğu ile ilgilidir; asıl belgenin özgünlüğünü veya içeriğini teyit etmez. Bu nedenle, {{issueDateLongEn}} tarihinde Riyad, Suudi Arabistan'da imzamız ve resmî mührümüzle bu çeviriyi onaylıyoruz.",
  },
  japanese: {
    heading: "証明",
    body: "{{officeNameEn}}は、添付の{{sourceLang}}文書が添付の{{targetLang}}文書の正確な翻訳であり、資格を有する翻訳者によって作成されたことを証明します。本証明は翻訳の正確性のみに関するものであり、原本の真正性や内容を保証するものではありません。したがって、{{issueDateLongEn}}、サウジアラビア王国リヤドにおいて、署名および公印により本翻訳を証明します。",
  },
  korean: {
    heading: "증명",
    body: "{{officeNameEn}}은(는) 첨부된 {{sourceLang}} 문서가 첨부된 {{targetLang}} 문서의 정확한 번역이며 자격을 갖춘 번역가가 작성하였음을 증명합니다. 본 증명은 번역의 정확성에만 관한 것이며 원본의 진위나 내용을 보증하지 않습니다. 따라서 {{issueDateLongEn}} 리야드, 사우디아라비아 왕국에서 서명 및 공식 인장으로 본 번역을 증명합니다.",
  },
  indonesian: {
    heading: "Sertifikasi",
    body: "{{officeNameEn}} menyatakan bahwa dokumen terlampir dalam bahasa {{sourceLang}} merupakan terjemahan yang benar dan akurat dari dokumen terlampir dalam bahasa {{targetLang}}, dan disusun oleh penerjemah yang berkualifikasi. Sertifikasi ini hanya berkaitan dengan keakuratan terjemahan dan bukan pengakuan atas keaslian atau isi dokumen asli. Oleh karena itu, kami mensertifikasi terjemahan ini dengan tanda tangan dan stempel resmi pada {{issueDateLongEn}}, di Riyadh, Kerajaan Arab Saudi.",
  },
  dutch: {
    heading: "Certificering",
    body: "{{officeNameEn}} verklaart dat het bijgevoegde document in het {{sourceLang}} een getrouwe en nauwkeurige vertaling is van het bijgevoegde document in het {{targetLang}}, opgesteld door een gekwalificeerde vertaler. Deze certificering betreft uitsluitend de juistheid van de vertaling en bevestigt niet de echtheid of inhoud van het origineel. Dienovereenkomstig certificeren wij deze vertaling met onze handtekening en officieel zegel op {{issueDateLongEn}} te Riyad, Koninkrijk Saoedi-Arabië.",
  },
  polish: {
    heading: "Poświadczenie",
    body: "{{officeNameEn}} poświadcza, że załączony dokument w języku {{sourceLang}} stanowi wierne i dokładne tłumaczenie załączonego dokumentu w języku {{targetLang}}, sporządzone przez wykwalifikowanego tłumacza. Niniejsze poświadczenie dotyczy wyłącznie poprawności tłumaczenia i nie potwierdza autentyczności ani treści dokumentu źródłowego. W związku z tym poświadczamy to tłumaczenie podpisem i urzędową pieczęcią w dniu {{issueDateLongEn}} w Rijadzie, Królestwo Arabii Saudyjskiej.",
  },
  punjabi: {
    heading: "ਪ੍ਰਮਾਣਪੱਤਰ",
    body: "{{officeNameEn}} ਪ੍ਰਮਾਣਿਤ ਕਰਦਾ ਹੈ ਕਿ ਨੱਥੀ {{sourceLang}} ਦਸਤਾਵੇਜ਼ ਨੱਥੀ {{targetLang}} ਦਸਤਾਵੇਜ਼ ਦਾ ਸੱਚਾ ਅਤੇ ਸਹੀ ਅਨੁਵਾਦ ਹੈ, ਅਤੇ ਇਹ ਅਨੁਵਾਦ ਇੱਕ ਯੋਗ ਅਨੁਵਾਦਕ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਸੀ। ਇਹ ਪ੍ਰਮਾਣਪੱਤਰ ਸਿਰਫ਼ ਅਨੁਵਾਦ ਦੀ ਸਹੀਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ। ਅਸੀਂ {{issueDateLongEn}} ਨੂੰ ਰਿਆਧ, ਸਾਊਦੀ ਅਰਬ ਵਿੱਚ ਆਪਣੇ ਦਸਤਖਤ ਅਤੇ ਸਰਕਾਰੀ ਮੋਹਰ ਨਾਲ ਇਸ ਅਨੁਵਾਦ ਦੀ ਪ੍ਰਮਾਣਿਤਾ ਕਰਦੇ ਹਾਂ।",
  },
  kannada: {
    heading: "ಪ್ರಮಾಣೀಕರಣ",
    body: "{{officeNameEn}} ಲಗತ್ತಿಸಿದ {{sourceLang}} ದಾಖಲೆಯು ಲಗತ್ತಿಸಿದ {{targetLang}} ದಾಖಲೆಯ ನಿಜವಾದ ಮತ್ತು ನಿಖರವಾದ ಅನುವಾದವಾಗಿದೆ ಮತ್ತು ಇದನ್ನು ಅರ್ಹ ಅನುವಾದಕರು ಸಿದ್ಧಪಡಿಸಿದ್ದಾರೆ ಎಂದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತದೆ. ಈ ಪ್ರಮಾಣೀಕರಣವು ಅನುವಾದದ ನಿಖರತೆಗೆ ಮಾತ್ರ ಸಂಬಂಧಿಸಿದೆ. ಆದ್ದರಿಂದ {{issueDateLongEn}} ರಿಯಾಧ್, ಸೌದಿ ಅರೇಬಿಯಾದಲ್ಲಿ ನಮ್ಮ ಸಹಿ ಮತ್ತು ಅಧಿಕೃತ ಮುದ್ರೆಯಿಂದ ಈ ಅನುವಾದವನ್ನು ಪ್ರಮಾಣೀಕರಿಸುತ್ತೇವೆ.",
  },
  marathi: {
    heading: "प्रमाणपत्र",
    body: "{{officeNameEn}} असे प्रमाणित करते की संलग्न {{sourceLang}} दस्तऐवज हा संलग्न {{targetLang}} दस्तऐवजाचा सत्य आणि अचूक भाषांतर आहे, आणि हे भाषांतर पात्र अनुवादकाने तयार केले आहे. हे प्रमाणपत्र केवळ भाषांतराच्या अचूकतेसंबंधी आहे. त्यानुसार आम्ही {{issueDateLongEn}} रोजी रियाध, सौदी अरेबियामध्ये आमच्या स्वाक्षरी आणि अधिकृत शिक्क्याने हे भाषांतर प्रमाणित करतो.",
  },
};

const LANG_KEY_ALIASES: Record<string, string> = {
  chinese_simplified: "chinese",
  simplified_chinese: "chinese",
  mandarin: "chinese",
};

export function buildThirdLanguageLegalBlock(
  thirdLanguageName: string,
  vars: CertificatePlaceholderVars
): ThirdLegalBlock {
  const key = LANG_KEY_ALIASES[normLangKey(thirdLanguageName)] ?? normLangKey(thirdLanguageName);
  const tpl = THIRD_LEGAL_TEMPLATES[key];
  const v = compactVars(vars);

  if (tpl) {
    return {
      heading: tpl.heading,
      body: fillCertificateCopy(tpl.body, v),
      dir: tpl.dir,
      fontClass: tpl.fontClass,
    };
  }

  const fallbackEn =
    "{{officeNameEn}} hereby certifies that the accompanying {{sourceLang}} document is a true and accurate translation of the accompanying {{targetLang}} document, prepared by a qualified translator. This certification relates solely to translation accuracy and does not attest to the authenticity or content of the original. We certify this translation under our official seal on {{issueDateLongEn}} in Riyadh, Kingdom of Saudi Arabia.";

  return {
    heading: thirdLanguageName,
    body: fillCertificateCopy(fallbackEn, v),
    dir: "ltr",
  };
}

export function buildCompactEnglishLegal(
  legalEn1: string,
  legalEn2: string,
  legalEn3: string
): string {
  return [legalEn1, legalEn2, legalEn3].join(" ");
}

export function buildCompactArabicLegal(
  legalAr1: string,
  legalAr2: string,
  legalAr3: string
): string {
  return [legalAr1, legalAr2, legalAr3].join(" ");
}

const THIRD_VERIFY: Partial<Record<string, string>> = {
  hindi: "सत्यापन हेतु QR कोड स्कैन करें। यह कोड जारी होने के तीन माह बाद समाप्त हो जाता है।",
  french:
    "Pour vérifier cette attestation, veuillez scanner le code QR. Ce code est valable jusqu'à trois mois après la date d'émission.",
  spanish:
    "Para verificar, escanee el código QR. El código es válido hasta tres meses después de la fecha de emisión.",
  german:
    "Zur Überprüfung scannen Sie bitte den QR-Code. Dieser Code ist bis zu drei Monate nach Ausstellungsdatum gültig.",
  urdu: "تصدیق کے لیے QR کوڈ اسکین کریں۔ یہ کوڈ جاری ہونے کے تین ماہ بعد ختم ہو جاتا ہے۔",
  telugu:
    "ధృవీకరణ కోసం QR కోడ్‌ను స్కాన్ చేయండి. ఈ కోడ్ జారీ తేదీ నుండి మూడు నెలల వరకు చెల్లుబాటు అవుతుంది.",
};

export function buildThirdLanguageVerifyLine(thirdLanguageName: string, vars: CertificatePlaceholderVars): string | null {
  const key = LANG_KEY_ALIASES[normLangKey(thirdLanguageName)] ?? normLangKey(thirdLanguageName);
  const tpl = THIRD_VERIFY[key];
  if (!tpl) return null;
  return fillCertificateCopy(tpl, vars);
}