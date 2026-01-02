import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep slate/charcoal base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Aurora layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary neon cyan aurora */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(185 100% 50% / 0.12), transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.4, 0.6, 0.5, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary purple aurora - more subtle */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[50vw] h-[50vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(270 80% 60% / 0.06), transparent 70%)",
            filter: "blur(120px)",
          }}
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.1, 1],
            opacity: [0.2, 0.4, 0.3, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Tertiary cyan glow at bottom */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(185 100% 50% / 0.08), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.05, 0.98, 1],
            opacity: [0.15, 0.25, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(185 100% 50%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(185 100% 50%) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* Vignette effect - deeper */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 10%, hsl(220 20% 6%) 100%)",
        }}
      />
    </div>
  );
};

export default AuroraBackground;
