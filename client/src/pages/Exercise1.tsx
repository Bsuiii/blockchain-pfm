import { useState } from 'react';
import { Calculator, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { getWeb3 } from '../utils/web3';
import { initializeWeb3 } from '../utils/web3';
import Calculations from '../contracts/Calculations.json';

export default function Exercise1() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x149C37d76AB4Db36BF83E1aca495CEA453839aE2";

  const calculateSum = async (isPure) => {
    try {
      setLoading(true);
      setError('');

      const web3 = await initializeWeb3();
      const contract = new web3.eth.Contract(Calculations.abi, contractAddress);

      let res;
      if (isPure) {
        res = await contract.methods
          .addition2(parseInt(num1 || 0), parseInt(num2 || 0))
          .call();
      } else {
        res = await contract.methods.addition1().call();
      }

      setResult(res.toString());
    } catch (err) {
      setError(err.message || 'An error occurred while performing the calculation.');
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Simple Calculations"
      description="Calculez la somme de deux nombres via smart contract Ethereum"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Paramètres de calcul</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              type="number"
              placeholder="Premier nombre"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              label="Nombre 1"
            />
            <Input
              type="number"
              placeholder="Deuxième nombre"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              label="Nombre 2"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Button
            onClick={() => calculateSum(false)}
            loading={loading}
            className="w-full"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Calculer Somme (État)
          </Button>

          <Button
            onClick={() => calculateSum(true)}
            loading={loading}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Calculer Somme (Paramètres)
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          </Card>
        )}

        {/* Result Display */}
        {result && (
          <Card gradient>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Résultat</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {result}
              </div>
              <p className="text-gray-400 mt-2">
                {num1} + {num2} = {result}
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}