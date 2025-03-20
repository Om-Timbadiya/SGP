import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [65, 72, 78, 75, 82, 85],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const assessmentTypeData = {
    labels: ['MCQ', 'Practical', 'Descriptive', 'Viva'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
      },
    ],
  };

  const accessibilityUsageData = {
    labels: ['Screen Reader', 'Voice Input', 'High Contrast', 'Extended Time'],
    datasets: [
      {
        label: 'Usage Count',
        data: [120, 80, 60, 40],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Assessments',
            value: '248',
            change: '+12%',
            icon: TrendingUp,
          },
          {
            title: 'Active Users',
            value: '1,423',
            change: '+5%',
            icon: Users,
          },
          {
            title: 'Completion Rate',
            value: '92%',
            change: '+3%',
            icon: Award,
          },
          {
            title: 'Avg. Duration',
            value: '45m',
            change: '-2m',
            icon: Clock,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Trend
          </h3>
          <Line
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assessment Types
          </h3>
          <div className="h-64">
            <Doughnut
              data={assessmentTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Accessibility Feature Usage
        </h3>
        <Bar
          data={accessibilityUsageData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
}