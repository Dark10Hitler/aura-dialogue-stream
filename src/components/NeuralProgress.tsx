import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface NeuralProgressProps {
  isColdStart?: boolean;
}

const NEURAL_STAGES = [
  { icon: Brain, label: 'Analyzing Trends...', color: 'primary' },
  { icon: Sparkles, label: 'Simulating Audience Retention...', color: 'accent' },
  { icon: Zap, label: 'Generating Viral Hooks...', color: 'primary' },
  { icon: TrendingUp, label: 'Directing Scenes...', color: 'accent' },
  { icon: Brain, label: 'Polishing Final Output...', color: 'primary' },
];

const COLD_START_STAGES = [
  { icon: Brain, label: 'Waking up AI server...', color: 'primary' },
  { icon: Zap, label: 'Initializing neural networks...', color: 'accent' },
  { icon: Sparkles, label: 'Server warming up (~30s)...', color: 'primary' },
];

export const NeuralProgress = ({ isColdStart }: NeuralProgressProps) => {
  const [stageIndex, setStageIndex] = useState(0);
  const stages = isColdStart ? COLD_START_STAGES : NEURAL_STAGES;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [stages.length]);
  
  const currentStage = stages[stageIndex];
  const Icon = currentStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated rounded-2xl p-6 mt-6 overflow-hidden relative"
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30 animate-neural-flow"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), transparent)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Neural wave lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full"
            style={{ 
              top: `${30 + i * 20}%`,
              background: `linear-gradient(90deg, transparent, hsl(var(--${i % 2 === 0 ? 'primary' : 'accent'}) / 0.5), transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Icon and Status */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center relative`}
            style={{
              background: `linear-gradient(135deg, hsl(var(--${currentStage.color}) / 0.2), hsl(var(--${currentStage.color}) / 0.1))`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 20px hsl(var(--${currentStage.color}) / 0.2)`,
                `0 0 40px hsl(var(--${currentStage.color}) / 0.4)`,
                `0 0 20px hsl(var(--${currentStage.color}) / 0.2)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-7 h-7 ${currentStage.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
            
            {/* Orbiting dot */}
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-foreground"
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '28px 28px' }}
            />
          </motion.div>
          
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentStage.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-semibold text-foreground"
              >
                {currentStage.label}
              </motion.h3>
            </AnimatePresence>
            <p className="text-sm text-muted-foreground mt-1">
              {isColdStart 
                ? 'Cold start detected. Initial request takes longer.'
                : 'Neural processing in progress. Please wait...'}
            </p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-2 mb-4">
          {stages.map((_, idx) => (
            <motion.div
              key={idx}
              className="h-1.5 flex-1 rounded-full overflow-hidden bg-muted/50"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: idx <= stageIndex 
                    ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
                    : 'transparent',
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: idx < stageIndex ? '100%' : idx === stageIndex ? '100%' : '0%',
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Main Progress Bar */}
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
              backgroundSize: '200% 100%',
            }}
            initial={{ width: '0%' }}
            animate={{ 
              width: '100%',
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              width: { duration: isColdStart ? 30 : 20, ease: 'linear' },
              backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
