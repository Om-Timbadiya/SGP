import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Assessment } from '../../types';

interface CreateAssessmentModalProps {
  onClose: () => void;
  onCreate: (assessment: Assessment) => void;
}

export default function CreateAssessmentModal({ onClose, onCreate }: CreateAssessmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'MCQ',
    duration: '60',
    skillLevel: 'Intermediate',
    description: '',
    accessibilityFeatures: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssessment: Assessment = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      duration: `${formData.duration} mins`,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Upcoming',
      skillLevel: formData.skillLevel,
      description: formData.description,
      accessibilityFeatures: formData.accessibilityFeatures,
      totalStudents: 0,
      submissions: []
    };
    onCreate(newAssessment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create New Assessment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="MCQ">MCQ</option>
                <option value="Practical">Practical</option>
                <option value="Project">Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Level
            </label>
            <select
              value={formData.skillLevel}
              onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accessibility Features
            </label>
            <div className="space-y-2">
              {['Screen Reader', 'Voice Commands', 'Extended Time', 'High Contrast'].map((feature) => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.accessibilityFeatures.includes(feature)}
                    onChange={(e) => {
                      const features = e.target.checked
                        ? [...formData.accessibilityFeatures, feature]
                        : formData.accessibilityFeatures.filter(f => f !== feature);
                      setFormData({ ...formData, accessibilityFeatures: features });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}