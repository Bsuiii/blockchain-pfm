import { useState, useEffect } from 'react';
import { Send, Wallet, ArrowUpCircle, User, Coins } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import Payment from '../contracts/Payment.json';

const contractAddress = '0x985a6Eb1A53124e2Fec0c35c455F373DDfC5cA7E';

interface TransactionDetails {
  sender: string;
  amountWei: string;
  amountEth: string;
  transactionHash: string;
  blockNumber: string | number;
}

function Exercise8() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [contractBalance, setContractBalance] = useState('0');

  const getContractBalance = async () => {
    try {
      await initializeWeb3();
      const web3 = getWeb3();
      const balance = await web3.eth.getBalance(contractAddress);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');
      setContractBalance(balanceInEth);
      return balanceInEth;
    } catch (err) {
      console.error('Erreur lors de la récupération du solde:', err);
      return '0';
    }
  };

  // Charger le solde initial au montage du composant
  useEffect(() => {
    getContractBalance();
  }, []);

  const sendPayment = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setTransactionDetails(null);

      if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Veuillez entrer un montant ETH valide');
      }

      await initializeWeb3();
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Payment.abi, contractAddress);

      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

      const result = await contract.methods.receivePayment().send({
        from: accounts[0],
        value: amountInWei
      });

      // Récupérer les détails de la transaction
      const transactionReceipt = await web3.eth.getTransactionReceipt(result.transactionHash);
      const transaction = await web3.eth.getTransaction(result.transactionHash);

      // Stocker les détails de la transaction
      setTransactionDetails({
        sender: accounts[0],
        amountWei: amountInWei,
        amountEth: amount,
        transactionHash: result.transactionHash,
        blockNumber: transactionReceipt.blockNumber || transaction.blockNumber || 'En cours...'
      });

      setSuccess(`Paiement de ${amount} ETH envoyé avec succès!`);
      setAmount('');
    } catch (err: any) {
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

      // Récupérer le nouveau solde après le retrait
      const newBalance = await getContractBalance();
      setSuccess(`Fonds retirés avec succès! Nouveau solde du contrat: ${newBalance} ETH`);
    } catch (err: any) {
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

        {/* Contract Balance & Withdraw */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Solde du contrat & Retrait</h2>
          </div>

          <div className="space-y-4">
            {/* Current Balance Display */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Solde actuel du contrat</p>
                  <p className="text-lg font-bold text-white">{contractBalance} ETH</p>
                </div>
                <Button
                  onClick={getContractBalance}
                  variant="secondary"
                  size="sm"
                >
                  Actualiser
                </Button>
              </div>
            </div>

            <p className="text-gray-300 text-sm">
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
          </div>
        </Card>

        {/* Success Message */}
        {success && (
          <Card>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-300 text-center font-medium mb-4">{success}</p>

              {/* Transaction Details */}
              {transactionDetails && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-white font-semibold text-center mb-3">Détails de la transaction</h4>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <User className="w-4 h-4 text-purple-300" />
                      <div>
                        <p className="text-xs text-white">Expéditeur (msg.sender)</p>
                        <p className="text-sm text-white font-mono break-all">{transactionDetails.sender}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Coins className="w-4 h-4 text-pink-300" />
                      <div>
                        <p className="text-xs text-white">Montant (msg.value)</p>
                        <p className="text-sm text-white font-mono">{transactionDetails.amountWei} Wei</p>
                        <p className="text-xs text-white">({transactionDetails.amountEth} ETH)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white mb-1">Hash de la transaction</p>
                    <p className="text-sm text-white font-mono break-all">{transactionDetails.transactionHash}</p>
                  </div>
                </div>
              )}
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