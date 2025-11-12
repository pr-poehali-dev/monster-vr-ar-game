import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WeaponShopProps {
  onBack: () => void;
  playerStats: {
    coins: number;
    ownedWeapons: string[];
  };
  updateStats: (updates: any) => void;
}

interface Weapon {
  id: string;
  name: string;
  price: number;
  damage: number;
  fireRate: number;
  accuracy: number;
  ammo: number;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const weapons: Weapon[] = [
  {
    id: 'pistol',
    name: 'Пистолет M9',
    price: 0,
    damage: 25,
    fireRate: 3,
    accuracy: 85,
    ammo: 15,
    icon: 'Gun',
    description: 'Стандартное оружие. Надёжное и точное.',
    rarity: 'common'
  },
  {
    id: 'shotgun',
    name: 'Дробовик',
    price: 500,
    damage: 75,
    fireRate: 1,
    accuracy: 60,
    ammo: 8,
    icon: 'Crosshair',
    description: 'Мощный урон на близкой дистанции.',
    rarity: 'rare'
  },
  {
    id: 'rifle',
    name: 'Штурмовая винтовка',
    price: 1200,
    damage: 35,
    fireRate: 8,
    accuracy: 90,
    ammo: 30,
    icon: 'Zap',
    description: 'Высокая скорострельность и точность.',
    rarity: 'epic'
  },
  {
    id: 'sniper',
    name: 'Снайперская винтовка',
    price: 2000,
    damage: 100,
    fireRate: 1,
    accuracy: 99,
    ammo: 5,
    icon: 'Target',
    description: 'Максимальный урон. Один выстрел - одно убийство.',
    rarity: 'legendary'
  },
  {
    id: 'smg',
    name: 'Пистолет-пулемёт',
    price: 800,
    damage: 20,
    fireRate: 12,
    accuracy: 75,
    ammo: 40,
    icon: 'Flame',
    description: 'Огромная скорострельность для подавления.',
    rarity: 'rare'
  },
  {
    id: 'launcher',
    name: 'Гранатомёт',
    price: 3500,
    damage: 200,
    fireRate: 1,
    accuracy: 70,
    ammo: 3,
    icon: 'Bomb',
    description: 'Взрывной урон по площади. Уничтожает всё.',
    rarity: 'legendary'
  }
];

const rarityColors = {
  common: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
  rare: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  epic: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  legendary: 'bg-orange-500/20 border-orange-500/50 text-orange-300'
};

const WeaponShop = ({ onBack, playerStats, updateStats }: WeaponShopProps) => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  const handlePurchase = (weapon: Weapon) => {
    if (playerStats.ownedWeapons.includes(weapon.id)) {
      toast.error('Вы уже владеете этим оружием!');
      return;
    }

    if (playerStats.coins < weapon.price) {
      toast.error('Недостаточно монет!');
      return;
    }

    updateStats({
      coins: playerStats.coins - weapon.price,
      ownedWeapons: [...playerStats.ownedWeapons, weapon.id]
    });

    toast.success(`${weapon.name} куплен!`, {
      description: `Осталось монет: ${playerStats.coins - weapon.price}`
    });
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LDE2NSwyMzMsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" size="lg">
            <Icon name="ArrowLeft" size={24} className="mr-2" />
            Назад
          </Button>
          <div className="flex items-center gap-3 bg-card/60 backdrop-blur-xl px-6 py-3 rounded-full border border-primary/30 box-glow">
            <Icon name="Coins" size={24} className="text-primary" />
            <span className="text-2xl font-bold">{playerStats.coins}</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
            МАГАЗИН ОРУЖИЯ
          </h1>
          <p className="text-muted-foreground text-lg">Выберите своё оружие для охоты на монстров</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weapons.map((weapon) => {
            const isOwned = playerStats.ownedWeapons.includes(weapon.id);
            const canAfford = playerStats.coins >= weapon.price;

            return (
              <Card 
                key={weapon.id}
                className={`bg-card/40 backdrop-blur-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  selectedWeapon?.id === weapon.id 
                    ? 'border-primary box-glow' 
                    : 'border-border/50'
                } ${isOwned ? 'border-green-500/50' : ''}`}
                onClick={() => setSelectedWeapon(weapon)}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-xl ${rarityColors[weapon.rarity]} border-2`}>
                      <Icon name={weapon.icon as any} size={32} />
                    </div>
                    <Badge className={rarityColors[weapon.rarity]}>
                      {weapon.rarity.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-1">{weapon.name}</h3>
                    <p className="text-sm text-muted-foreground">{weapon.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={16} className="text-destructive" />
                      <span>Урон: {weapon.damage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Timer" size={16} className="text-primary" />
                      <span>Скор: {weapon.fireRate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Crosshair" size={16} className="text-green-500" />
                      <span>Точн: {weapon.accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Package" size={16} className="text-secondary" />
                      <span>Патр: {weapon.ammo}</span>
                    </div>
                  </div>

                  {isOwned ? (
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled
                    >
                      <Icon name="Check" size={20} className="mr-2" />
                      Куплено
                    </Button>
                  ) : (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(weapon);
                      }}
                      disabled={!canAfford}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary disabled:opacity-50"
                    >
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      {weapon.price === 0 ? 'Бесплатно' : `${weapon.price} монет`}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeaponShop;
