import React from 'react';
import { Award, Download, ExternalLink } from 'lucide-react';

function Certificates() {
  const certificates = [
    {
      id: 1,
      title: 'JavaScript Advanced Developer',
      issueDate: '2024-03-15',
      score: 92,
      status: 'issued',
    },
    {
      id: 2,
      title: 'React Expert',
      issueDate: '2024-02-28',
      score: 88,
      status: 'issued',
    },
    {
      id: 3,
      title: 'Python Developer',
      status: 'pending',
      requirements: ['Complete Python Assessment', 'Score > 80%'],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <p className="mt-1 text-gray-600">
          View and manage your earned certificates and upcoming certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  cert.status === 'issued'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {cert.status === 'issued' ? 'Issued' : 'Pending'}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {cert.title}
            </h3>
            {cert.status === 'issued' ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Issued on: {cert.issueDate}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Score:
                  </span>
                  <span className="text-sm text-indigo-600 font-medium">
                    {cert.score}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ExternalLink className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Requirements:
                  </p>
                  {cert.requirements && cert.requirements.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {cert.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No requirements listed.</p>
                  )}
                </div>
                <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Start Assessment
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
