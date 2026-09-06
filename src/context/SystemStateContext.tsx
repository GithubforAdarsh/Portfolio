import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioSynth } from '../utils/audio';

export type SystemStateType = 
  | 'NOMINAL' 
  | 'TRAFFIC_SPIKE' 
  | 'AUTO_SCALING' 
  | 'DEGRADED_FAULT' 
  | 'SELF_HEALING';

interface SystemStateContextProps {
  systemState: SystemStateType;
  setSystemState: (state: SystemStateType) => void;
  latency: number;
  cpuLoad: number;
  activeInstances: number;
  alarmActive: boolean;
  simulateSpike: () => void;
  simulateFailure: () => void;
  recoverSystem: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  diagnosticsHudOpen: boolean;
  setDiagnosticsHudOpen: (open: boolean) => void;
}

const SystemStateContext = createContext<SystemStateContextProps | undefined>(undefined);

export const SystemStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemState, setSystemState] = useState<SystemStateType>('NOMINAL');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [diagnosticsHudOpen, setDiagnosticsHudOpen] = useState<boolean>(false);

  // Derived operational metrics based on system state
  let latency = 18;
  let cpuLoad = 32;
  let activeInstances = 2;
  let alarmActive = false;

  switch (systemState) {
    case 'TRAFFIC_SPIKE':
      latency = 142;
      cpuLoad = 88;
      activeInstances = 2;
      alarmActive = true;
      break;
    case 'AUTO_SCALING':
      latency = 52;
      cpuLoad = 58;
      activeInstances = 4;
      alarmActive = false;
      break;
    case 'DEGRADED_FAULT':
      latency = 118;
      cpuLoad = 64;
      activeInstances = 1; // 1 unhealthy
      alarmActive = true;
      break;
    case 'SELF_HEALING':
      latency = 24;
      cpuLoad = 38;
      activeInstances = 3;
      alarmActive = false;
      break;
    case 'NOMINAL':
    default:
      latency = 18;
      cpuLoad = 32;
      activeInstances = 2;
      alarmActive = false;
      break;
  }

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioSynth.setEnabled(next);
    if (next) {
      audioSynth.playNodeSelect();
    }
  };

  const simulateSpike = () => {
    audioSynth.playAlarmBlip();
    setSystemState('TRAFFIC_SPIKE');
    // Auto-transition to AUTO_SCALING after 3.5s if not manually altered
    setTimeout(() => {
      setSystemState((curr) => (curr === 'TRAFFIC_SPIKE' ? 'AUTO_SCALING' : curr));
      setTimeout(() => {
        setSystemState((curr) => (curr === 'AUTO_SCALING' ? 'NOMINAL' : curr));
        audioSynth.playSuccessChord();
      }, 4000);
    }, 3500);
  };

  const simulateFailure = () => {
    audioSynth.playAlarmBlip();
    setSystemState('DEGRADED_FAULT');
  };

  const recoverSystem = () => {
    audioSynth.playSuccessChord();
    setSystemState('SELF_HEALING');
    setTimeout(() => {
      setSystemState('NOMINAL');
    }, 2500);
  };

  return (
    <SystemStateContext.Provider
      value={{
        systemState,
        setSystemState,
        latency,
        cpuLoad,
        activeInstances,
        alarmActive,
        simulateSpike,
        simulateFailure,
        recoverSystem,
        soundEnabled,
        toggleSound,
        commandPaletteOpen,
        setCommandPaletteOpen,
        diagnosticsHudOpen,
        setDiagnosticsHudOpen,
      }}
    >
      {children}
    </SystemStateContext.Provider>
  );
};

export const useSystemState = () => {
  const context = useContext(SystemStateContext);
  if (!context) {
    throw new Error('useSystemState must be used within a SystemStateProvider');
  }
  return context;
};
