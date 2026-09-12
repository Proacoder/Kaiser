import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Volume2, Check, AlertCircle, RefreshCw } from "lucide-react";

interface VoiceGrievanceDictationProps {
  onTranscriptComplete: (transcript: string) => void;
  className?: string;
}

export const VoiceGrievanceDictation: React.FC<VoiceGrievanceDictationProps> = ({
  onTranscriptComplete,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // English (India), also catches common Mumbai terms

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(currentTranscript.trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice dictation is not supported in this browser. Please type your description manually.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleApply = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript.trim());
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  if (!supported) return null;

  return (
    <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? "bg-red-600 animate-ping" : "bg-slate-400"}`} />
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-red-600" />
            <span>AI Voice Dictation & Audio Input</span>
          </span>
        </div>

        <button
          type="button"
          onClick={toggleListening}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isListening
              ? "bg-red-600 text-white animate-pulse shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop Dictation</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-red-400" />
              <span>Speak Grievance</span>
            </>
          )}
        </button>
      </div>

      {isListening && (
        <div className="p-3 bg-white rounded-xl border border-red-200 space-y-2 animate-in fade-in">
          {/* Animated sound wave bars */}
          <div className="flex items-center justify-center gap-1 h-6 py-1">
            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((height, idx) => (
              <span
                key={idx}
                className="w-1 bg-red-600 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${idx * 0.1}s`,
                }}
              />
            ))}
          </div>

          <p className="text-xs text-slate-700 italic font-medium text-center">
            {transcript || "Listening... Speak clearly (e.g. 'Large pothole on Linking Road near Bandra station')."}
          </p>
        </div>
      )}

      {!isListening && transcript && (
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
          <p className="text-xs text-slate-800 font-medium">
            "{transcript}"
          </p>
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert Voice Note into Description</span>
          </button>
        </div>
      )}
    </div>
  );
};
