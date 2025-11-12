import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SettingsProps {
  onBack: () => void;
}

const Settings = ({ onBack }: SettingsProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [arMode, setArMode] = useState(true);
  const [soundVolume, setSoundVolume] = useState([80]);
  const [musicVolume, setMusicVolume] = useState([60]);
  const [sensitivity, setSensitivity] = useState([50]);

  const handleSave = () => {
    toast.success('Настройки сохранены!');
  };

  const handleReset = () => {
    setSoundEnabled(true);
    setMusicEnabled(true);
    setVibrationEnabled(true);
    setArMode(true);
    setSoundVolume([80]);
    setMusicVolume([60]);
    setSensitivity([50]);
    toast.info('Настройки сброшены до значений по умолчанию');
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LDE2NSwyMzMsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="lg"
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={24} className="mr-2" />
          Назад
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
            НАСТРОЙКИ
          </h1>
          <p className="text-muted-foreground text-lg">Настройте игру под себя</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/60 backdrop-blur-xl border-2 border-primary/30 p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Volume2" size={28} className="text-primary" />
              Звук и музыка
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-lg flex items-center gap-2">
                  <Icon name="Volume2" size={20} />
                  Звуковые эффекты
                </Label>
                <Switch 
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              {soundEnabled && (
                <div className="pl-8 space-y-2">
                  <Label className="text-sm text-muted-foreground">Громкость эффектов: {soundVolume[0]}%</Label>
                  <Slider
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="music" className="text-lg flex items-center gap-2">
                  <Icon name="Music" size={20} />
                  Фоновая музыка
                </Label>
                <Switch 
                  id="music"
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>

              {musicEnabled && (
                <div className="pl-8 space-y-2">
                  <Label className="text-sm text-muted-foreground">Громкость музыки: {musicVolume[0]}%</Label>
                  <Slider
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-2 border-primary/30 p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Gamepad2" size={28} className="text-primary" />
              Игровой процесс
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="ar" className="text-lg flex items-center gap-2">
                  <Icon name="Camera" size={20} />
                  AR режим (камера)
                </Label>
                <Switch 
                  id="ar"
                  checked={arMode}
                  onCheckedChange={setArMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="vibration" className="text-lg flex items-center gap-2">
                  <Icon name="Smartphone" size={20} />
                  Вибрация
                </Label>
                <Switch 
                  id="vibration"
                  checked={vibrationEnabled}
                  onCheckedChange={setVibrationEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg flex items-center gap-2">
                  <Icon name="Gauge" size={20} />
                  Чувствительность прицела: {sensitivity[0]}%
                </Label>
                <Slider
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground pl-6">
                  {sensitivity[0] < 30 ? 'Низкая - для точной стрельбы' : 
                   sensitivity[0] < 70 ? 'Средняя - сбалансированная' : 
                   'Высокая - для быстрой реакции'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-2 border-primary/30 p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Info" size={28} className="text-primary" />
              Информация
            </h3>

            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span>Версия игры</span>
                <span className="font-mono font-bold text-foreground">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span>Движок</span>
                <span className="font-bold text-foreground">React AR Engine</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Разработчик</span>
                <span className="font-bold text-foreground">AR Monsters Studio</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Icon name="RotateCcw" size={20} className="mr-2" />
              Сбросить
            </Button>
            
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              <Icon name="Check" size={20} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
