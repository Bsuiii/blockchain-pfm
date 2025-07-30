import Web3 from 'web3';

let web3Instance: Web3 | null = null;

export const initializeWeb3 = async (): Promise<Web3> => {
  if (web3Instance) {
    return web3Instance;
  }

  // Connect to local Ganache
  try {
    web3Instance = new Web3('http://localhost:8545');
    return web3Instance;
  } catch (error) {
    throw new Error('Unable to connect to Ethereum network. Please ensure Ganache is running on localhost:8545');
  }
};

export const connectToMetaMask = async (): Promise<Web3> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please connect your MetaMask wallet.');
    }

    // Create Web3 instance with MetaMask provider
    web3Instance = new Web3(window.ethereum);

    // Get the connected account
    const account = accounts[0];
    console.log('Connected to MetaMask with account:', account);

    return web3Instance;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MetaMask: ${error.message}`);
    }
    throw new Error('Failed to connect to MetaMask');
  }
};

export const getWeb3 = (): Web3 => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Please call initializeWeb3() or connectToMetaMask() first.');
  }
  return web3Instance;
};

export const getConnectedAccount = async (): Promise<string | null> => {
  if (!web3Instance) {
    return null;
  }

  try {
    const accounts = await web3Instance.eth.getAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting connected account:', error);
    return null;
  }
};

export const isMetaMaskInstalled = (): boolean => {
  return typeof window.ethereum !== 'undefined';
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}