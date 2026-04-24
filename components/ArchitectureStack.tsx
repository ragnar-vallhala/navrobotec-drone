"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Layers, Navigation, Zap, Shield, Microchip, Activity, Move, Zap as ZapIcon, Target, Cpu as CpuIcon, Database } from "lucide-react";

interface CardData {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface LayerData {
  layer: string;
  cards: CardData[];
}

const architectureData: LayerData[] = [
  {
    layer: "Physical Hardware",
    cards: [
      { title: "Core Processing", description: "STM32F401RE ARM Cortex-M4 at 84 MHz with hardware FPU.", icon: <CpuIcon size={20} /> },
      { title: "Sensor Suite", description: "BMX160 9-axis IMU, sampled at >1.5 kHz.", icon: <Activity size={20} /> },
      { title: "High-Speed I/O", description: "DMA-driven I2C loops eliminating CPU bottlenecks.", icon: <Zap size={20} /> },
      { title: "Hardware Extensibility", description: "Scalable to STM32H7 or AVR platforms.", icon: <Microchip size={20} /> }
    ]
  },
  {
    layer: "NavHAL (Hardware Abstraction)",
    cards: [
      { title: "Zero-Cost Abstraction", description: "5 clock cycles per GPIO toggle, matching raw register speed.", icon: <ZapIcon size={20} /> },
      { title: "Hardware Independence", description: "Decouples software logic from specific microcontrollers.", icon: <Shield size={20} /> },
      { title: "Register-Level Efficiency", description: "Bypasses bloated frameworks for maximum efficiency.", icon: <Database size={20} /> },
      { title: "Seamless Portability", description: "Migrate the flight stack without rewriting control logic.", icon: <Move size={20} /> }
    ]
  },
  {
    layer: "VAIOS (RTOS)",
    cards: [
      { title: "Deterministic Execution", description: "Custom preemptive kernel for critical flight tasks.", icon: <Target size={20} /> },
      { title: "Bounded Latency", description: "Worst-case latency of 41 cycles under interrupt.", icon: <Activity size={20} /> },
      { title: "Rapid Context Switching", description: "Up to 3,773 context switches per second.", icon: <ZapIcon size={20} /> },
      { title: "Decoupled Processing", description: "Isolates hardware communication from control logic.", icon: <Layers size={20} /> }
    ]
  },
  {
    layer: "Vayu (Flight Control)",
    cards: [
      { title: "Cascaded PID Control", description: "250 Hz outer angle loop, 1 kHz inner rate loop.", icon: <Navigation size={20} /> },
      { title: "Advanced Estimation", description: "Complementary and Mahony filters for 3D orientation.", icon: <Activity size={20} /> },
      { title: "State-Aware Fail-Safety", description: "Built-in fault-handling and stable recovery mechanisms.", icon: <Shield size={20} /> },
      { title: "Autonomous Roadmap", description: "Extensible for GPS, EKF, and multi-vehicle coordination.", icon: <Navigation size={20} /> }
    ]
  }
];

const ArchitectureCard = ({ card }: { card: CardData }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        borderColor: isHovered ? "rgba(233, 69, 96, 0.5)" : "rgba(255, 255, 255, 0.05)",
        backgroundColor: "var(--color-dark-mid)",
        boxShadow: isHovered ? "0 15px 40px rgba(0, 0, 0, 0.2)" : "0 5px 15px rgba(0, 0, 0, 0.05)"
      }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl border cursor-pointer group relative overflow-hidden min-h-[120px] flex flex-col justify-center"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            color: isHovered ? "var(--color-accent)" : "rgba(255, 255, 255, 0.5)"
          }}
          transition={{ duration: 0.3 }}
          className="transition-colors pt-1"
        >
          {card.icon}
        </motion.div>
        <div className="flex-1">
          <motion.h4 
            animate={{ color: isHovered ? "var(--color-accent)" : "#ffffff" }}
            className="font-sans font-bold text-lg leading-tight text-white"
          >
            {card.title}
          </motion.h4>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#ffffff', opacity: 0.8 }}
                >
                  {card.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureStack = () => {
  return (
    <div className="w-full space-y-16 py-12">
      {architectureData.map((layer, idx) => (
        <div key={idx} className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-dark font-sans font-extrabold text-2xl tracking-tighter uppercase opacity-90">
              {layer.layer}
            </h3>
            <div className="h-[1px] flex-1 bg-linear-to-r from-dark/20 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {layer.cards.map((card, cardIdx) => (
              <ArchitectureCard key={cardIdx} card={card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchitectureStack;
