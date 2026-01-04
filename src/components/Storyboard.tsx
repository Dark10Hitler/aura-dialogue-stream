import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Scene {
  scene: string | number;
  visual: string;
  audio: string;
  aiPrompt: string;
}

interface StoryboardProps {
  scenes: Scene[];
}

const SceneCard = ({ scene, index }: { scene: Scene; index: number }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(scene.aiPrompt);
    setCopied(true);
    toast({
      title: 'Copied to Clipboard',
      description: 'AI video prompt copied successfully',
    });
    
    // Haptic-like animation feedback
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="scene-card rounded-xl overflow-hidden"
    >
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[80px_1fr_1fr_1fr] gap-0">
        {/* Scene Number */}
        <div className="p-4 flex items-center justify-center border-r border-border/50">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <span className="text-lg font-bold text-accent">{scene.scene}</span>
          </div>
        </div>

        {/* Visual Column */}
        <div className="p-4 border-r border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Visual & Camera</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{scene.visual}</p>
        </div>

        {/* Audio Column */}
        <div className="p-4 border-r border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">Audio & SFX</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono leading-relaxed italic">
            {scene.audio}
          </p>
        </div>

        {/* AI Prompt Column */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-emerald" />
              <span className="text-xs text-neon-emerald font-medium uppercase tracking-wider">AI Video Prompt</span>
            </div>
          </div>
          <div className="prompt-blackbox rounded-lg p-3 mb-3">
            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
              {scene.aiPrompt}
            </p>
          </div>
          <button
            onClick={handleCopyPrompt}
            className={`glow-button-cyan w-full py-2 rounded-lg text-xs font-medium text-accent-foreground flex items-center justify-center gap-2 transition-all ${copied ? 'animate-haptic' : ''}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Layout - Accordion Style */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-lg font-bold text-accent">{scene.scene}</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-foreground">Scene {scene.scene}</span>
              <p className="text-xs text-muted-foreground line-clamp-1">{scene.visual.substring(0, 40)}...</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                {/* Visual */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">Visual & Camera</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{scene.visual}</p>
                </div>

                {/* Audio */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent font-medium uppercase tracking-wider">Audio & SFX</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed italic">{scene.audio}</p>
                </div>

                {/* AI Prompt */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-neon-emerald" />
                    <span className="text-xs text-neon-emerald font-medium uppercase tracking-wider">AI Video Prompt</span>
                  </div>
                  <div className="prompt-blackbox rounded-lg p-3 mb-3">
                    <p className="text-xs text-foreground/80 leading-relaxed">{scene.aiPrompt}</p>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className={`glow-button-cyan w-full py-2.5 rounded-lg text-sm font-medium text-accent-foreground flex items-center justify-center gap-2 ${copied ? 'animate-haptic' : ''}`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const Storyboard = ({ scenes }: StoryboardProps) => {
  if (!scenes || scenes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Camera className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Director's Storyboard</h3>
          <p className="text-sm text-muted-foreground">Scene-by-scene production guide</p>
        </div>
      </div>

      {/* Sticky Header - Desktop Only */}
      <div className="hidden md:grid md:grid-cols-[80px_1fr_1fr_1fr] gap-0 glass-card rounded-t-xl sticky top-0 z-10">
        <div className="p-3 text-center border-r border-border/50">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scene</span>
        </div>
        <div className="p-3 border-r border-border/50">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visual & Camera</span>
        </div>
        <div className="p-3 border-r border-border/50">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Audio & SFX</span>
        </div>
        <div className="p-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Video Prompt</span>
        </div>
      </div>

      {/* Scene Cards */}
      <div className="space-y-2 md:space-y-0">
        {scenes.map((scene, index) => (
          <SceneCard key={index} scene={scene} index={index} />
        ))}
      </div>
    </motion.div>
  );
};
