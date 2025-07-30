import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Search, List } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import NumberStorage from '../contracts/NumberStorage.json';

const contractAddress = '0x9aD7152Ee7C4d75D45aCe734efa7B4bE2d293BCc';

function Exercise6() {
  const [newNumber, setNewNumber] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [sum, setSum] = useState(0);
  const [indexToFetch, setIndexToFetch] = useState('');
  const [fetchedNumber, setFetchedNumber] = useState(undefined);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initializeWeb3();
        const web3 = getWeb3();

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          setError('Aucun compte disponible');
          return;
        }

        const contractInstance = new web3.eth.Contract(NumberStorage.abi, contractAddress);

        setAccount(accounts[0]);
        setContract(contractInstance);

        await refreshData(contractInstance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const refreshData = async (contractInstance = contract) => {
    if (!contractInstance) return;
    try {
      setLoading(true);
      const nums = await contractInstance.methods.afficheTableau().call();
      const total = await contractInstance.methods.calcularSomme().call();
      setNumbers(nums);
      setSum(typeof total === 'bigint' ? Number(total) : total);
    } catch (err) {
      setError('Erreur lors du chargement des données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNumber = async () => {
    if (!contract || !account) return;
    if (newNumber === '' || isNaN(newNumber)) {
      setError('Veuillez entrer un nombre valide');
      return;
    }

    setError('');
    setAdding(true);
    try {
      await contract.methods.ajouterNombre(newNumber).send({ from: account });
      setNewNumber('');
      await refreshData();
    } catch (err) {
      setError('Erreur lors de l\'ajout: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const getNumber = async () => {
    if (!contract) return;
    if (indexToFetch === '' || isNaN(indexToFetch)) {
      setError('Veuillez entrer un index valide');
      return;
    }
    setError('');
    try {
      const index = parseInt(indexToFetch);
      const num = await contract.methods.getElement(index).call();
      setFetchedNumber(num);
    } catch (err) {
      setError('Index invalide ou erreur: ' + err.message);
      setFetchedNumber(undefined);
    }
  };

  return (
    <Layout
      title="Number Storage"
      description="Stockage et manipulation de tableaux de nombres sur blockchain"
    >
      <div className="space-y-8">
        {/* Account Info */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Compte actif</h3>
              <p className="text-white font-mono text-sm mt-1">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Non connecté'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${account ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          </div>
        </Card>

        {/* Add Number */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Ajouter un nombre</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Nouveau nombre"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                disabled={adding}
              />
            </div>
            <Button
              onClick={addNumber}
              loading={adding}
              disabled={!newNumber || !account}
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </Card>

        {/* Get Number by Index */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Rechercher par index</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Index à rechercher"
                value={indexToFetch}
                onChange={(e) => setIndexToFetch(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              onClick={getNumber}
              disabled={!indexToFetch || !contract}
              variant="secondary"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </Button>
          </div>

          {fetchedNumber !== undefined && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white">
                <span className="text-gray-400">Nombre à l'index {indexToFetch}:</span>
                <span className="font-bold text-cyan-300 ml-2">
                  {typeof fetchedNumber === 'bigint' ? fetchedNumber.toString() : fetchedNumber}
                </span>
              </p>
            </div>
          )}
        </Card>

        {/* Refresh Data */}
        <Button
          onClick={() => refreshData()}
          loading={loading}
          className="w-full"
          variant="secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser les données
        </Button>

        {/* Error Display */}
        {error && (
          <Card>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          </Card>
        )}

        {/* Data Display */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Numbers Array */}
          <Card gradient>
            <div className="flex items-center gap-3 mb-4">
              <List className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Tous les nombres</h3>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {numbers.length > 0 ? (
                numbers.map((num, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">Index {index}</span>
                    <span className="text-white font-mono">{num}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun nombre stocké</p>
              )}
            </div>
          </Card>

          {/* Sum Display */}
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Somme totale</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {sum}
              </div>
              <p className="text-gray-400 mt-2">
                Somme de {numbers.length} nombre{numbers.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Exercise6;