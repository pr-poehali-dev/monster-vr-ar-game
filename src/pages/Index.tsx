import { useState } from 'react';
import MainMenu from '@/components/MainMenu';
import WeaponShop from '@/components/WeaponShop';
import ARGameplay from '@/components/ARGameplay';
import Tutorial from '@/components/Tutorial';
import Settings from '@/components/Settings';

type Screen = 'menu' | 'shop' | 'game' | 'tutorial' | 'settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [playerStats, setPlayerStats] = useState({
    coins: 1000,
    level: 1,
    experience: 0,
    kills: 0,
    ownedWeapons: ['pistol']
  });

  const updateStats = (updates: Partial<typeof playerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...updates }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu onNavigate={setCurrentScreen} playerStats={playerStats} />;
      case 'shop':
        return <WeaponShop onBack={() => setCurrentScreen('menu')} playerStats={playerStats} updateStats={updateStats} />;
      case 'game':
        return <ARGameplay onBack={() => setCurrentScreen('menu')} playerStats={playerStats} updateStats={updateStats} />;
      case 'tutorial':
        return <Tutorial onBack={() => setCurrentScreen('menu')} onComplete={() => setCurrentScreen('game')} />;
      case 'settings':
        return <Settings onBack={() => setCurrentScreen('menu')} />;
      default:
        return <MainMenu onNavigate={setCurrentScreen} playerStats={playerStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2A2F3C] to-[#1A1F2C] overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default Index;
