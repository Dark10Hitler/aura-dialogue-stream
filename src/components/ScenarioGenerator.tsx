import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { generateScenario } from '@/lib/scenarioApi';
import { BalanceHeader } from './BalanceHeader';
import { ScenarioResult } from './ScenarioResult';
import { NeuralProgress } from './NeuralProgress';
import { PricingModal } from './PricingModal';
import { HookMatrix } from './HookMatrix';
import { Storyboard } from './Storyboard';
import { useToast } from '@/hooks/use-toast';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';

interface ScenarioGeneratorProps {
  userId: string;
  onShowRecovery: () => void;
}

// Mock data parser - in real scenario, AI would return structured data
const parseAIResponse = (content: string) => {
  // This would parse AI response to extract hooks and scenes
  // For now, returning mock data to demonstrate UI
  const hooks = [
    {
      title: 'The Shock Opener',
      hook: 'What if I told you everything you know about this is wrong?',
      retentionScore: 89,
      badges: ['conversion', 'pattern'] as const,
    },
    {
      title: 'The Question Hook',
      hook: 'Have you ever wondered why successful people all share this one habit?',
      retentionScore: 76,
      badges: ['emotional', 'conversion'] as const,
    },
    {
      title: 'The Story Start',
      hook: 'Last week, something happened that changed my entire perspective...',
      retentionScore: 82,
      badges: ['emotional', 'pattern'] as const,
    },
  ];

  const scenes = [
    {
      scene: 1,
      visual: 'Close-up face shot, eyes widen with realization. Natural lighting, slight camera push-in.',
      audio: '"What if I told you..." (whispered, building tension)',
      aiPrompt: 'Cinematic close-up of person with shocked expression, natural window lighting, slight lens flare, 4K quality',
    },
    {
      scene: 2,
      visual: 'B-roll montage: fast cuts of success symbols (laptop, coffee, sunrise). Dynamic camera movements.',
      audio: 'Upbeat electronic music, subtle bass drop on transition',
      aiPrompt: 'Fast-paced montage of modern workspace, MacBook, artisan coffee, golden hour light streaming through windows',
    },
    {
      scene: 3,
      visual: 'Medium shot, direct to camera. Clean background, ring light reflection in eyes.',
      audio: 'Direct address voiceover, confident tone, slight reverb',
      aiPrompt: 'Professional content creator speaking to camera, clean minimal background, ring light catchlights, YouTube studio aesthetic',
    },
  ];

  return { hooks, scenes, hasStructuredData: content.includes('#') || content.length > 200 };
};

export const ScenarioGenerator = ({ userId, onShowRecovery }: ScenarioGeneratorProps) => {
  const { balance, isLoading: balanceLoading, fetchBalance } = useBalanceContext();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{ hooks: any[]; scenes: any[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationColdStart, setGenerationColdStart] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { placeholder, isVisible } = useRotatingPlaceholder();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please enter a scenario description.',
        variant: 'destructive',
      });
      return;
    }

    if (balance === 0) {
      setShowPricing(true);
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setParsedData(null);
    setGenerationColdStart(false);

    const coldStartTimer = setTimeout(() => {
      setGenerationColdStart(true);
    }, 5000);

    try {
      console.log('Starting generation for user:', userId);
      const response = await generateScenario(userId, prompt);
      console.log('Generation response:', response);
      
      if (response.error === 'Insufficient balance') {
        setShowPricing(true);
        return;
      }
      
      const content = response.script || response.result || response.scenario || response.content || '';
      console.log('Setting result content:', content.substring(0, 100) + '...');
      setResult(content);
      
      // Parse for structured data (hooks, scenes)
      const parsed = parseAIResponse(content);
      if (parsed.hasStructuredData) {
        setParsedData({ hooks: parsed.hooks, scenes: parsed.scenes });
      }
      
      await fetchBalance();
    } catch (error: any) {
      console.error('Generation error:', error);
      
      if (error.status === 403) {
        setShowPricing(true);
        toast({
          title: 'Insufficient Credits',
          description: 'Please top up your balance to continue generating scripts.',
          variant: 'destructive',
        });
        return;
      }
      
      if (error.status === 500) {
        toast({
          title: 'Server Error',
          description: error.serverMessage || error.message || 'Server error occurred. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Generation Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      clearTimeout(coldStartTimer);
      setIsGenerating(false);
      setGenerationColdStart(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Script copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            AI Script <span className="text-primary neon-text">Generator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Create viral scripts powered by <span className="text-accent neon-text-cyan">Claude 3.5 Sonnet</span>
          </p>
        </motion.div>

        {/* Balance Header */}
        <BalanceHeader
          userId={userId}
          onRefresh={fetchBalance}
          onTopUp={() => setShowPricing(true)}
          onShowRecovery={onShowRecovery}
        />

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-elevated rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-3 tracking-wide">
            Describe your script idea
          </label>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className={`w-full h-40 md:h-48 p-4 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                opacity: prompt ? 1 : isVisible ? 0.7 : 0.4,
              }}
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {prompt.length > 0 && (
                <span className="font-mono">{prompt.length} characters</span>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="glow-button flex items-center gap-2 px-8 py-3 rounded-xl text-primary-foreground font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {/* Low balance warning */}
          {balance === 0 && !balanceLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">No credits available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Top Up" to add credits and continue generating scripts.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Neural Processing Animation */}
        {isGenerating && (
          <NeuralProgress isColdStart={generationColdStart} />
        )}

        {/* Parsed Structured Data - Hook Matrix */}
        {parsedData && parsedData.hooks.length > 0 && (
          <HookMatrix hooks={parsedData.hooks} />
        )}

        {/* Parsed Structured Data - Storyboard */}
        {parsedData && parsedData.scenes.length > 0 && (
          <Storyboard scenes={parsedData.scenes} />
        )}

        {/* Result with Copy Button */}
        {result && (
          <div className="relative mt-6">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCopy}
              className={`absolute top-10 right-8 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-sm font-medium transition-all ${copied ? 'animate-haptic' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-neon-emerald" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <ScenarioResult content={result} />
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        userId={userId}
      />
    </div>
  );
};
