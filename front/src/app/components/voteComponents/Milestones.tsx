import React from 'react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'voting';
}

interface MilestonesProps {
  milestones: Milestone[];
  currentMilestoneId?: string;
}

const Milestones: React.FC<MilestonesProps> = ({ milestones, currentMilestoneId }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Milestones</h2>
    <ul className="space-y-3">
      {milestones.map(milestone => (
        <li
          key={milestone.id}
          className={`p-4 rounded border ${milestone.id === currentMilestoneId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{milestone.title}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
              milestone.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
              milestone.status === 'voting' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {milestone.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default Milestones; 