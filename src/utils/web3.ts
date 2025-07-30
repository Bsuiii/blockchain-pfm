import Web3 from 'web3';

let web3Instance: Web3 | null = null;

export const initializeWeb3 = async (): Promise<Web3> => {
  if (web3Instance) {
    return web3Instance;
  }

  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3Instance = new Web3(window.ethereum);
      return web3Instance;
    } catch (error) {
      if (error.code === 4001 || error.message?.includes('User rejected')) {
        throw new Error('Wallet connection was rejected. Please accept the connection request to continue.');
      }
      console.error('Wallet connection error:', error);
      throw new Error('Failed to connect to wallet. Please try again.');
    }
  }
  
  // Fallback to Ganache
  try {
    web3Instance = new Web3('http://localhost:8545');
    return web3Instance;
  } catch (error) {
    throw new Error('Unable to connect to Ethereum network');
  }
};

export const getWeb3 = (): Web3 => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Call initializeWeb3() first.');
  }
  return web3Instance;
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}