import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Check, Volume2, RefreshCw, Globe } from "lucide-react";
import { useLanguage, Language } from "../context/LanguageContext";

interface VoiceGrievanceDictationProps {
  onTranscriptComplete: (transcript: string) => void;
  className?: string;
}

const LANG_CONFIG: Record<Language, { code: string; name: string; flag: string; hint: string }> = {
  en: {
    code: "en-IN",
    name: "English",
    flag: "🇮🇳",
    hint: "Speak clearly, e.g. 'Large pothole on Linking Road near Bandra station'",
  },
  mr: {
    code: "mr-IN",
    name: "मराठी",
    flag: "🇮🇳",
    hint: "स्पष्टपणे बोला, उदा. 'बांद्रा स्टेशनजवळ लिंकिंग रोडवर मोठा खड्डा'",
  },
  hi: {
    code: "hi-IN",
    name: "हिंदी",
    flag: "🇮🇳",
    hint: "स्पष्ट बोलें, जैसे 'बांद्रा स्टेशन के पास लिंकिंग रोड पर बड़ा गड्ढा'",
  },
};

export const VoiceGrievanceDictation: React.FC<VoiceGrievanceDictationProps> = ({
  onTranscriptComplete,
  className = "",
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const [voiceLang, setVoiceLang] = useState<Language>(language);
  const recognitionRef = useRef<any>(null);

  const createRecognition = useCallback((lang: Language) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = LANG_CONFIG[lang].code;

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          final += res[0].transcript + " ";
        } else {
          interim += res[0].transcript;
        }
      }
      setTranscript(final.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    return recognition;
  }, []);

  useEffect(() => {
    recognitionRef.current = createRecognition(voiceLang);
    return () => { recognitionRef.current?.stop(); };
  }, [voiceLang, createRecognition]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) onTranscriptComplete(transcript.trim());
    } else {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleApply = () => {
    const final = (transcript + " " + interimTranscript).trim();
    if (final) {
      onTranscriptComplete(final);
      if (isListening) recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript("");
      setInterimTranscript("");
    }
  };

  const switchLang = (lang: Language) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setTranscript("");
    setInterimTranscript("");
    setVoiceLang(lang);
  };

  if (!supported) return null;

  const displayText = transcript + (interimTranscript ? ` ${interimTranscript}` : "");
  const cfg = LANG_CONFIG[voiceLang];

  return (
    <div className={`rounded-2xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isListening ? "bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "bg-slate-600"
            }`}
          />
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Mic size={13} className={isListening ? "text-red-400" : "text-slate-500"} />
            {t.speakDescription}
          </span>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-0.5 rounded-lg">
          {(["en", "mr", "hi"] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => switchLang(lang)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                voiceLang === lang
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lang === "en" ? "EN" : lang === "mr" ? "मर" : "हि"}
            </button>
          ))}
        </div>
      </div>

      {/* Mic button area */}
      <div className="px-4 py-4 bg-slate-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {isListening ? (
              <MicOff size={20} className="text-white" />
            ) : (
              <Mic size={20} className="text-slate-300" />
            )}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isListening ? (
              <div>
                {/* Sound wave animation */}
                <div className="flex items-end gap-0.5 h-5 mb-1">
                  {[35, 65, 45, 85, 55, 95, 40, 75, 50, 90, 35, 70, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-red-400 font-semibold">
                  Listening in {cfg.name}… Speak now
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-300">{t.voiceHint}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{cfg.hint}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transcript display */}
        {(displayText || (!isListening && transcript)) && (
          <div className="mt-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <p className="text-xs text-slate-200 leading-relaxed">
              {transcript && <span className="text-white">{transcript}</span>}
              {interimTranscript && <span className="text-slate-400 italic"> {interimTranscript}</span>}
            </p>
            {!isListening && transcript && (
              <button
                type="button"
                onClick={handleApply}
                className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Check size={13} /> Insert into Description
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
