import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Cpu, 
  Server, 
  Network, 
  Activity, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  ShieldAlert, 
  Mail, 
  X,
  Play,
  Terminal,
  Code
} from 'lucide-react';
import { useSystemState } from '../context/SystemStateContext';
import { audioSynth } from '../utils/audio';
import './CloudSimulators.css';

export const CloudSimulators: React.FC = () => {
  const { 
    systemState, 
    setSystemState, 
    simulateSpike: globalSimulateSpike, 
    simulateFailure: globalSimulateFailure, 
    recoverSystem: globalRecoverSystem 
  } = useSystemState();

  const [activeLab, setActiveLab] = useState<'asg' | 'alb' | 'cloudwatch'>('asg');

  // ASG Simulator State
  const [requestLoad, setRequestLoad] = useState<number>(800);
  const [asgInstances, setAsgInstances] = useState<number>(2);
  const [isScaling, setIsScaling] = useState<boolean>(false);
  const [scaleLog, setScaleLog] = useState<string>('System nominal. 2 EC2 instances handling load.');
  const [inspectedInstance, setInspectedInstance] = useState<number | null>(null);

  // Calculate simulated CPU based on load and instance count
  const cpuPerInstance = Math.min(100, Math.round((requestLoad / (asgInstances * 750)) * 100));

  useEffect(() => {
    if (cpuPerInstance > 72 && asgInstances < 4 && !isScaling) {
      setIsScaling(true);
      setScaleLog('THRESHOLD BREACHED: Average CPU > 70%. Auto Scaling policy triggered.');
      audioSynth.playAlarmBlip();
      const timer = setTimeout(() => {
        setAsgInstances(4);
        setIsScaling(false);
        audioSynth.playSuccessChord();
        setScaleLog('SCALE-OUT COMPLETE: 2 new EC2 instances bootstrapped via Launch Template. Fleet stabilized.');
      }, 1600);
      return () => clearTimeout(timer);
    } else if (cpuPerInstance < 35 && asgInstances > 2 && !isScaling) {
      setScaleLog('Low demand detected. Auto Scaling cooldown active.');
    }
  }, [cpuPerInstance, asgInstances, isScaling]);

  const triggerSpike = () => {
    setRequestLoad(3600);
    globalSimulateSpike();
  };

  const resetFleet = () => {
    setRequestLoad(800);
    setAsgInstances(2);
    setScaleLog('Fleet reset to baseline: 2 EC2 instances, 800 req/s.');
    globalRecoverSystem();
  };

  // ALB Simulator State
  const [routingAlgorithm, setRoutingAlgorithm] = useState<'round_robin' | 'least_outstanding' | 'path_based'>('round_robin');
  const [targets, setTargets] = useState<
    { id: string; name: string; status: 'healthy' | 'unhealthy'; requestsHandled: number }[]
  >([
    { id: 't1', name: 'EC2 Target A (ap-south-1a)', status: 'healthy', requestsHandled: 142 },
    { id: 't2', name: 'EC2 Target B (ap-south-1b)', status: 'healthy', requestsHandled: 139 },
    { id: 't3', name: 'EC2 Target C (ap-south-1a)', status: 'healthy', requestsHandled: 145 },
  ]);
  const [albRoutingLog, setAlbRoutingLog] = useState<string>(
    'ALB Target Group active. Traffic evenly balanced across 3 healthy instances.'
  );

  const toggleTargetFailure = (id: string) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'healthy' ? 'unhealthy' : 'healthy';
          if (newStatus === 'unhealthy') {
            audioSynth.playAlarmBlip();
            globalSimulateFailure();
            setAlbRoutingLog(
              `FAULT DETECTED on ${t.name}: Health check failed (HTTP 500). ALB immediately removed target from routing table. 0 dropped packets.`
            );
          } else {
            audioSynth.playSuccessChord();
            globalRecoverSystem();
            setAlbRoutingLog(
              `TARGET RECOVERED: ${t.name} passed 2 consecutive health checks. Re-enrolled in active rotation.`
            );
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // CloudWatch Simulator State
  const [cwCpuThreshold, setCwCpuThreshold] = useState<number>(75);
  const [simulatedCpu, setSimulatedCpu] = useState<number>(45);
  const [alarmState, setAlarmState] = useState<'OK' | 'ALARM'>('OK');
  const [showSnsModal, setShowSnsModal] = useState<boolean>(false);
  const [snsPayload, setSnsPayload] = useState<any>(null);

  const triggerMetricSpike = (scenario: string = 'High CPU') => {
    setSimulatedCpu(88);
    setAlarmState('ALARM');
    audioSynth.playAlarmBlip();
    const payload = {
      AlarmName: `High-EC2-${scenario.replace(/\s+/g, '')}-Prod`,
      NewStateValue: 'ALARM',
      Reason: `Threshold Breached: 1 datapoint [88.4%] was greater than threshold [${cwCpuThreshold}.0%]`,
      Timestamp: new Date().toISOString(),
      AWSAccountId: 'AWS-VERIFIED-CANDIDATE',
      Region: 'ap-south-1',
      TopicArn: 'arn:aws:sns:ap-south-1:123456789:CloudWatch-Critical-Alerts',
      Recipient: 'adarsh200004@gmail.com',
    };
    setSnsPayload(payload);
    setShowSnsModal(true);
  };

  const resetAlarm = () => {
    setSimulatedCpu(42);
    setAlarmState('OK');
    setShowSnsModal(false);
    audioSynth.playSuccessChord();
  };

  return (
    <section id="simulators" className="simulators-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <span className="dot"></span>
            <span>INTERACTIVE CLOUD LABS // LIVE BEHAVIORAL SIMULATIONS</span>
          </div>
          <h2 className="section-title">AWS Engineering Simulators</h2>
          <p className="section-description">
            Test and observe the dynamic cloud infrastructure patterns implemented by Adarsh. 
            Directly manipulate traffic, inject failures, and trigger proactive alerting pipelines.
          </p>
        </div>

        {/* Simulator Tabs */}
        <div className="sim-nav-bar mono" role="tablist">
          <button
            onClick={() => {
              setActiveLab('asg');
              audioSynth.playNodeSelect();
            }}
            className={`sim-nav-tab ${activeLab === 'asg' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeLab === 'asg'}
          >
            <Cpu size={16} />
            <span>01. AUTO SCALING GROUP (ASG)</span>
          </button>

          <button
            onClick={() => {
              setActiveLab('alb');
              audioSynth.playNodeSelect();
            }}
            className={`sim-nav-tab ${activeLab === 'alb' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeLab === 'alb'}
          >
            <Network size={16} />
            <span>02. LOAD BALANCER &amp; FAILOVER</span>
          </button>

          <button
            onClick={() => {
              setActiveLab('cloudwatch');
              audioSynth.playNodeSelect();
            }}
            className={`sim-nav-tab ${activeLab === 'cloudwatch' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeLab === 'cloudwatch'}
          >
            <Activity size={16} />
            <span>03. CLOUDWATCH &amp; SNS ALERTING</span>
          </button>
        </div>

        {/* LAB 1: AUTO SCALING SIMULATOR */}
        {activeLab === 'asg' && (
          <div className="sim-content-card infra-card">
            <div className="sim-header">
              <div>
                <div className="sim-tag mono text-cyan">EXPERIMENT // DYNAMIC TARGET TRACKING SCALING</div>
                <h3 className="sim-heading">AWS Auto Scaling Group in Action</h3>
                <p className="sim-text">
                  Demonstrates Adarsh&apos;s implementation of EC2 Auto Scaling Groups with Launch Templates and 
                  CloudWatch alarms. When traffic surges push CPU utilization above 70%, the ASG provisions new instances 
                  automatically with automated bash User Data bootstrapping.
                </p>
              </div>
              <div className="sim-actions-top">
                <button onClick={triggerSpike} className="btn btn-primary mono btn-sm">
                  <Zap size={14} />
                  <span>SIMULATE TRAFFIC SPIKE</span>
                </button>
                <button onClick={resetFleet} className="btn btn-secondary mono btn-sm">
                  <RefreshCw size={14} />
                  <span>RESET FLEET</span>
                </button>
              </div>
            </div>

            <div className="asg-dashboard-grid">
              {/* Controls Column */}
              <div className="asg-controls-box">
                <div className="control-group">
                  <div className="control-label-row mono">
                    <span>INCOMING REQUEST LOAD:</span>
                    <span className="text-cyan font-bold">{requestLoad} req/s</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="4500"
                    step="100"
                    value={requestLoad}
                    onChange={(e) => setRequestLoad(Number(e.target.value))}
                    className="slider-input"
                    aria-label="Request Load Slider"
                  />
                  <div className="slider-limits mono">
                    <span>200 req/s (Base)</span>
                    <span>4500 req/s (Heavy Surge)</span>
                  </div>
                </div>

                {/* Metrics Gauges */}
                <div className="asg-gauges-row">
                  <div className="gauge-card">
                    <div className="gauge-label mono">FLEET SIZE:</div>
                    <div className="gauge-val mono text-cyan">{asgInstances} EC2 Instances</div>
                    <div className="gauge-meta mono">Min: 2 // Max: 4</div>
                  </div>

                  <div className="gauge-card">
                    <div className="gauge-label mono">AVG CPU UTILIZATION:</div>
                    <div className={`gauge-val mono ${cpuPerInstance > 70 ? 'text-amber' : 'text-green'}`}>
                      {cpuPerInstance}%
                    </div>
                    <div className="gauge-meta mono">Scale Trigger: &gt; 70%</div>
                  </div>
                </div>

                {/* Status Log */}
                <div className="asg-log-box mono">
                  <div className="log-title">
                    <span className="log-dot pulse"></span>
                    <span>ASG CONTROLLER LOG:</span>
                  </div>
                  <p className="log-text">{scaleLog}</p>
                </div>
              </div>

              {/* Instances Visualization Column */}
              <div className="asg-fleet-view">
                <div className="fleet-view-header mono">
                  <span>ACTIVE EC2 FLEET (MULTI-AZ: ap-south-1a &amp; ap-south-1b)</span>
                  {isScaling && <span className="badge badge-amber">PROVISIONING INSTANCES...</span>}
                </div>

                <div className="instances-grid">
                  {Array.from({ length: asgInstances }).map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setInspectedInstance(i)}
                      className={`ec2-fleet-card infra-card ${inspectedInstance === i ? 'inspected' : ''}`}
                      title="Click to view User Data Bootstrapping script"
                    >
                      <div className="fleet-card-header mono">
                        <Server size={18} className="text-green" />
                        <span className="instance-id">i-0a{i}49b2c8{i}</span>
                        <span className="status-badge-mini text-green">ONLINE</span>
                      </div>
                      <div className="fleet-card-body mono">
                        <div className="param-row">
                          <span>Role:</span>
                          <span className="text-white">Node.js App</span>
                        </div>
                        <div className="param-row">
                          <span>Subnet:</span>
                          <span>{i % 2 === 0 ? 'ap-south-1a' : 'ap-south-1b'}</span>
                        </div>
                        <div className="param-row">
                          <span>CPU Load:</span>
                          <span className={cpuPerInstance > 70 ? 'text-amber' : 'text-green'}>
                            {cpuPerInstance}%
                          </span>
                        </div>
                      </div>
                      <div className="fleet-card-track">
                        <div
                          className={`fleet-card-fill ${cpuPerInstance > 70 ? 'bg-amber' : 'bg-green'}`}
                          style={{ width: `${Math.min(100, cpuPerInstance)}%` }}
                        ></div>
                      </div>
                      <div className="inspect-hint mono">CLICK: VIEW BOOTSTRAP SCRIPT</div>
                    </div>
                  ))}
                </div>

                {/* User Data Bootstrapping Script Modal / Drawer */}
                {inspectedInstance !== null && (
                  <div className="bootstrap-terminal infra-card mono">
                    <div className="terminal-top-row">
                      <div className="term-left">
                        <Terminal size={14} className="text-cyan" />
                        <span>EC2 LAUNCH TEMPLATE USER-DATA // i-0a{inspectedInstance}49b2c8{inspectedInstance}</span>
                      </div>
                      <button onClick={() => setInspectedInstance(null)} className="btn-close-term">[CLOSE]</button>
                    </div>
                    <div className="terminal-code">
                      <div>#!/bin/bash</div>
                      <div>echo &quot;[cloud-init] Initializing instance setup...&quot;</div>
                      <div>yum update -y</div>
                      <div>curl -sL https://rpm.nodesource.com/setup_20.x | bash -</div>
                      <div>yum install -y nodejs git</div>
                      <div>git clone https://github.com/GithubforAdarsh/Portfolio.git /var/app</div>
                      <div>cd /var/app &amp;&amp; npm install --production</div>
                      <div>PORT=3000 node server.js &amp;</div>
                      <div>curl -f http://localhost:3000/health || exit 1</div>
                      <div className="text-green">echo &quot;[cloud-init] Bootstrapping complete. Reporting healthy to ALB Target Group.&quot;</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LAB 2: LOAD BALANCER & FAULT INJECTION */}
        {activeLab === 'alb' && (
          <div className="sim-content-card infra-card">
            <div className="sim-header">
              <div>
                <div className="sim-tag mono text-cyan">EXPERIMENT // HIGH AVAILABILITY &amp; HEALTH CHECKS</div>
                <h3 className="sim-heading">Application Load Balancer (ALB) Fault Injection</h3>
                <p className="sim-text">
                  Observe how the AWS Application Load Balancer distributes HTTP requests and performs automated health 
                  checks. Click on any target to inject an outage and verify zero-downtime traffic rerouting.
                </p>
              </div>

              {/* Algorithm Switcher */}
              <div className="alb-algos-wrap mono">
                <span className="algo-label">ALB ALGORITHM:</span>
                <div className="algo-pills">
                  <button
                    onClick={() => setRoutingAlgorithm('round_robin')}
                    className={`algo-pill ${routingAlgorithm === 'round_robin' ? 'active' : ''}`}
                  >
                    Round Robin
                  </button>
                  <button
                    onClick={() => setRoutingAlgorithm('least_outstanding')}
                    className={`algo-pill ${routingAlgorithm === 'least_outstanding' ? 'active' : ''}`}
                  >
                    Least Outstanding
                  </button>
                  <button
                    onClick={() => setRoutingAlgorithm('path_based')}
                    className={`algo-pill ${routingAlgorithm === 'path_based' ? 'active' : ''}`}
                  >
                    Path-Based (/api)
                  </button>
                </div>
              </div>
            </div>

            <div className="alb-dashboard">
              {/* ALB Ingress Node */}
              <div className="alb-ingress-box mono">
                <Network size={24} className="text-cyan" />
                <div>
                  <div className="alb-name">AWS Application Load Balancer (Layer 7)</div>
                  <div className="alb-meta">Algorithm: {routingAlgorithm.toUpperCase().replace('_', ' ')} // Path: /health (30s)</div>
                </div>
                <div className="badge badge-cyan">PORT 80/443</div>
              </div>

              {/* Traffic Flow Indicator */}
              <div className="alb-flow-lines mono">
                <span>INCOMING TRAFFIC (DISTRIBUTED TO HEALTHY TARGETS)</span>
              </div>

              {/* Target Group Cards */}
              <div className="alb-targets-grid">
                {targets.map((t) => (
                  <div 
                    key={t.id} 
                    className={`target-card infra-card ${t.status === 'unhealthy' ? 'target-unhealthy' : ''}`}
                  >
                    <div className="target-top mono">
                      <Server size={20} className={t.status === 'healthy' ? 'text-green' : 'text-alert'} />
                      <span className={`badge ${t.status === 'healthy' ? 'badge-green' : 'badge-alert'} mono`}>
                        {t.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="target-title">{t.name}</div>
                    <div className="target-meta mono">
                      <div>Port: 3000 (Node.js)</div>
                      <div>Total Routed: {t.status === 'healthy' ? `${t.requestsHandled} reqs` : '0 (DRAINED)'}</div>
                    </div>

                    <button
                      onClick={() => toggleTargetFailure(t.id)}
                      className={`btn mono btn-sm w-full ${
                        t.status === 'healthy' ? 'btn-outline-alert' : 'btn-primary'
                      }`}
                    >
                      {t.status === 'healthy' ? 'INJECT OUTAGE (HTTP 500)' : 'RESTORE TARGET (HEALTHY)'}
                    </button>
                  </div>
                ))}
              </div>

              {/* ALB Controller Log */}
              <div className="asg-log-box mono">
                <div className="log-title">
                  <span className="log-dot pulse"></span>
                  <span>ALB TARGET GROUP CONTROLLER:</span>
                </div>
                <p className="log-text">{albRoutingLog}</p>
              </div>
            </div>
          </div>
        )}

        {/* LAB 3: CLOUDWATCH METRICS & SNS ALERTING */}
        {activeLab === 'cloudwatch' && (
          <div className="sim-content-card infra-card">
            <div className="sim-header">
              <div>
                <div className="sim-tag mono text-amber">EXPERIMENT // OBSERVABILITY &amp; INCIDENT NOTIFICATION</div>
                <h3 className="sim-heading">Amazon CloudWatch + SNS Alerting Pipeline</h3>
                <p className="sim-text">
                  Configured dashboards and automated metric alarms. When instance metrics breach predefined thresholds, 
                  CloudWatch triggers an SNS topic fan-out dispatching instantaneous notifications to engineers.
                </p>
              </div>
              <div className="sim-actions-top">
                <button onClick={() => triggerMetricSpike('High CPU')} className="btn btn-primary mono btn-sm">
                  <AlertTriangle size={14} />
                  <span>TRIGGER THRESHOLD BREACH</span>
                </button>
                <button onClick={resetAlarm} className="btn btn-secondary mono btn-sm">
                  <RefreshCw size={14} />
                  <span>RESET ALARM</span>
                </button>
              </div>
            </div>

            <div className="cw-dashboard-grid">
              {/* Left: Metric Configuration & Alarm Status */}
              <div className="cw-panel-left">
                <div className="alarm-status-box">
                  <div className="alarm-header mono">
                    <span>ALARM STATUS: High-EC2-CPUUtilization-Prod</span>
                    <span className={`badge ${alarmState === 'OK' ? 'badge-green' : 'badge-amber'} mono`}>
                      {alarmState}
                    </span>
                  </div>
                  <div className="alarm-detail mono">
                    <div>Metric: EC2 &gt; CPUUtilization</div>
                    <div>Threshold: &gt; {cwCpuThreshold}% for 1 consecutive period</div>
                    <div>Current Reading: <span className={simulatedCpu > cwCpuThreshold ? 'text-amber font-bold' : 'text-green'}>{simulatedCpu}%</span></div>
                  </div>
                </div>

                <div className="control-group">
                  <div className="control-label-row mono">
                    <span>ALARM TRIGGER THRESHOLD:</span>
                    <span className="text-amber font-bold">{cwCpuThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={cwCpuThreshold}
                    onChange={(e) => setCwCpuThreshold(Number(e.target.value))}
                    className="slider-input"
                    aria-label="CloudWatch CPU Threshold"
                  />
                </div>

                <div className="sns-subscribers-box mono">
                  <div className="sub-title">
                    <Bell size={14} className="text-amber" />
                    <span>SNS TOPIC SUBSCRIPTIONS:</span>
                  </div>
                  <div className="sub-item">
                    <Mail size={13} className="text-cyan" />
                    <span>Email: adarsh200004@gmail.com [CONFIRMED]</span>
                  </div>
                  <div className="sub-item">
                    <Activity size={13} className="text-green" />
                    <span>Action: Trigger Auto Scaling Policy [ACTIVE]</span>
                  </div>
                </div>
              </div>

              {/* Right: Metric Graph Visualization */}
              <div className="cw-panel-right">
                <div className="graph-header mono">
                  <span>METRIC: CPUUtilization (Percent) // 5-MINUTE WINDOW</span>
                  <span className="text-cyan">ap-south-1</span>
                </div>

                <div className="simulated-chart-container">
                  {/* SVG Metric Line */}
                  <svg className="cw-chart-svg" viewBox="0 0 500 160" preserveAspectRatio="none">
                    {/* Threshold Line */}
                    <line
                      x1="0"
                      y1={160 - (cwCpuThreshold / 100) * 140}
                      x2="500"
                      y2={160 - (cwCpuThreshold / 100) * 140}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="420"
                      y={154 - (cwCpuThreshold / 100) * 140}
                      fill="#f59e0b"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                    >
                      Threshold {cwCpuThreshold}%
                    </text>

                    {/* Metric Curve */}
                    <path
                      d={
                        simulatedCpu > cwCpuThreshold
                          ? 'M 0,110 Q 100,105 180,95 T 320,60 T 420,25 L 500,25'
                          : 'M 0,110 Q 120,115 220,105 T 350,110 T 500,105'
                      }
                      fill="none"
                      stroke={simulatedCpu > cwCpuThreshold ? '#f59e0b' : '#00f0ff'}
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                <div className="chart-legend mono">
                  <span>T-5m</span>
                  <span>T-4m</span>
                  <span>T-3m</span>
                  <span>T-2m</span>
                  <span>T-1m</span>
                  <span className="text-cyan">NOW</span>
                </div>
              </div>
            </div>

            {/* SNS Email Alert Preview Modal */}
            {showSnsModal && snsPayload && (
              <div className="sns-modal-overlay" role="dialog" aria-modal="true">
                <div className="sns-modal-card infra-card">
                  <div className="sns-modal-header mono">
                    <div className="sns-modal-title">
                      <Mail size={16} className="text-amber" />
                      <span>AWS SNS NOTIFICATION DISPATCHED</span>
                    </div>
                    <button onClick={() => setShowSnsModal(false)} aria-label="Close alert modal">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="sns-modal-body mono">
                    <p className="sns-alert-intro">
                      Amazon CloudWatch Alarm <strong>&ldquo;High-EC2-CPUUtilization-Prod&rdquo;</strong> in <strong>ap-south-1</strong> has entered the <strong>ALARM</strong> state.
                    </p>
                    <div className="sns-json-block">
                      <pre>{JSON.stringify(snsPayload, null, 2)}</pre>
                    </div>
                  </div>
                  <div className="sns-modal-footer">
                    <button onClick={() => setShowSnsModal(false)} className="btn btn-primary mono btn-sm">
                      ACKNOWLEDGE ALARM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
