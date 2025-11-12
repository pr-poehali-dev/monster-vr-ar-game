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
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(null);
        toast.success('AR камера активирована!');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Не удалось получить доступ к камере');
      toast.error('Не удалось включить камеру. Используется обычный режим.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleShoot = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying || ammo <= 0 || reloading) return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clickX: number, clickY: number;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      clickX = ((touch.clientX - rect.left) / rect.width) * 100;
      clickY = ((touch.clientY - rect.top) / rect.height) * 100;
    } else {
      clickX = ((e.clientX - rect.left) / rect.width) * 100;
      clickY = ((e.clientY - rect.top) / rect.height) * 100;
    }

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

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x: number, y: number;

    if ('touches' in e) {
      const touch = e.touches[0];
      x = ((touch.clientX - rect.left) / rect.width) * 100;
      y = ((touch.clientY - rect.top) / rect.height) * 100;
    } else {
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    }
    
    setCrosshairPos({ x, y });
  };

  const startGame = async () => {
    await startCamera();
    setIsPlaying(true);
    setScore(0);
    setMonsters([]);
    setAmmo(maxAmmo);
    toast.success('Охота началась! Уничтожайте монстров!');
  };

  const endGame = () => {
    setIsPlaying(false);
    stopCamera();
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
        className="flex-1 relative cursor-crosshair overflow-hidden bg-black"
        onClick={handleShoot}
        onTouchStart={handleShoot}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {!cameraActive && isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-sky-700 to-green-900">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          </div>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
            <div className="text-center space-y-6 p-8">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-primary/20 rounded-full border-4 border-primary/50 animate-pulse">
                  <Icon name="Camera" size={64} className="text-primary" />
                </div>
              </div>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AR РЕЖИМ
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Включите камеру для игры в дополненной реальности. Монстры появятся в вашем мире!
              </p>
              {cameraError && (
                <p className="text-destructive text-sm bg-destructive/20 px-4 py-2 rounded-lg border border-destructive/50">
                  {cameraError}
                </p>
              )}
              <Button 
                onClick={startGame}
                size="lg"
                className="h-16 px-12 text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary box-glow"
              >
                <Icon name="Camera" size={32} className="mr-3" />
                ВКЛЮЧИТЬ КАМЕРУ
              </Button>
              <p className="text-sm text-muted-foreground">
                Для работы AR требуется доступ к камере устройства
              </p>
            </div>
          </div>
        )}

        {monsters.map(monster => (
          <div
            key={monster.id}
            className="absolute transition-all duration-100 pointer-events-none"
            style={{
              left: `${monster.x}%`,
              top: `${monster.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center border-4 border-red-400 shadow-2xl animate-pulse">
                <span className="text-5xl">👾</span>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-28 h-3 bg-gray-900/80 rounded-full overflow-hidden border-2 border-gray-700">
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
            className="absolute w-20 h-20 pointer-events-none z-30"
            style={{
              left: `${crosshairPos.x}%`,
              top: `${crosshairPos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-2 border-primary rounded-full opacity-60"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary shadow-lg"></div>
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-primary shadow-lg"></div>
              <div className="absolute inset-2 border-2 border-secondary rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 bg-green-500/20 backdrop-blur border border-green-500/50 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-green-500">AR АКТИВЕН</span>
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

          <div className="text-right hidden md:block">
            <div className="text-sm text-muted-foreground uppercase mb-1">Совет</div>
            <p className="text-lg font-medium">
              {cameraActive ? 'Двигайте телефон для поиска монстров!' : 'Наведите на монстров и стреляйте!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARGameplay;
