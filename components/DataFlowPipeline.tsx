"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Filter, Zap, Wind, ChevronRight } from "lucide-react";

interface PipelineStep {
  step: string;
  title: string;
  subtitle: string;
  details: string[];
  iconType: string;
}

const pipelineData: PipelineStep[] = [
  {
    step: "01",
    title: "High-Speed Sensing",
    subtitle: "Raw Data Acquisition",
    details: [
      "BMX160 9-axis IMU",
      "DMA-driven I2C communication",
      ">1.5 kHz sampling rate",
      "Zero CPU bottlenecking"
    ],
    iconType: "Sensor"
  },
  {
    step: "02",
    title: "State Estimation",
    subtitle: "Drift Elimination",
    details: [
      "Complementary & Mahony Filters",
      "High-speed sensor fusion",
      "Calculates precise 3D orientation",
      "Outputs Roll, Pitch, and Yaw"
    ],
    iconType: "Filter"
  },
  {
    step: "03",
    title: "Cascaded Control",
    subtitle: "Flight Logic Processing",
    details: [
      "Dual-loop PID architecture",
      "Outer Loop: 250 Hz (Attitude/Angle)",
      "Inner Loop: 1 kHz (Rate/Gyroscopic)",
      "Aggressive error correction"
    ],
    iconType: "Processor"
  },
  {
    step: "04",
    title: "Actuation Matrix",
    subtitle: "Motor Output",
    details: [
      "Custom Motor Mixing Matrix",
      "Translates PID output to PWM",
      "NavHAL-driven GPIO signaling",
      "Independent motor thrust control"
    ],
    iconType: "Propeller"
  }
];

const IconMap: Record<string, React.ReactNode> = {
  Sensor: <Activity size={24} />,
  Filter: <Filter size={24} />,
  Processor: <Cpu size={24} />,
  Propeller: <Wind size={24} />
};

const PipelineNode = ({ data, isHovered, onHover }: { data: PipelineStep, isHovered: boolean, onHover: (hover: boolean) => void }) => {
  return (
    <div 
      className="relative flex flex-col items-center z-10 w-full md:w-64"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Node Circle */}
      <motion.div 
        animate={{
          scale: isHovered ? 1.1 : 1,
          borderColor: isHovered ? "var(--color-accent)" : "rgba(255, 255, 255, 0.1)",
          backgroundColor: isHovered ? "var(--color-dark)" : "var(--color-dark-mid)",
          boxShadow: isHovered ? "0 0 20px rgba(233, 69, 96, 0.3)" : "none"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-white mb-6 cursor-pointer relative"
      >
        {IconMap[data.iconType]}
        <div className="absolute -top-2 -right-2 bg-accent text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white">
          {data.step}
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div 
        animate={{
          y: isHovered ? -5 : 0,
          backgroundColor: isHovered ? "rgba(22, 33, 62, 0.8)" : "transparent",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.1)" : "transparent"
        }}
        className="text-center p-4 rounded-xl border transition-all duration-300 w-full"
      >
        <h4 className="text-white font-sans font-bold text-lg mb-1 leading-tight">{data.title}</h4>
        <p 
          className="text-xs uppercase tracking-widest mb-3 font-mono font-bold"
          style={{ color: 'var(--color-accent)' }}
        >
          {data.subtitle}
        </p>
        
        <AnimatePresence>
          {isHovered && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-left space-y-2 mt-4 pt-4 border-t border-white/5 overflow-hidden"
            >
              {data.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-white/70 text-xs">
                  <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span style={{ color: '#ffffff', opacity: 0.8 }}>{detail}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const DataFlowPipeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full py-24 bg-dark rounded-[40px] px-8 md:px-16 border border-white/5 relative overflow-hidden">
      <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
        {pipelineData.map((stage, idx) => (
          <React.Fragment key={idx}>
            <PipelineNode 
              data={stage} 
              isHovered={hoveredIndex === idx} 
              onHover={(h) => setHoveredIndex(h ? idx : null)}
            />
            {idx < pipelineData.length - 1 && (
              <div className="hidden md:flex items-center justify-center pt-8">
                <ChevronRight className="text-white/20" size={32} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DataFlowPipeline;
