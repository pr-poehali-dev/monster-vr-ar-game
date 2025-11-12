import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ARGameplayProps {
  onBack: () => void;
  playerStats: {
    kills: number;
    experience: number;
    coins: number;
  };
  updateStats: (updates: any) => void;
}

interface Monster {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
}

const ARGameplay = ({ onBack, playerStats, updateStats }: ARGameplayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(30);
  const [maxAmmo] = useState(30);
  const [reloading, setReloading] = useState(false);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (monsters.length < 5) {
        const newMonster: Monster = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 10 + Math.random() * 20,
          health: 100,
          maxHealth: 100,
          speed: 0.5 + Math.random() * 0.5
        };
        setMonsters(prev => [...prev, newMonster]);
      }
    }, 3000);

    const moveInterval = setInterval(() => {
      setMonsters(prev => 
        prev.map(monster => ({
          ...monster,
          y: monster.y + monster.speed
        })).filter(monster => monster.y < 90)
      );
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isPlaying, monsters.length]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!isPlaying || ammo <= 0 || reloading) return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setAmmo(prev => prev - 1);

    let hit = false;
    setMonsters(prev => 
      prev.map(monster => {
        const distance = Math.sqrt(
          Math.pow(monster.x - clickX, 2) + 
          Math.pow(monster.y - clickY, 2)
        );

        if (distance < 8 && !hit) {
          hit = true;
          const newHealth = monster.health - 35;
          
          if (newHealth <= 0) {
            setScore(s => s + 100);
            updateStats({
              kills: playerStats.kills + 1,
              experience: playerStats.experience + 50,
              coins: playerStats.coins + 10
            });
            toast.success('+100 очков', { description: '+10 монет, +50 опыта' });
            return { ...monster, health: 0 };
          }
          
          return { ...monster, health: newHealth };
        }
        return monster;
      }).filter(m => m.health > 0)
    );

    if (!hit) {
      toast.error('Промах!');
    }
  };

  const handleReload = () => {
    if (reloading || ammo === maxAmmo) return;
    setReloading(true);
    setTimeout(() => {
      setAmmo(maxAmmo);
      setReloading(false);
      toast.success('Перезарядка завершена!');
    }, 2000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshairPos({ x, y });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setMonsters([]);
    setAmmo(maxAmmo);
    toast.success('Охота началась! Уничтожайте монстров!');
  };

  const endGame = () => {
    setIsPlaying(false);
    toast.info(`Игра окончена! Ваш счёт: ${score}`);
    onBack();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <Button onClick={endGame} variant="ghost" size="lg" className="bg-card/80 backdrop-blur">
          <Icon name="ArrowLeft" size={24} className="mr-2" />
          Выход
        </Button>

        <div className="flex gap-4">
          <div className="bg-card/80 backdrop-blur px-6 py-3 rounded-lg border border-primary/30 flex items-center gap-2">
            <Icon name="Target" size={24} className="text-primary" />
            <span className="text-2xl font-bold">{score}</span>
          </div>
          
          <div className="bg-card/80 backdrop-blur px-6 py-3 rounded-lg border border-secondary/30 flex items-center gap-2">
            <Icon name="Zap" size={24} className="text-secondary" />
            <span className="text-2xl font-bold">{playerStats.kills}</span>
          </div>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="flex-1 relative cursor-crosshair overflow-hidden bg-gradient-to-b from-sky-900 via-sky-700 to-green-900"
        onClick={handleShoot}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ГОТОВЫ К ОХОТЕ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Наведите прицел на монстров и кликайте для стрельбы. Не дайте им приблизиться!
              </p>
              <Button 
                onClick={startGame}
                size="lg"
                className="h-16 px-12 text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary box-glow"
              >
                <Icon name="Crosshair" size={32} className="mr-3" />
                НАЧАТЬ
              </Button>
            </div>
          </div>
        )}

        {monsters.map(monster => (
          <div
            key={monster.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${monster.x}%`,
              top: `${monster.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center border-4 border-red-400 shadow-2xl animate-pulse">
                <span className="text-4xl">👾</span>
              </div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-200"
                  style={{ width: `${(monster.health / monster.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {isPlaying && (
          <div
            className="absolute w-16 h-16 pointer-events-none z-30"
            style={{
              left: `${crosshairPos.x}%`,
              top: `${crosshairPos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-2 border-primary rounded-full opacity-50"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary"></div>
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-primary"></div>
              <div className="absolute inset-0 border-2 border-secondary rounded-full animate-ping"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border-t-4 border-primary/30 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-primary" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{ammo}</span>
                  <span className="text-xl text-muted-foreground">/ {maxAmmo}</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">Патроны</p>
              </div>
            </div>

            <Button 
              onClick={handleReload}
              disabled={reloading || ammo === maxAmmo || !isPlaying}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary"
            >
              <Icon name="RotateCw" size={24} className={`mr-2 ${reloading ? 'animate-spin' : ''}`} />
              {reloading ? 'Перезарядка...' : 'Перезарядить'}
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground uppercase mb-1">Совет</div>
            <p className="text-lg font-medium">Стреляйте точно - патроны на вес золота!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARGameplay;
