import { useState } from 'react';
import { Square, Download, Ruler } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { initializeWeb3, getWeb3 } from '../utils/web3';
import Rectangle from '../contracts/Rectangle.json';

const contractAddress = '0xDE9F243cC2E3465c20Cd0bfa9a37F00C6E78cd5A';

function Exercise7() {
  const [rectangleInfo, setRectangleInfo] = useState({
    x: 0,
    y: 0,
    length: 10,
    width: 5,
  });
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [coordinates, setCoordinates] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRectangleData = async () => {
    try {
      setLoading(true);
      setError('');

      await initializeWeb3();
      const web3 = getWeb3();
      const contract = new web3.eth.Contract(Rectangle.abi, contractAddress);

      const surface = await contract.methods.surface().call();
      const coords = await contract.methods.afficheXY().call();
      const dimensions = await contract.methods.afficheLoLa().call();

      setSurfaceArea(surface);
      setCoordinates(`X: ${coords[0]}, Y: ${coords[1]}`);
      setRectangleInfo((prev) => ({
        ...prev,
        length: dimensions[0],
        width: dimensions[1],
        x: coords[0],
        y: coords[1],
      }));

    } catch (err) {
      setError('Erreur lors du chargement des données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Rectangle Manager" 
      description="Programmation orientée objet - Gestion d'objets Rectangle"
    >
      <div className="space-y-8">
        {/* Load Data Button */}
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Square className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Rectangle Data</h2>
          </div>
          
          <Button
            onClick={getRectangleData}
            loading={loading}
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Chargement...' : 'Charger les données du rectangle'}
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

        {/* Rectangle Info Display */}
        {(surfaceArea > 0 || coordinates) && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Properties */}
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-semibold text-white">Propriétés</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-mono">"Je suis Rectangle"</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Coordonnées</span>
                  <span className="text-white font-mono">{coordinates}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Longueur</span>
                  <span className="text-purple-300 font-bold">{rectangleInfo.length}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Largeur</span>
                  <span className="text-purple-300 font-bold">{rectangleInfo.width}</span>
                </div>
              </div>
            </Card>

            {/* Surface Calculation */}
            <Card gradient>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-6">Surface calculée</h3>
                
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Square className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  {surfaceArea}
                </div>
                
                <p className="text-gray-400">
                  {rectangleInfo.length} × {rectangleInfo.width} = {surfaceArea} unités²
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Visual Rectangle Representation */}
        {surfaceArea > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Représentation visuelle</h3>
            
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 rounded-lg"
                  style={{
                    width: `${Math.min(rectangleInfo.length * 20, 300)}px`,
                    height: `${Math.min(rectangleInfo.width * 20, 200)}px`,
                    minWidth: '100px',
                    minHeight: '60px'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">
                        {rectangleInfo.length} × {rectangleInfo.width}
                      </div>
                      <div className="text-purple-200 text-xs">
                        Surface: {surfaceArea}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Coordinates indicator */}
                <div className="absolute -top-8 -left-8 text-xs text-gray-400">
                  ({rectangleInfo.x}, {rectangleInfo.y})
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default Exercise7;