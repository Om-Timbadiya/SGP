import React from 'react';
import { Wifi, WifiOff, GitBranch } from 'lucide-react';

interface AssessmentModeSelectorProps {
  mode: 'online' | 'offline' | 'blended';
  onChange: (mode: 'online' | 'offline' | 'blended') => void;
}

export default function AssessmentModeSelector({
  mode,
  onChange,
}: AssessmentModeSelectorProps) {
  const modes = [
    {
      id: 'online',
      icon: Wifi,
      label: 'Online Mode',
      description: 'Real-time assessment with internet connection',
    },
    {
      id: 'offline',
      icon: WifiOff,
      label: 'Offline Mode',
      description: 'Download and complete assessment without internet',
    },
    {
      id: 'blended',
      icon: GitBranch,
      label: 'Blended Mode',
      description: 'Combination of online and offline assessment',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Assessment Mode</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {modes.map((item) => {
          const Icon = item.icon;
          const isSelected = mode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as 'online' | 'offline' | 'blended')}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <Icon
                className={`h-6 w-6 mb-2 ${
                  isSelected ? 'text-indigo-500' : 'text-gray-400'
                }`}
              />
              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              
              {item.id === 'offline' && (
                <div className="mt-2 text-xs">
                  <p className="font-medium text-gray-700">Features available offline:</p>
                  <ul className="list-disc list-inside text-gray-500">
                    <li>Basic assessments</li>
                    <li>Screen reader</li>
                    <li>Extended time</li>
                  </ul>
                </div>
              )}
              
              {item.id === 'blended' && (
                <div className="mt-2 text-xs">
                  <p className="font-medium text-gray-700">Blended features:</p>
                  <ul className="list-disc list-inside text-gray-500">
                    <li>Sync when online</li>
                    <li>Partial submissions</li>
                    <li>Progress tracking</li>
                  </ul>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}