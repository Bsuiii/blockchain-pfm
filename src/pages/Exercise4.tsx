import { useState } from 'react';
import { CheckCircle, XCircle, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import PositiveCheck from '../contracts/PositiveCheck.json';

function Exercise4() {
  const [number, setNumber] = useState('');
  const [isPositive, setIsPositive] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const contractAddress = '0xAf68a89238bFC8686088A771Beb8e47A2387D96a';

  const checkPositivity = async () => {
    try {
      setLoading(true);
      setError('');
      setIsPositive(null);

      if (!number || isNaN(number)) {
        throw new Error('Veuillez entrer un nombre valide');
      }

      await initializeWeb3();
      const web3 = getWeb3();

      const contract = new web3.eth.Contract(
        PositiveCheck.abi,
        contractAddress
      );

      const result = await contract.methods.estPositif(number).call();
      setIsPositive(result);
    } catch (err) {
      setError(err.message);
      setIsPositive(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Positive Number Check" 
      description="Vérifiez si un nombre est positif via smart contract"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Test de positivité</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Entrez un nombre"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              disabled={loading}
              label="Nombre à tester"
            />
            
            <Button
              onClick={checkPositivity}
              loading={loading}
              disabled={!number}
              className="w-full"
              size="lg"
            >
              Vérifier la positivité
            </Button>
          </div>
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
        {isPositive !== null && (
          <Card gradient>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {isPositive ? (
                  <CheckCircle className="w-16 h-16 text-green-400" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-400" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {number} est {isPositive ? 'positif' : 'négatif ou nul'}
              </h3>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isPositive 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                {isPositive ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {isPositive ? 'Positif' : 'Négatif/Nul'}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default Exercise4;