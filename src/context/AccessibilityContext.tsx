import React, { createContext, useContext, useState, useEffect } from "react";
import { accessibilityManager } from "../utils/accessibility";

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  activeFeatures: string[];
  toggleFeature: (feature: string) => void;
  isScreenReaderEnabled: boolean;
  isHighContrastEnabled: boolean;
  isTextToSpeechEnabled: boolean;
  isVoiceCommandsEnabled: boolean;
  isGestureControlEnabled: boolean;
  isKeyboardNavigationEnabled: boolean;
  isCursorAssistanceEnabled: boolean;
  isDyslexiaFontEnabled: boolean;
  isExtendedTimeEnabled: boolean;
  textToSpeech: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(16);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  const textToSpeech = (text: string) => {
    if (accessibilityManager && typeof accessibilityManager.speakText === "function") {
      accessibilityManager.speakText(text);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
  
      const speak = () => window.speechSynthesis.speak(utterance);
  
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speak;
      } else {
        speak();
      }
    }
  };

  const toggleFeature = (feature: string) => {
    setActiveFeatures((prev) => {
      const isActive = prev.includes(feature);
      if (isActive) {
        switch (feature) {
          case "screen-reader":
            accessibilityManager?.stopScreenReader?.();
            break;
          case "voice-commands":
            accessibilityManager?.stopVoiceCommands?.();
            break;
        }
        return prev.filter((f) => f !== feature);
      } else {
        switch (feature) {
          case "screen-reader":
            accessibilityManager?.startScreenReader?.("Screen reader enabled");
            break;
          case "voice-commands":
            accessibilityManager?.startVoiceCommands?.(() => {});
            break;
        }
        return [...prev, feature];
      }
    });
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`; // Fixed Syntax
  }, [fontSize]);

  useEffect(() => {
    if (activeFeatures.includes("high-contrast")) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (activeFeatures.includes("dyslexia-font")) {
      document.documentElement.classList.add("dyslexia-friendly");
    } else {
      document.documentElement.classList.remove("dyslexia-friendly");
    }
  }, [activeFeatures]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        activeFeatures,
        toggleFeature,
        isScreenReaderEnabled: activeFeatures.includes("screen-reader"),
        isHighContrastEnabled: activeFeatures.includes("high-contrast"),
        isTextToSpeechEnabled: activeFeatures.includes("text-to-speech"),
        isVoiceCommandsEnabled: activeFeatures.includes("voice-commands"),
        isGestureControlEnabled: activeFeatures.includes("gesture-control"),
        isKeyboardNavigationEnabled: activeFeatures.includes("keyboard-navigation"),
        isCursorAssistanceEnabled: activeFeatures.includes("cursor-assistance"),
        isDyslexiaFontEnabled: activeFeatures.includes("dyslexia-font"),
        isExtendedTimeEnabled: activeFeatures.includes("extended-time"),
        textToSpeech, // ✅ Pass textToSpeech here
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
