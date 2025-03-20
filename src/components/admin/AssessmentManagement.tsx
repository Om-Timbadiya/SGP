import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Assessment } from '../../types';
import AdminAssessmentCard from './AdminAssessmentCard';
import CreateAssessmentModal from './CreateAssessmentModal';

interface AssessmentManagementProps {
  assessments: Assessment[];
  onCreateAssessment: (assessment: Assessment) => void;
}

export default function AssessmentManagement({ assessments, onCreateAssessment }: AssessmentManagementProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Assessment Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Create Assessment
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="MCQ">MCQ</option>
          <option value="Practical">Practical</option>
          <option value="Project">Project</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <AdminAssessmentCard
            key={assessment.id}
            assessment={assessment}
          />
        ))}
      </div>

      {showCreateModal && (
        <CreateAssessmentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newAssessment) => {
            onCreateAssessment(newAssessment);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}