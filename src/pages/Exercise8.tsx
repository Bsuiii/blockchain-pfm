import { useState } from 'react';
import { Send, Wallet, ArrowUpCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import Payment from '../contracts/Payment.json';

const contractAddress = '0x67eE11662db2930537A7Fc9Cd651dA537429feDD';

function Exercise8() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendPayment = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error('Veuillez entrer un montant ETH valide');
      }

      await initializeWeb3();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Payment.abi, contractAddress);

      await contract.methods.receivePayment().send({
        from: accounts[0],
        value: web3.utils.toWei(amount.toString(), 'ether')
      });

      setSuccess(`Paiement de ${amount} ETH envoyé avec succès!`);
      setAmount('');
    } catch (err) {
      setError('Erreur lors de l\'envoi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async () => {
    try {
      setWithdrawing(true);
      setError('');
      setSuccess('');

      await initializeWeb3();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Payment.abi, contractAddress);

      await contract.methods.withdraw().send({ from: accounts[0] });

      setSuccess('Fonds retirés avec succès!');
    } catch (err) {
      setError('Erreur lors du retrait: ' + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Layout 
      title="Payment System" 
      description="Gestion des paiements avec msg.sender et msg.value"
    >
      <div className="space-y-8">
        {/* Send Payment */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Envoyer un paiement</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Montant en ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              label="Montant ETH"
            />
            
            <Button
              onClick={sendPayment}
              loading={loading}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full"
              size="lg"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Envoi en cours...' : 'Envoyer ETH'}
            </Button>
          </div>
        </Card>

        {/* Withdraw Funds */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Retirer les fonds</h2>
          </div>
          
          <p className="text-gray-300 mb-4">
            Retirez tous les fonds stockés dans le contrat (propriétaire uniquement)
          </p>
          
          <Button
            onClick={withdrawFunds}
            loading={withdrawing}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <ArrowUpCircle className="w-4 h-4" />
            {withdrawing ? 'Retrait en cours...' : 'Retirer les fonds'}
          </Button>
        </Card>

        {/* Success Message */}
        {success && (
          <Card>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-300 text-center font-medium">{success}</p>
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

        {/* Info Card */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-300" />
              Variables globales utilisées
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-semibold text-purple-300 mb-2">msg.sender</h4>
                <p className="text-gray-300 text-sm">
                  Adresse de l'expéditeur de la transaction
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-semibold text-pink-300 mb-2">msg.value</h4>
                <p className="text-gray-300 text-sm">
                  Montant en Wei envoyé avec la transaction
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Exercise8;