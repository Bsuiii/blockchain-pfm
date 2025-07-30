import React from 'react';
import { Activity, Wifi } from 'lucide-react';

const BlockchainInfo: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-white">
              Blockchain Ready
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Web3 dApp Interface
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
        <Activity className="w-4 h-4 text-purple-300" />
        <span className="text-xs text-purple-200 font-medium">Live</span>
      </div>
    </div>
  );
};

export default BlockchainInfo;