import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface TutorialProps {
  onBack: () => void;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: 'Добро пожаловать!',
    description: 'AR Monsters - это шутер в дополненной реальности. Ваша задача - уничтожать монстров, которые появляются на экране.',
    icon: 'Gamepad2',
    tip: 'Используйте телефон для лучшего опыта AR'
  },
  {
    title: 'Управление',
    description: 'Наведите прицел на монстра и кликните для выстрела. Следите за количеством патронов и перезаряжайтесь вовремя.',
    icon: 'Crosshair',
    tip: 'Точность важнее скорости стрельбы'
  },
  {
    title: 'Система прогресса',
    description: 'За каждого убитого монстра вы получаете очки, монеты и опыт. Копите монеты для покупки нового оружия в магазине.',
    icon: 'TrendingUp',
    tip: 'Разное оружие имеет разные характеристики'
  },
  {
    title: 'Начинайте охоту!',
    description: 'Вы готовы! Покупайте оружие, повышайте уровень и становитесь лучшим охотником на монстров!',
    icon: 'Trophy',
    tip: 'Удачной охоты, солдат!'
  }
];

const Tutorial = ({ onBack, onComplete }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LDE2NSwyMzMsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="lg"
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={24} className="mr-2" />
          Назад в меню
        </Button>

        <Card className="bg-card/60 backdrop-blur-xl border-2 border-primary/30 p-8 box-glow">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-6 box-glow">
              <Icon name={step.icon as any} size={48} className="text-white" />
            </div>
            
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              {step.title}
            </h2>
            
            <p className="text-lg text-foreground mb-6">
              {step.description}
            </p>

            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/50 px-4 py-2 rounded-full">
              <Icon name="Lightbulb" size={20} className="text-secondary" />
              <span className="text-sm font-medium text-secondary">{step.tip}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-12 bg-primary' 
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Icon name="ChevronLeft" size={24} className="mr-2" />
              Назад
            </Button>
            
            <Button
              onClick={handleNext}
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  <Icon name="Check" size={24} className="mr-2" />
                  В бой!
                </>
              ) : (
                <>
                  Далее
                  <Icon name="ChevronRight" size={24} className="ml-2" />
                </>
              )}
            </Button>
          </div>

          {currentStep === tutorialSteps.length - 1 && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full mt-4"
            >
              Пропустить и вернуться в меню
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Tutorial;
