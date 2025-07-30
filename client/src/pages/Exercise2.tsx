import { useState } from 'react';
import { ArrowRightLeft, Coins } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import CurrencyConverter from '../contracts/CurrencyConverter.json';

const contractAddress = "0xc655cf8022dCA828C5Ef769df45d62B99d5F4226";

export default function Exercise2() {
  const [etherAmount, setEtherAmount] = useState('');
  const [weiAmount, setWeiAmount] = useState('');
  const [conversionDirection, setConversionDirection] = useState('etherToWei');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const conversionOptions = [
    { value: 'etherToWei', label: 'Ether → Wei' },
    { value: 'weiToEther', label: 'Wei → Ether' }
  ];

  const convert = async () => {
    try {
      setLoading(true);
      setError('');
      setResult('');

      await initializeWeb3();
      const web3 = getWeb3();
      const contract = new web3.eth.Contract(CurrencyConverter.abi, contractAddress);

      if (conversionDirection === 'etherToWei') {
        if (!etherAmount || isNaN(etherAmount)) {
          throw new Error('Veuillez entrer un montant Ether valide');
        }
        const wei = await contract.methods.etherEnWei(etherAmount).call();
        setResult(`${wei} wei`);
        setWeiAmount(wei);
      } else {
        if (!weiAmount || isNaN(weiAmount)) {
          throw new Error('Veuillez entrer un montant Wei valide');
        }
        const ether = await contract.methods.weiEnEther(weiAmount).call();
        setResult(`${ether} ether`);
        setEtherAmount(ether);
      }
    } catch (err) {
      console.error('Erreur de conversion:', err);
      setError(err.message);
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Currency Converter" 
      description="Convertisseur Ether/Wei utilisant un smart contract"
    >
      <div className="space-y-8">
        {/* Conversion Controls */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Convertisseur</h2>
          </div>
          
          <div className="space-y-6">
            <Select
              options={conversionOptions}
              value={conversionDirection}
              onChange={(value) => {
                setConversionDirection(value);
                setResult('');
              }}
              label="Direction de conversion"
            />

            {conversionDirection === 'etherToWei' ? (
              <Input
                type="number"
                placeholder="Montant en Ether"
                value={etherAmount}
                onChange={(e) => setEtherAmount(e.target.value)}
                disabled={loading}
                label="Montant Ether"
              />
            ) : (
              <Input
                type="number"
                placeholder="Montant en Wei"
                value={weiAmount}
                onChange={(e) => setWeiAmount(e.target.value)}
                disabled={loading}
                label="Montant Wei"
              />
            )}
          </div>
        </Card>

        {/* Convert Button */}
        <Button
          onClick={convert}
          loading={loading}
          className="w-full"
          size="lg"
        >
          <ArrowRightLeft className="w-5 h-5" />
          {loading ? 'Conversion en cours...' : 'Convertir'}
        </Button>

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
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Résultat de la conversion</h3>
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {result}
                </div>
                <p className="text-gray-400 text-sm">
                  {conversionDirection === 'etherToWei' 
                    ? `${etherAmount} ETH convertis en Wei`
                    : `${weiAmount} Wei convertis en ETH`
                  }
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}