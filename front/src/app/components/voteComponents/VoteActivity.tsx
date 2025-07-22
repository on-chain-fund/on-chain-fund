import React from 'react';

export interface VoteActivityProps {
  milestoneId: string;
  votes: {
    yes: number;
    no: number;
    userVote?: 'yes' | 'no';
  };
  onVote: (vote: 'yes' | 'no') => void;
  votingOpen: boolean;
}

const VoteActivity: React.FC<VoteActivityProps> = ({ milestoneId, votes, onVote, votingOpen }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Voting Activity</h2>
    <div className="flex items-center space-x-6 mb-2">
      <div>
        <span className="font-bold text-green-600">{votes.yes}</span> Yes
      </div>
      <div>
        <span className="font-bold text-red-600">{votes.no}</span> No
      </div>
    </div>
    {votingOpen ? (
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded bg-green-500 text-white ${votes.userVote === 'yes' ? 'opacity-50' : ''}`}
          onClick={() => onVote('yes')}
          disabled={votes.userVote === 'yes'}
        >
          Vote Yes
        </button>
        <button
          className={`px-4 py-2 rounded bg-red-500 text-white ${votes.userVote === 'no' ? 'opacity-50' : ''}`}
          onClick={() => onVote('no')}
          disabled={votes.userVote === 'no'}
        >
          Vote No
        </button>
      </div>
    ) : (
      <div className="text-gray-500">Voting is closed for this milestone.</div>
    )}
    {votes.userVote && (
      <div className="mt-2 text-sm text-gray-700">
        You voted: <span className="font-semibold">{votes.userVote.toUpperCase()}</span>
      </div>
    )}
  </div>
);

export default VoteActivity;  