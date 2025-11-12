import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface MainMenuProps {
  onNavigate: (screen: 'menu' | 'shop' | 'game' | 'tutorial' | 'settings') => void;
  playerStats: {
    coins: number;
    level: number;
    experience: number;
    kills: number;
  };
}

const MainMenu = ({ onNavigate, playerStats }: MainMenuProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LDE2NSwyMzMsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary text-glow animate-pulse">
            AR MONSTERS
          </h1>
          <p className="text-muted-foreground text-lg tracking-wider uppercase">
            Дополненная реальность • Экшн • Выживание
          </p>
        </div>

        <Card className="bg-card/40 backdrop-blur-xl border-primary/30 p-6 box-glow">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="Award" size={20} className="text-secondary" />
                <span className="text-2xl font-bold text-secondary">{playerStats.level}</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase">Уровень</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="Coins" size={20} className="text-primary" />
                <span className="text-2xl font-bold text-primary">{playerStats.coins}</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase">Монеты</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="Target" size={20} className="text-destructive" />
                <span className="text-2xl font-bold text-destructive">{playerStats.kills}</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase">Убийств</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name="TrendingUp" size={20} className="text-green-500" />
                <span className="text-2xl font-bold text-green-500">{playerStats.experience}</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase">Опыт</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => onNavigate('game')}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary box-glow"
              size="lg"
            >
              <Icon name="Gamepad2" size={24} className="mr-2" />
              Начать охоту
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => onNavigate('shop')}
                variant="outline"
                className="h-12 border-primary/50 hover:bg-primary/10 hover:border-primary"
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Магазин
              </Button>
              <Button 
                onClick={() => onNavigate('tutorial')}
                variant="outline"
                className="h-12 border-secondary/50 hover:bg-secondary/10 hover:border-secondary"
              >
                <Icon name="BookOpen" size={20} className="mr-2" />
                Обучение
              </Button>
            </div>

            <Button 
              onClick={() => onNavigate('settings')}
              variant="ghost"
              className="w-full"
            >
              <Icon name="Settings" size={20} className="mr-2" />
              Настройки
            </Button>
          </div>
        </Card>

        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Icon name="Wifi" size={14} className="mr-1" />
            Онлайн
          </Badge>
          <Badge variant="outline" className="border-green-500/50 text-green-500">
            <Icon name="Users" size={14} className="mr-1" />
            1,234 игроков
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
