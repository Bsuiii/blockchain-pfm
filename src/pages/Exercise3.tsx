import { useState, useEffect } from 'react';
import { MessageSquare, Send, Download } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import GestionChaines from '../contracts/GestionChaines.json';

function Exercise3() {
  const [message, setMessage] = useState('');
  const [concatResult, setConcatResult] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

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

        const contractAddress = '0x663e513F4B28308487d19A2E9ab5fc45A9739257'; 
        const contractInstance = new web3.eth.Contract(GestionChaines.abi, contractAddress);

        setAccount(accounts[0]);
        setContract(contractInstance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const updateMessage = async () => {
    if (!contract || !account || !message.trim()) return;

    try {
      setUpdating(true);
      setError('');
      await contract.methods.setMessage(message).send({ from: account });
      setMessage('');
      // Auto-refresh message after update
      setTimeout(getMessage, 1000);
    } catch (err) {
      setError('Échec de la transaction: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getMessage = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError('');
      const res = await contract.methods.getMessage().call();
      setConcatResult(res);
    } catch (err) {
      setError('Échec de récupération du message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="String Management" 
      description="Gestion et manipulation des chaînes de caractères sur blockchain"
    >
      <div className="space-y-8">
        {/* Account Info */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Compte connecté</h3>
              <p className="text-white font-mono text-sm mt-1">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Non connecté'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${account ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          </div>
        </Card>

        {/* Message Input */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Nouveau Message</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Entrez votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={updating || !account}
              label="Message"
            />
            
            <Button
              onClick={updateMessage}
              loading={updating}
              disabled={!message.trim() || !account}
              className="w-full"
            >
              <Send className="w-4 h-4" />
              Mettre à jour le message
            </Button>
          </div>
        </Card>

        {/* Get Message */}
        <Card>
          <Button
            onClick={getMessage}
            loading={loading}
            disabled={!contract}
            className="w-full"
            variant="secondary"
          >
            <Download className="w-4 h-4" />
            Récupérer le message stocké
          </Button>
        </Card>

        {/* Error Display */}
        {error && (
          <Card>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          </Card>
        )}

        {/* Result Display */}
        {concatResult && (
          <Card gradient>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Message stocké</h3>
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xl font-medium text-white break-words">
                  "{concatResult}"
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default Exercise3;