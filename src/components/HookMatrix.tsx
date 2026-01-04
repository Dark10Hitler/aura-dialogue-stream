import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Heart, Sparkles } from 'lucide-react';

interface HookData {
  title: string;
  hook: string;
  retentionScore: number;
  badges: Array<'conversion' | 'pattern' | 'emotional'>;
}

interface HookMatrixProps {
  hooks: HookData[];
}

const badgeConfig = {
  conversion: {
    label: 'High Conversion',
    icon: TrendingUp,
    className: 'badge-conversion',
  },
  pattern: {
    label: 'Pattern Interrupt',
    icon: Zap,
    className: 'badge-pattern',
  },
  emotional: {
    label: 'Emotional Trigger',
    icon: Heart,
    className: 'badge-emotional',
  },
};

const RetentionMeter = ({ score, delay = 0 }: { score: number; delay?: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setAnimatedScore(Math.round(score * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [score, delay]);

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: `hsl(187 94% 43% / 0.5)` }}
      />
      
      {/* SVG Meter */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="hsl(240 4% 16%)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(187 94% 43%)" />
            <stop offset="100%" stopColor="hsl(256 82% 66%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{animatedScore}%</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Retention</span>
      </div>
    </div>
  );
};

export const HookMatrix = ({ hooks }: HookMatrixProps) => {
  if (!hooks || hooks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Viral Hook Matrix</h3>
          <p className="text-sm text-muted-foreground">AI-optimized opening hooks</p>
        </div>
      </div>

      {/* Hook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hooks.map((hook, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="hook-card rounded-2xl p-5 cursor-pointer group"
          >
            {/* Header with title and meter */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="text-xs text-accent font-medium uppercase tracking-wider">
                  Option {index + 1}
                </span>
                <h4 className="text-base font-semibold text-foreground mt-1 leading-tight">
                  {hook.title}
                </h4>
              </div>
              <RetentionMeter score={hook.retentionScore} delay={index * 200} />
            </div>

            {/* Hook Text */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[60px]">
              "{hook.hook}"
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {hook.badges.map((badge) => {
                const config = badgeConfig[badge];
                const Icon = config.icon;
                return (
                  <div
                    key={badge}
                    className={`${config.className} px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5`}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
