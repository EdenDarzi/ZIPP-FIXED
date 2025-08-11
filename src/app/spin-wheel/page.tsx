
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Gift, Loader2, Play, TicketPercent, CakeSlice, Truck, Share2, Sparkles, AlertTriangle, CalendarClock, Info, Award, Volume2, VolumeX, Frown, Percent, RefreshCw, Cake, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import * as Tone from 'tone';

// Constants for the spin wheel
const SPIN_DURATION_MS = 5000;
const MIN_ROTATIONS = 5;
const DAILY_SPIN_COOLDOWN_HOURS = 24;

interface SpinWheelPrize {
  name: string;
  icon: string;
  color: string;
}

export default function SpinWheelPage() {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const wheelRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  
  // Prêmios traduzidos dinamicamente
  const prizes: SpinWheelPrize[] = [
    { name: t('spinWheel.prizes.discount10'), icon: 'percent', color: '#10b981' }, // emerald-500
    { name: t('spinWheel.prizes.tryAgain'), icon: 'refresh-cw', color: '#6b7280' }, // gray-500
    { name: t('spinWheel.prizes.freeDelivery'), icon: 'truck', color: '#3b82f6' }, // blue-500
    { name: t('spinWheel.prizes.freeDessert'), icon: 'cake', color: '#ec4899' }, // pink-500
    { name: t('spinWheel.prizes.dailySurprise'), icon: 'gift', color: '#8b5cf6' }, // violet-500
    { name: t('spinWheel.prizes.discount5'), icon: 'percent', color: '#f97316' }, // orange-500
    { name: t('spinWheel.prizes.tryAgain'), icon: 'refresh-cw', color: '#6b7280' }, // gray-500
    { name: t('spinWheel.prizes.dailySurprise'), icon: 'star', color: '#eab308' }, // yellow-500
  ];
  
  // Estados da roleta
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winningPrize, setWinningPrize] = useState<SpinWheelPrize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [timeLeftForNextSpin, setTimeLeftForNextSpin] = useState('');

  // Inicializar Tone.js
  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  // Verificar cooldown de 24 horas
  useEffect(() => {
    const lastSpinTimestamp = localStorage.getItem('lastZippWheelSpin');
    if (lastSpinTimestamp) {
      const lastSpinDate = new Date(parseInt(lastSpinTimestamp, 10));
      const cooldownPeriod = DAILY_SPIN_COOLDOWN_HOURS * 60 * 60 * 1000;
      const timeSinceLastSpin = new Date().getTime() - lastSpinDate.getTime();

      if (timeSinceLastSpin < cooldownPeriod) {
        setCanSpin(false);
        setNextSpinTime(new Date(lastSpinDate.getTime() + cooldownPeriod));
      }
    }
  }, []);

  // Timer para próxima tentativa
  useEffect(() => {
    if (!canSpin && nextSpinTime) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const diff = nextSpinTime.getTime() - now;

        if (diff <= 0) {
          setCanSpin(true);
          setTimeLeftForNextSpin('');
          setNextSpinTime(null);
          localStorage.removeItem('lastZippWheelSpin');
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftForNextSpin(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [canSpin, nextSpinTime]);

  // Som realista de roleta girando
  const playSpinSound = () => {
    if (!synthRef.current) return;
    
    try {
      if (Tone.context.state !== 'running') {
        Tone.start();
      }
      
      // Som realista de roleta girando - múltiplos cliques rápidos
      const clickInterval = setInterval(() => {
        synthRef.current?.triggerAttackRelease('C5', '0.05');
      }, 100);
      
      // Desacelerar gradualmente
      setTimeout(() => {
        clearInterval(clickInterval);
        const slowInterval = setInterval(() => {
          synthRef.current?.triggerAttackRelease('C5', '0.05');
        }, 200);
        
        setTimeout(() => {
          clearInterval(slowInterval);
        }, 1000);
      }, 2000);
      
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Função de som para resultados
  const playResultSound = (isWin: boolean) => {
    if (!synthRef.current) return;
    
    try {
      if (Tone.context.state !== 'running') {
        Tone.start();
      }
      
      if (isWin) {
        // Som de vitória - sequência ascendente
        synthRef.current.triggerAttackRelease('C5', '0.2');
        setTimeout(() => synthRef.current?.triggerAttackRelease('E5', '0.2'), 200);
        setTimeout(() => synthRef.current?.triggerAttackRelease('G5', '0.4'), 400);
      } else {
        // Som de derrota - sequência descendente
        synthRef.current.triggerAttackRelease('G4', '0.3');
        setTimeout(() => synthRef.current?.triggerAttackRelease('D4', '0.4'), 300);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Função handleSpin com controle de cooldown
  const handleSpin = () => {
    if (isSpinning || !canSpin) {
      if (!canSpin) {
        toast({ 
          title: t('spinWheel.dailyAttemptUsed'), 
          description: t('spinWheel.spinAgainIn').replace('{time}', timeLeftForNextSpin || ''), 
          variant: "default" 
        });
      }
      return;
    }

    setIsSpinning(true);
    setWinningPrize(null);
    playSpinSound(); // Som realista de roleta girando

    // 1. Calcular o ângulo final da rotação
    const numPrizes = prizes.length;
    const segmentAngle = 360 / numPrizes;
    const randomSegment = Math.floor(Math.random() * numPrizes);
    const randomAngleWithinSegment = (Math.random() - 0.5) * segmentAngle * 0.8; // Para não parar exatamente na borda
    
    const targetAngle = (randomSegment * segmentAngle) + randomAngleWithinSegment;
    const totalRotations = MIN_ROTATIONS * 360;
    const finalRotation = totalRotations + targetAngle;

    // Adiciona a nova rotação à rotação atual
    const newRotation = currentRotation + finalRotation;
    setCurrentRotation(newRotation);

    // 2. Aplicar a rotação com CSS
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    // 3. Após a animação, determinar e mostrar o resultado
    setTimeout(() => {
      const actualRotation = newRotation % 360;
      // O ponteiro está no topo (0 graus), então precisamos ajustar o ângulo para o cálculo
      const pointerAngle = 360 - actualRotation;
      const winningIndex = Math.floor(pointerAngle / segmentAngle) % numPrizes;
      const winningPrize = prizes[winningIndex];

      setWinningPrize(winningPrize);
      setIsSpinning(false);
      setCanSpin(false); // Desabilitar roleta após uso
      
      // Salvar timestamp do último giro
      const now = new Date();
      localStorage.setItem('lastZippWheelSpin', now.getTime().toString());
      setNextSpinTime(new Date(now.getTime() + DAILY_SPIN_COOLDOWN_HOURS * 60 * 60 * 1000));

      // Verificar se é vitória (não é "tente novamente")
      const isWin = !winningPrize.name.includes(t('spinWheel.prizes.tryAgain'));
      playResultSound(isWin);

    }, SPIN_DURATION_MS);
  };

  // Função setupWheel para criar os segmentos visuais
  const setupWheel = () => {
    if (!wheelRef.current) return;
    
    const wheel = wheelRef.current;
    const numPrizes = prizes.length;
    const segmentAngle = 360 / numPrizes;
    
    // 1. Criar o fundo com gradiente cônico
    const gradientColors = prizes.map((prize, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      return `${prize.color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');
    
    wheel.style.background = `conic-gradient(${gradientColors})`;

    // 2. Limpar prêmios existentes
    wheel.innerHTML = '';

    // 3. Posicionar cada prêmio na roleta
    prizes.forEach((prize, index) => {
      const prizeElement = document.createElement('div');
      prizeElement.className = 'prize absolute top-1/2 left-1/2 flex flex-col items-center text-white';
      prizeElement.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
      prizeElement.style.transformOrigin = 'center center';
      
      // Calcula o ângulo para o centro do segmento
      const angleRad = ((index * segmentAngle) + (segmentAngle / 2)) * (Math.PI / 180);
      
      // Posiciona o prêmio a 70% do centro para a borda
      const radius = wheel.offsetWidth * 0.35; 
      const x = Math.sin(angleRad) * radius;
      const y = -Math.cos(angleRad) * radius;
      
      // Rotação do prêmio para ficar "em pé"
      const rotation = (index * segmentAngle) + (segmentAngle / 2);

      prizeElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      
      // Ícones SVG personalizados e condizentes com cada prêmio
      const getIconComponent = (iconName: string) => {
        const iconClass = "w-6 h-6 mb-1";
        switch(iconName) {
          case 'percent': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="8" cy="8" r="3" fill="currentColor"/>
              <circle cx="16" cy="16" r="3" fill="currentColor"/>
              <path d="M4 20L20 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <text x="8" y="10" text-anchor="middle" fill="white" font-size="6" font-weight="bold">%</text>
            </svg>`;
          case 'refresh-cw': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V2L8 6l4 4V8c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 16.5 20 15.3 20 14c0-4.42-3.58-8-8-8z"/>
              <path d="M12 20v2l4-4-4-4v2c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 9.5 4 11.3 4 14c0 4.42 3.58 8 8 8z"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
            </svg>`;
          case 'truck': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <rect x="1" y="8" width="14" height="8" rx="1" fill="currentColor"/>
              <path d="M15 8v8h4l3-4v-4h-7z" fill="currentColor"/>
              <circle cx="6" cy="18" r="2" fill="white"/>
              <circle cx="18" cy="18" r="2" fill="white"/>
              <rect x="3" y="10" width="10" height="2" fill="white"/>
              <path d="M16 10h4l-2 2h-2v-2z" fill="white"/>
            </svg>`;
          case 'cake': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 19v-8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8H4z" fill="currentColor"/>
              <path d="M4 15c1 0 2 1 3 1s2-1 3-1 2 1 3 1 2-1 3-1 2 1 3 1v2H4v-2z" fill="white"/>
              <rect x="2" y="19" width="20" height="2" fill="currentColor"/>
              <circle cx="8" cy="7" r="1" fill="#ff6b6b"/>
              <path d="M8 8v2" stroke="currentColor" stroke-width="1"/>
              <circle cx="12" cy="6" r="1" fill="#ff6b6b"/>
              <path d="M12 7v2" stroke="currentColor" stroke-width="1"/>
              <circle cx="16" cy="7" r="1" fill="#ff6b6b"/>
              <path d="M16 8v2" stroke="currentColor" stroke-width="1"/>
            </svg>`;
          case 'gift': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="8" width="16" height="3" fill="#e74c3c"/>
              <rect x="5" y="11" width="14" height="9" rx="1" fill="currentColor"/>
              <rect x="11" y="8" width="2" height="12" fill="#e74c3c"/>
              <path d="M12 8c0-2-2-4-4-2s0 2 0 2h4z" fill="#27ae60"/>
              <path d="M12 8c0-2 2-4 4-2s0 2 0 2h-4z" fill="#27ae60"/>
              <circle cx="8" cy="15" r="1" fill="white"/>
              <circle cx="16" cy="15" r="1" fill="white"/>
            </svg>`;
          case 'star': 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#ffd700"/>
              <path d="M12 6l2 4 4 .5-3 3 .75 4.25L12 15.5l-3.75 2.25L9 14.5l-3-3 4-.5 2-4z" fill="white"/>
              <circle cx="12" cy="12" r="2" fill="#ffd700"/>
            </svg>`;
          default: 
            return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">?</text>
            </svg>`;
        }
      };
      
      prizeElement.innerHTML = `
        ${getIconComponent(prize.icon)}
        <span class="text-xs font-semibold mt-1">${prize.name}</span>
      `;
      wheel.appendChild(prizeElement);
    });
  };
  
  // Setup wheel when component mounts, on resize, and when language changes
  useEffect(() => {
    setupWheel();
    
    const handleResize = () => {
      setupWheel();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentLanguage, t]); // Atualizar quando idioma mudar

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-4" dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        {t('spinWheel.title')}
          </h1>
      <p className="text-gray-400 mb-8 text-center">
        {t('spinWheel.subtitle')}
      </p>

      <div className="roulette-container mb-8 relative" style={{ width: '90vw', height: '90vw', maxWidth: '450px', maxHeight: '450px' }}>
        {/* Pointer */}
        <div 
          className="roulette-pointer absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '30px solid #ef4444',
            filter: 'drop-shadow(0 -3px 2px rgba(0,0,0,0.3))'
          }}
        >
          <div
            className="absolute"
            style={{
              top: '-30px',
              left: '-12.5px',
              width: '25px',
              height: '25px',
              background: '#f9fafb',
              borderRadius: '50%',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)'
            }}
          />
        </div>
        
        {/* Main wheel */}
        <div 
          ref={wheelRef}
          className="roulette-wheel w-full h-full rounded-full border-8 border-gray-50 relative overflow-hidden"
                style={{
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.3)',
            transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
          }}
        />
        
        {/* Center hub - sempre centralizado */}
        <div 
          className="roulette-center absolute flex items-center justify-center"
          style={{
            width: '20%',
            height: '20%',
            background: '#374151',
            borderRadius: '50%',
            border: '5px solid #f9fafb',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15
          }}
        >
          <Gift className="text-white w-8 h-8" style={{ transform: 'none' }} />
        </div>
      </div>

            <button
        onClick={handleSpin}
        disabled={isSpinning || !canSpin}
                  className={cn(
          "spin-button bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-full shadow-lg text-xl transition-all duration-200 ease-in-out",
          (isSpinning || !canSpin) && "opacity-50 cursor-not-allowed transform-none shadow-none",
          (!isSpinning && canSpin) && "hover:scale-105 hover:shadow-purple-500/50"
                  )}
                  style={{
          boxShadow: (!isSpinning && canSpin) ? '0 0 20px #a78bfa, 0 0 30px #a78bfa' : 'none'
        }}
      >
        {isSpinning ? t('spinWheel.spinning') : canSpin ? t('spinWheel.spinNow') : t('spinWheel.comeBackLater')}
      </button>

      {/* Result display */}
      <div className="mt-8 text-center">
        {winningPrize && !isSpinning && (
          <div 
            className="result-animation bg-gray-800 p-6 rounded-lg shadow-2xl inline-block border-2"
            style={{ borderColor: winningPrize.color, animation: 'fadeInZoom 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}
          >
            {/* Removida a mensagem "Parabéns, você ganhou:" */}
            <div className="flex items-center justify-center mt-2">
                            <div className="w-8 h-8 mr-3" style={{ color: winningPrize.color }}>
                {winningPrize.icon === 'percent' && <Percent className="w-8 h-8" />}
                {winningPrize.icon === 'refresh-cw' && <RefreshCw className="w-8 h-8" />}
                {winningPrize.icon === 'truck' && <Truck className="w-8 h-8" />}
                {winningPrize.icon === 'cake' && <Cake className="w-8 h-8" />}
                {winningPrize.icon === 'gift' && <Gift className="w-8 h-8" />}
                {winningPrize.icon === 'star' && <Star className="w-8 h-8" />}
                  </div>
              <h2 className="text-3xl font-bold" style={{ color: winningPrize.color }}>
                {winningPrize.name}
              </h2>
                </div>
            </div>
                )}
          </div>
          
      {/* Timer de cooldown */}
      {!canSpin && timeLeftForNextSpin && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Clock className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-semibold">{t('spinWheel.oneSpinPerDay')}</span>
          </div>
          <div className="text-3xl font-mono text-white mb-2 bg-gray-900 rounded-lg py-2 px-4">
            {timeLeftForNextSpin}
          </div>
          <p className="text-gray-400 text-sm">
            {t('spinWheel.canSpinSoon')}
          </p>
            </div>
           )}

      <style jsx global>{`
        /* Animation for result display */
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .roulette-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .spin-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 20px #a78bfa, 0 0 30px #a78bfa !important;
        }
        
        .spin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: scale(1);
          box-shadow: none !important;
        }
        
        .prize {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }

        .prize-icon {
          width: 2rem;
          height: 2rem;
        }

        .prize-text {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
