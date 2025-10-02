import React from 'react';
import { LearningModule } from '../types';
import { SafeText } from '../utils/markdown';

interface ModuleCardV2Props {
  module: LearningModule;
  onSelect: (module: LearningModule) => void;
}

const ModuleCardV2: React.FC<ModuleCardV2Props> = ({ module, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <span className="text-xs font-semibold bg-brand-blue-light text-brand-blue py-1 px-2 rounded-full">
          <SafeText value={module.category} />
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-3">
          <SafeText value={module.title} />
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          <SafeText value={module.summary} />
        </p>
      </div>
      <button
        onClick={() => onSelect(module)}
        className="mt-4 self-start bg-brand-blue text-white text-sm font-semibold px-3 py-2 rounded hover:bg-blue-700"
      >
        Open
      </button>
    </div>
  );
};

export default ModuleCardV2;
