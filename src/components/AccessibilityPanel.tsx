import React, { useState } from 'react';
import { 
  Eye, 
  Volume2, 
  Mic,  
  Clock, 
  Settings, 
  MousePointer2, 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    fontSize,
    setFontSize,
    activeFeatures,
    toggleFeature,
    isScreenReaderEnabled,
    isTextToSpeechEnabled,
    isCursorAssistanceEnabled,
  } = useAccessibility();

  const features = [
    {
      id: 'screen-reader',
      icon: Eye,
      label: 'Screen Reader',
      description: 'Enable screen reader support for visually impaired users',
      category: 'Visual',
      isEnabled: isScreenReaderEnabled,
    },
    {
      id: 'text-to-speech',
      icon: Volume2,
      label: 'Text to Speech',
      description: 'Convert text to spoken words',
      category: 'Visual',
      isEnabled: isTextToSpeechEnabled,
    },
    {
      id: 'cursor-assistance',
      icon: MousePointer2,
      label: 'Cursor Assistance',
      description: 'Enlarged cursor and click assistance',
      category: 'Motor',
      isEnabled: isCursorAssistanceEnabled,
    },
    {
      id: 'extended-time',
      icon: Clock,
      label: 'Extended Time',
      description: 'Additional time for assessments (PWD candidates)',
      category: 'General',
      isEnabled: activeFeatures.includes('extended-time'), // Assuming an existing feature flag.
    }
  ];

  const categories = ['Visual', 'Motor', 'Cognitive', 'General'];

  const handleReset = () => {
    setFontSize(16);
    activeFeatures.forEach(feature => toggleFeature(feature));
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Toggle Accessibility Panel"
      >
        <Settings className="h-6 w-6" />
      </button>

      {isExpanded && (
        <div className="mt-4 bg-white rounded-lg shadow-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Accessibility Features
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close Accessibility Panel"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Size
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{fontSize}px</span>
            </div>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {category} Accessibility
              </h4>
              <div className="space-y-3">
                {features
                  .filter((feature) => feature.category === category)
                  .map((feature) => {
                    const Icon = feature.icon;
                    const isActive = feature.isEnabled;

                    return (
                      <div key={feature.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{feature.label}</div>
                            <div className="text-sm text-gray-500">{feature.description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFeature(feature.id)}
                          className={`w-11 h-6 rounded-full transition-colors ${
                            isActive ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white transform transition-transform ${
                              isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
