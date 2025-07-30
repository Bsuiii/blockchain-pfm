import React, { useEffect, useState } from 'react';
import { Activity, Wifi, Hash, Clock } from 'lucide-react';
import { initializeWeb3 } from '../utils/web3';

const BlockchainInfo: React.FC = () => {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [blockDetails, setBlockDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const web3 = await initializeWeb3();
        const latestBlockNumber = await web3.eth.getBlockNumber();
        setBlockNumber(latestBlockNumber);
        const block = await web3.eth.getBlock(latestBlockNumber);
        setBlockDetails(block);
      } catch (err) {
        setError('Failed to fetch block info');
      } finally {
        setLoading(false);
      }
    };
    fetchBlockInfo();
  }, []);

  return (
    <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
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
      {loading ? (
        <div className="text-xs text-gray-400">Loading block info...</div>
      ) : error ? (
        <div className="text-xs text-red-400">{error}</div>
      ) : blockDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-300" />
            <span className="text-xs text-gray-300">Block Number:</span>
            <span className="text-xs text-white font-mono">{blockNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-300" />
            <span className="text-xs text-gray-300">Timestamp:</span>
            <span className="text-xs text-white font-mono">{blockDetails.timestamp ? new Date(Number(blockDetails.timestamp) * 1000).toLocaleString() : '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-300" />
            <span className="text-xs text-gray-300">Block Hash:</span>
            <span className="text-xs text-white font-mono truncate max-w-[120px]">{blockDetails.hash}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BlockchainInfo;