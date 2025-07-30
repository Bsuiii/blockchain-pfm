import { useState } from 'react';
import { Divide, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import ParityCheck from '../contracts/ParityCheck.json';

const contractAddress = '0x46b6b551a727F61AE7971c52DeDF60357bf2b63A';

function Exercise5() {
  const [number, setNumber] = useState('');
  const [isEven, setIsEven] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkParity = async () => {
    try {
      setLoading(true);
      setError('');
      setIsEven(null);

      if (number === '' || isNaN(number)) {
        throw new Error('Veuillez entrer un nombre valide');
      }

      await initializeWeb3();
      const web3 = getWeb3();
      const contract = new web3.eth.Contract(ParityCheck.abi, contractAddress);

      const result = await contract.methods.estPair(number).call();
      setIsEven(result);
    } catch (err) {
      console.error('Erreur lors du test de parité:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Parity Check" 
      description="Déterminez si un nombre est pair ou impair"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Divide className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Test de parité</h2>
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
              onClick={checkParity}
              loading={loading}
              disabled={!number}
              className="w-full"
              size="lg"
            >
              <Hash className="w-4 h-4" />
              {loading ? 'Vérification...' : 'Vérifier la parité'}
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
        {isEven !== null && !error && (
          <Card gradient>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {parseInt(number) % 2 === 0 ? '2' : '1'}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {number} est {isEven ? 'pair' : 'impair'}
              </h3>
              
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                isEven 
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                  : 'bg-orange-500/20 border border-orange-500/30 text-orange-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isEven ? 'bg-blue-400' : 'bg-orange-400'}`} />
                <span className="font-semibold text-lg">
                  {isEven ? 'Nombre Pair' : 'Nombre Impair'}
                </span>
              </div>

              <p className="text-gray-400 mt-4">
                {isEven 
                  ? `${number} est divisible par 2`
                  : `${number} n'est pas divisible par 2`
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default Exercise5;