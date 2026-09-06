import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Sliders, 
  Activity, 
  Volume2, 
  VolumeX, 
  Terminal 
} from 'lucide-react';
import { useSystemState, SystemStateType } from '../context/SystemStateContext';
import './SystemStateController.css';

export const SystemStateController: React.FC = () => {
  const { 
    systemState, 
    setSystemState, 
    latency, 
    cpuLoad, 
    activeInstances, 
    simulateSpike, 
    simulateFailure, 
    recoverSystem,
    soundEnabled,
    toggleSound,
    setCommandPaletteOpen
  } = useSystemState();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const getStateColor = (state: SystemStateType) => {
    switch (state) {
      case 'TRAFFIC_SPIKE':
        return 'amber';
      case 'AUTO_SCALING':
        return 'cyan';
      case 'DEGRADED_FAULT':
        return 'alert';
      case 'SELF_HEALING':
        return 'cyan';
      case 'NOMINAL':
      default:
        return 'green';
    }
  };

  return (
    <>
      {/* Scrim backdrop on mobile when expanded */}
      {!collapsed && (
        <div 
          className="controller-mobile-backdrop" 
          onClick={() => setCollapsed(true)} 
          aria-hidden="true" 
        />
      )}

      <aside 
        className={`sys-controller-dock ${collapsed ? 'collapsed' : 'expanded'}`} 
        aria-label="Global Infrastructure Controller"
      >
        <div className="controller-header mono" onClick={() => collapsed && setCollapsed(false)}>
          <div className="header-left">
            <span className={`status-dot ${getStateColor(systemState)} pulse`}></span>
            <span className="controller-title">CHAOS &amp; INFRA</span>
            <span className={`badge badge-${getStateColor(systemState)} mono state-badge`}>
              {systemState}
            </span>
          </div>

        <div className="header-actions">
          <button 
            onClick={toggleSound} 
            className={`icon-btn ${soundEnabled ? 'sound-active' : ''}`}
            title={soundEnabled ? 'Mute Audio' : 'Enable Web Audio Telemetry'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="icon-btn"
            title="Open Command Palette (Ctrl+K)"
            aria-label="Open Command Palette"
          >
            <Terminal size={13} />
          </button>

          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="icon-btn"
            title={collapsed ? 'Expand Controller' : 'Minimize Controller'}
            aria-label="Toggle Controller Collapse"
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="controller-body">
          {/* Real-time Telemetry Metrics */}
          <div className="controller-telemetry mono">
            <div className="telemetry-chip">
              <span className="chip-label">LATENCY:</span>
              <span className={`chip-val text-${getStateColor(systemState)}`}>{latency}ms</span>
            </div>
            <div className="telemetry-chip">
              <span className="chip-label">AVG CPU:</span>
              <span className={`chip-val ${cpuLoad > 70 ? 'text-amber font-bold' : 'text-green'}`}>{cpuLoad}%</span>
            </div>
            <div className="telemetry-chip">
              <span className="chip-label">EC2 FLEET:</span>
              <span className="chip-val text-white">{activeInstances} active</span>
            </div>
          </div>

          {/* Quick Trigger Actions */}
          <div className="controller-buttons-row">
            <button
              onClick={simulateSpike}
              className={`ctrl-btn mono ${systemState === 'TRAFFIC_SPIKE' ? 'active amber' : ''}`}
              title="Simulate sudden traffic surge"
            >
              <Zap size={13} />
              <span>TRAFFIC SPIKE</span>
            </button>

            <button
              onClick={() => setSystemState('AUTO_SCALING')}
              className={`ctrl-btn mono ${systemState === 'AUTO_SCALING' ? 'active cyan' : ''}`}
              title="Trigger Auto Scaling out"
            >
              <Activity size={13} />
              <span>SCALE FLEET</span>
            </button>

            <button
              onClick={simulateFailure}
              className={`ctrl-btn mono ${systemState === 'DEGRADED_FAULT' ? 'active alert' : ''}`}
              title="Inject target instance failure"
            >
              <AlertTriangle size={13} />
              <span>INJECT FAULT</span>
            </button>

            <button
              onClick={recoverSystem}
              className={`ctrl-btn mono ${systemState === 'NOMINAL' ? 'active green' : ''}`}
              title="Restore healthy nominal state"
            >
              <RefreshCw size={13} />
              <span>RESET NOMINAL</span>
            </button>
          </div>
        </div>
      )}
      </aside>
    </>
  );
};
