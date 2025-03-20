import React from 'react';
import { Brain, Clock, Award, TrendingUp, BookOpen, Target, Users, Star } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import type { Assessment } from '../../types';
import AssessmentCard from '../AssessmentCard';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentDashboardProps {
  assessments: Assessment[];
}

export default function StudentDashboard({ assessments }: StudentDashboardProps) {
  const stats = [
    {
      label: 'Overall Progress',
      value: '78%',
      icon: TrendingUp,
      trend: '+8% this month',
      color: 'text-green-600',
    },
    {
      label: 'Skill Mastery',
      value: '4/6',
      icon: Brain,
      trend: '2 in progress',
      color: 'text-blue-600',
    },
    {
      label: 'Study Streak',
      value: '12 days',
      icon: Target,
      trend: 'Personal best!',
      color: 'text-purple-600',
    },
    {
      label: 'Global Rank',
      value: '#126',
      icon: Users,
      trend: 'Top 5%',
      color: 'text-orange-600',
    },
  ];

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Assessment Scores',
        data: [75, 82, 78, 85, 88, 92],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Class Score',
        data: [70, 75, 72, 78, 82, 85],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const skillDistributionData = {
    labels: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'Data Structures'],
    datasets: [
      {
        data: [85, 78, 65, 72, 88, 70],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours Spent',
        data: [2.5, 3.2, 4.0, 2.8, 3.5, 1.5, 2.0],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  const recentAchievements = [
    { id: 1, title: 'Perfect Score', description: 'Achieved 100% in JavaScript Basics', icon: Star },
    { id: 2, title: '10-Day Streak', description: 'Consistent learning for 10 days', icon: Target },
    { id: 3, title: 'Top Performer', description: 'Ranked #1 in React Assessment', icon: Award },
  ];

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.color}`}>
                          {stat.trend}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Trend</h2>
          <Line data={performanceData} options={lineOptions} />
        </div>

        {/* Skill Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Skill Distribution</h2>
          <div className="h-[300px]">
            <Doughnut data={skillDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Activity</h2>
          <Bar data={weeklyActivityData} options={barOptions} />
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg"
                >
                  <Icon className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Assessments Preview */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Upcoming Assessments
          </h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
            View all assessments →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments
            .filter(a => a.status === 'Upcoming')
            .slice(0, 3)
            .map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                isAdmin={false}
                onStart={() => {/* Handle start assessment */}}
              />
            ))}
        </div>
      </div>
    </div>
  );
}