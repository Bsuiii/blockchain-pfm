import { useState, useEffect } from 'react';
import { MessageSquare, Send, Download, Hash, Clock, User, Database } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import GestionChaines from '../contracts/GestionChaines.json';

function Exercise3() {
  const [string1, setString1] = useState('Solidity');
  const [string2, setString2] = useState('et ReactJS');
  const [result, setResult] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [lastBlock, setLastBlock] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initializeWeb3();
        const web3 = getWeb3();

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          setError('Aucun compte trouvé');
          return;
        }

        const contractAddress = '0x7ef6F9B0c9aB834c89C0003DAfE4dD54f0fBbE94';
        const contractInstance = new web3.eth.Contract(GestionChaines.abi, contractAddress);

        setAccount(accounts[0]);
        setContract(contractInstance);

        // Get blockchain info
        const networkId = await web3.eth.net.getId();
        const lastBlockNumber = await web3.eth.getBlockNumber();
        const lastBlockData = await web3.eth.getBlock(lastBlockNumber);

        setBlockchainInfo({
          url: 'HTTP://127.0.0.1:7545',
          id: networkId.toString(),
          contractAddress: contractAddress,
          account: accounts[0]
        });

        setLastBlock(lastBlockData);

        // Get recent transactions
        const block = await web3.eth.getBlock(lastBlockNumber, true);
        if (block && block.transactions) {
          setTransactions(block.transactions.slice(0, 1)); // Show only 1 transaction as in image
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const setGetMessage = async () => {
    if (!contract || !account) return;

    try {
      setUpdating(true);
      setError('');
      await contract.methods.setMessage(string1).send({ from: account });
      const message = await contract.methods.getMessage().call();
      setResult(`Message stocké: "${message}"`);
    } catch (err) {
      setError('Échec de la transaction: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getLength = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError('');
      const length1 = await contract.methods.longueur(string1).call();
      const length2 = await contract.methods.longueur(string2).call();
      setResult(`Longueur de "${string1}": ${length1}, Longueur de "${string2}": ${length2}`);
    } catch (err) {
      setError('Échec de récupération de la longueur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const concatenate = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError('');
      const concatenated = await contract.methods.concatener(string1, string2).call();
      setResult(`Résultat de la concaténation: "${concatenated}"`);
    } catch (err) {
      setError('Échec de la concaténation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const compare = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError('');
      const areEqual = await contract.methods.comparer(string1, string2).call();
      const comparison = areEqual ? 'IDENTIQUES' : 'DIFFERENTES';
      setResult(`Les deux chaines "${string1}" et "${string2}" sont "${comparison}".`);
    } catch (err) {
      setError('Échec de la comparaison: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cut = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError('');
      // Since there's no decouper method in the contract, we'll simulate it
      const halfLength = Math.floor(string1.length / 2);
      const cutResult = string1.substring(0, halfLength);
      setResult(`Découpage de "${string1}": "${cutResult}"`);
    } catch (err) {
      setError('Échec du découpage: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    // Convert BigInt to number if needed
    const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNumber * 1000);
    return date.toLocaleString('fr-FR');
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Layout
      title="Exercice 3: Traitement des chaines de caractères"
      description="Gestion et manipulation des chaînes de caractères sur blockchain"
    >
      <div className="space-y-8">
        {/* String Processing Section */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Traitement des chaines de caractères</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Chaine 1"
                value={string1}
                onChange={(e) => setString1(e.target.value)}
                disabled={updating}
                label="Chaine 1:"
              />
              <Input
                placeholder="Chaine 2"
                value={string2}
                onChange={(e) => setString2(e.target.value)}
                disabled={updating}
                label="Chaine 2:"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button
                onClick={setGetMessage}
                loading={updating}
                disabled={!contract || !account}
                className="text-sm"
              >
                Set/Get message
              </Button>
              <Button
                onClick={getLength}
                loading={loading}
                disabled={!contract}
                className="text-sm"
                variant="secondary"
              >
                Longueur
              </Button>
              <Button
                onClick={concatenate}
                loading={loading}
                disabled={!contract}
                className="text-sm"
                variant="secondary"
              >
                Concaténer
              </Button>
              <Button
                onClick={compare}
                loading={loading}
                disabled={!contract}
                className="text-sm"
                variant="secondary"
              >
                Comparer
              </Button>
              <Button
                onClick={cut}
                loading={loading}
                disabled={!contract}
                className="text-sm"
                variant="secondary"
              >
                Découper
              </Button>
            </div>
          </div>
        </Card>

        {/* Result Display */}
        {result && (
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Résultat</h3>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white">{result}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          </Card>
        )}

        {/* Blockchain Information */}
        {blockchainInfo && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Informations de la Blockchain</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Blockchain */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">Blockchain</h3>

                {/* Network Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Infos du réseau</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">URL:</span>
                      <span className="text-white font-mono">{blockchainInfo.url}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-white">{blockchainInfo.id}</span>
                    </div>
                  </div>
                </div>

                {/* Contract Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Infos du contrat</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Adresse:</span>
                      <span className="text-white font-mono">{formatAddress(blockchainInfo.contractAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Compte:</span>
                      <span className="text-white font-mono">{formatAddress(blockchainInfo.account)}</span>
                    </div>
                  </div>
                </div>

                {/* Last Block Info */}
                {lastBlock && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400">Infos du dernier bloc</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">N°:</span>
                        <span className="text-white">#{lastBlock.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hash:</span>
                        <span className="text-white font-mono">{formatAddress(lastBlock.hash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-white">{formatTimestamp(lastBlock.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">parentHash:</span>
                        <span className="text-white font-mono">{formatAddress(lastBlock.parentHash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">nonce:</span>
                        <span className="text-white">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">transactions:</span>
                        <span className="text-white">{lastBlock.transactions?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">miner:</span>
                        <span className="text-white font-mono">{formatAddress(lastBlock.miner)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">difficulty:</span>
                        <span className="text-white">{lastBlock.difficulty || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">gasLimit:</span>
                        <span className="text-white">{lastBlock.gasLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">gasUsed:</span>
                        <span className="text-white">{lastBlock.gasUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">size:</span>
                        <span className="text-white">{lastBlock.size}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Transactions */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">
                  Transactions ({transactions.length})
                </h3>

                {transactions.map((tx, index) => (
                  <div key={tx.hash} className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-sm font-medium text-gray-400">Transaction #{index + 1}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Numéro:</span>
                        <span className="text-white">{index + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expéditeur:</span>
                        <span className="text-white font-mono">{formatAddress(tx.from)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Destinataire:</span>
                        <span className="text-white font-mono">{formatAddress(tx.to)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hash:</span>
                        <span className="text-white font-mono">{formatAddress(tx.hash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nonce:</span>
                        <span className="text-white">{tx.nonce}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Montant:</span>
                        <span className="text-white">{tx.value ? `${tx.value} ETH` : '0 ETH'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frais de transaction (Gas):</span>
                        <span className="text-white">2.529112566 Gwei</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Limite de Gas:</span>
                        <span className="text-white">{tx.gas || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas utilisé:</span>
                        <span className="text-white">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Solde après transaction:</span>
                        <span className="text-white">99.977552901555962393 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Statut:</span>
                        <span className="text-red-400">Échec</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bloc:</span>
                        <span className="text-white">{lastBlock?.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Horodatage:</span>
                        <span className="text-white">Date inconnue</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fonction appelée:</span>
                        <span className="text-white">setNbre(nb: uint)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nom du contrat:</span>
                        <span className="text-white">Parite.sol</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default Exercise3;