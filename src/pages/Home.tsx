import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layers, Zap } from 'lucide-react';
import BlockchainInfo from '../components/BlockchainInfo';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-200 font-medium">Web3 Development Project</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Blockchain dApp
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Développement d'une application décentralisée pour le TP 3 - Module Blockchain
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            {['Solidity', 'Truffle', 'ReactJS', 'Web3'].map((tech, index) => (
              <div 
                key={tech} 
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-sm font-mono text-gray-200">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Status */}
        <div className="mb-12">
          <BlockchainInfo />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard 
            icon={<Code className="w-6 h-6" />}
            title="Smart Contracts"
            description="Contrats intelligents développés en Solidity"
          />
          <FeatureCard 
            icon={<Layers className="w-6 h-6" />}
            title="Web3 Integration"
            description="Interface React connectée à la blockchain"
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Real-time Updates"
            description="Interactions en temps réel avec Ethereum"
          />
        </div>

        {/* Exercises Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Exercices Pratiques
          </h2>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {exercises.map((exercise, index) => (
              <ExerciseCard 
                key={exercise.number}
                {...exercise}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400">
            Sélectionnez un exercice pour commencer l'interaction avec la blockchain
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-white">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

const ExerciseCard = ({ number, title, description, delay }) => (
  <Link 
    to={`/exercise${number}`}
    className="block group"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="h-full p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {number}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </Link>
);

const exercises = [
  { 
    number: 1, 
    title: "Somme de deux variables",
    description: "Calcul et affichage de la somme de deux nombres via smart contract"
  },
  { 
    number: 2, 
    title: "Conversion des cryptomonnaies",
    description: "Convertisseur Ether/Wei avec interface utilisateur intuitive"
  },
  { 
    number: 3, 
    title: "Traitement des chaînes",
    description: "Manipulation et gestion des chaînes de caractères"
  },
  { 
    number: 4, 
    title: "Test de signe",
    description: "Vérification si un nombre est positif ou négatif"
  },
  { 
    number: 5, 
    title: "Test de parité",
    description: "Détermination si un nombre est pair ou impair"
  },
  { 
    number: 6, 
    title: "Gestion des tableaux",
    description: "Stockage et manipulation de tableaux de nombres"
  },
  { 
    number: 7, 
    title: "Programmation Orientée Objet",
    description: "Implémentation d'objets Rectangle avec méthodes"
  },
  { 
    number: 8, 
    title: "Variables globales",
    description: "Utilisation de msg.sender et msg.value pour les paiements"
  }
];

export default Home;