import React, { useState } from 'react';
import { assessmentBlockchain } from '../utils/blockchain';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Settings,
  Eye,
  Brain,
  AlertCircle
} from 'lucide-react';

interface AssessmentForm {
  title: string;
  type: string;
  mode: string;
  duration: number;
  difficulty: string;
  accessibility: string[];
  description: string;
}

interface CreateAssessmentProps {
  onClose: () => void;
  onCreate: (assessment: any) => void;
}

export default function CreateAssessment({ onClose, onCreate }: CreateAssessmentProps) {
  const [form, setForm] = useState<AssessmentForm>({
    title: '',
    type: 'mcq',
    mode: 'online',
    duration: 60,
    difficulty: 'medium',
    accessibility: [],
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssessment = {
      id: Date.now(),
      ...form,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Upcoming',
    };

    // Add to blockchain
    assessmentBlockchain.addBlock({
      assessmentId: newAssessment.id,
      timestamp: Date.now(),
      data: newAssessment,
    });

    onCreate(newAssessment);
    onClose();
  };

  const assessmentTypes = [
    { id: 'mcq', label: 'Multiple Choice', icon: BookOpen },
    { id: 'practical', label: 'Practical', icon: Brain },
    { id: 'descriptive', label: 'Descriptive', icon: Eye },
    { id: 'viva', label: 'Viva Voce', icon: Users },
  ];

  const accessibilityOptions = [
    'Screen Reader Compatible',
    'Voice Input Enabled',
    'Extended Time',
    'High Contrast Mode',
    'Text-to-Speech',
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Assessment</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields remain the same */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assessment Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Type
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {assessmentTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setForm({ ...form, type: id })}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                  form.type === id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-500'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mode
            </label>
            <select
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="blended">Blended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: +e.target.value })}
              min="15"
              step="15"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setForm({ ...form, difficulty: level })}
                className={`flex-1 py-2 px-4 text-sm font-medium capitalize ${
                  form.difficulty === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${
                  level === 'easy'
                    ? 'rounded-l-md'
                    : level === 'hard'
                    ? 'rounded-r-md'
                    : ''
                } border`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accessibility Options
          </label>
          <div className="space-y-2">
            {accessibilityOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  checked={form.accessibility.includes(option)}
                  onChange={(e) => {
                    const newAccessibility = e.target.checked
                      ? [...form.accessibility, option]
                      : form.accessibility.filter((a) => a !== option);
                    setForm({ ...form, accessibility: newAccessibility });
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Assessment
          </button>
        </div>
      </form>
    </div>
  );
}