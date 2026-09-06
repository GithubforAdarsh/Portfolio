import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Server, 
  Database, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Layers, 
  Info, 
  CheckCircle2, 
  ArrowDown, 
  Cpu, 
  HardDrive,
  Lock,
  Workflow,
  Zap,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useSystemState } from '../context/SystemStateContext';
import { audioSynth } from '../utils/audio';
import './ArchitectureMap.css';

interface ArchitectureNode {
  id: string;
  name: string;
  category: 'Edge' | 'Ingress' | 'Compute' | 'Database' | 'Monitoring' | 'Security';
  tier: 'Public Subnet' | 'Private Subnet' | 'Database Subnet' | 'Global AWS Service';
  icon: any;
  status: 'ONLINE' | 'ACTIVE' | 'STANDBY';
  summary: string;
  securityDetails: string;
  scalabilityDetails: string;
  resumeEvidence: string;
  specs: { [key: string]: string };
}

type TopologyMode = '3TIER' | 'AI_PLATFORM' | 'SERVERLESS';

export const ArchitectureMap: React.FC = () => {
  const { systemState, latency, cpuLoad, activeInstances, alarmActive } = useSystemState();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('alb');
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [topologyMode, setTopologyMode] = useState<TopologyMode>('3TIER');
  const [tracingRequest, setTracingRequest] = useState<boolean>(false);
  const [traceStep, setTraceStep] = useState<number>(0);

  const nodes: Record<string, ArchitectureNode> = {
    alb: {
      id: 'alb',
      name: 'Application Load Balancer (ALB)',
      category: 'Ingress',
      tier: 'Public Subnet',
      icon: Network,
      status: 'ACTIVE',
      summary: 'Public entry point distributing HTTP/HTTPS requests evenly across healthy EC2 targets in multiple Availability Zones.',
      securityDetails: 'Public Subnet ingress on Port 80/443; egress strictly allowed to EC2 Security Group on Port 3000.',
      scalabilityDetails: 'Integrated with Auto Scaling Group to register/deregister instances dynamically with zero downtime.',
      resumeEvidence: 'Configured Application Load Balancers (ALB) to distribute traffic across multiple EC2 instances, minimizing downtime during traffic spikes.',
      specs: {
        'Subnet': 'Public (ap-south-1a, ap-south-1b)',
        'Health Check': 'HTTP /health (interval: 30s)',
        'Algorithm': 'Round Robin / Least Outstanding',
        'SSL/TLS': 'ACM Managed Certificate',
      },
    },
    asg: {
      id: 'asg',
      name: 'EC2 Auto Scaling Group (ASG)',
      category: 'Compute',
      tier: 'Private Subnet',
      icon: Cpu,
      status: 'ACTIVE',
      summary: 'Maintains desired fleet of stateless Node.js compute instances across Availability Zones, dynamically adapting to load.',
      securityDetails: 'Private Subnet with no public IP; only accepts inbound HTTP from ALB Security Group on Port 3000.',
      scalabilityDetails: 'Dynamic target-tracking scaling policy based on CPU utilization > 70%; automatic instance recycling and replacement.',
      resumeEvidence: 'Configured Auto Scaling Groups (ASGs) with Launch Templates and User Data scripts for seamless automated bootstrapping.',
      specs: {
        'Min / Max Capacity': '2 / 4 Instances',
        'Subnet': 'Private App Subnets (Multi-AZ)',
        'Runtime': 'Node.js / Express Application',
        'Bootstrapping': 'Automated EC2 User Data script',
      },
    },
    ec2_1: {
      id: 'ec2_1',
      name: 'EC2 Instance #1 (Node.js)',
      category: 'Compute',
      tier: 'Private Subnet',
      icon: Server,
      status: 'ONLINE',
      summary: 'Stateless application server running Node.js business logic, handling API requests routed from the ALB.',
      securityDetails: 'Security Group restricts ingress to ALB only; egress limited to RDS MySQL Port 3306 and NAT Gateway.',
      scalabilityDetails: 'Health checked every 30 seconds; replaced automatically if unresponsive.',
      resumeEvidence: 'Architected a highly available and scalable three-tier Node.js application on AWS using EC2, VPC, and RDS.',
      specs: {
        'Instance Role': 'Node.js App Server',
        'Private IP': '10.0.2.45 (ap-south-1a)',
        'Process': 'Express API service',
        'IAM Profile': 'EC2-App-Role (Least Privilege)',
      },
    },
    ec2_2: {
      id: 'ec2_2',
      name: 'EC2 Instance #2 (Node.js)',
      category: 'Compute',
      tier: 'Private Subnet',
      icon: Server,
      status: systemState === 'DEGRADED_FAULT' ? 'STANDBY' : 'ONLINE',
      summary: 'Redundant application server in secondary Availability Zone ensuring high availability if an AZ fails.',
      securityDetails: 'Identical isolated security configuration deployed across ap-south-1b.',
      scalabilityDetails: 'Ensures 99.99% availability by avoiding single points of failure.',
      resumeEvidence: 'Configured AWS Elastic Load Balancer to distribute traffic efficiently across multiple EC2 instances.',
      specs: {
        'Instance Role': 'Node.js App Server (AZ-B)',
        'Private IP': '10.0.3.112 (ap-south-1b)',
        'Process': 'Express API service',
        'IAM Profile': 'EC2-App-Role (Least Privilege)',
      },
    },
    rds: {
      id: 'rds',
      name: 'Amazon RDS (MySQL)',
      category: 'Database',
      tier: 'Database Subnet',
      icon: Database,
      status: 'ONLINE',
      summary: 'Dedicated relational database tier residing in an isolated private DB subnet with automated backups and failover.',
      securityDetails: 'Completely isolated from public internet; accepts connection requests exclusively from EC2 App Security Group on Port 3306.',
      scalabilityDetails: 'Configured for high durability with automated snapshots, maintenance windows, and Multi-AZ readiness.',
      resumeEvidence: 'Designed Web, Application (Node.js), and Database (MySQL/RDS) layers with secure network isolation.',
      specs: {
        'Engine': 'MySQL Relational Database',
        'Subnet Group': 'Private DB Subnets (Isolated)',
        'Port': '3306 (App Security Group only)',
        'Backups': 'Automated Daily Snapshots',
      },
    },
    cloudwatch: {
      id: 'cloudwatch',
      name: 'Amazon CloudWatch',
      category: 'Monitoring',
      tier: 'Global AWS Service',
      icon: Activity,
      status: alarmActive ? 'ACTIVE' : 'ACTIVE',
      summary: 'Collects and visualizes real-time metrics (CPUUtilization, NetworkIn, HTTP 5XX error rates) across all compute resources.',
      securityDetails: 'Secured via IAM metrics ingestion policies and CloudWatch agent encryption.',
      scalabilityDetails: 'Triggers automated Auto Scaling scaling policies and proactive threshold breach alarms.',
      resumeEvidence: 'Created Amazon CloudWatch dashboards to monitor EC2 metrics such as CPU utilization and configured threshold alerts.',
      specs: {
        'Metric Tracked': 'EC2 CPUUtilization & ALB Latency',
        'Alarm Threshold': 'CPU > 70% for 2 consecutive periods',
        'Action': 'Trigger ASG Scale-out & notify SNS',
        'Evaluation': '1-minute precision',
      },
    },
    sns: {
      id: 'sns',
      name: 'Amazon SNS (Simple Notification Service)',
      category: 'Monitoring',
      tier: 'Global AWS Service',
      icon: Bell,
      status: 'ACTIVE',
      summary: 'Pub/Sub messaging service that instantly dispatches alerting notifications when CloudWatch alarms trigger.',
      securityDetails: 'Topic access policies restrict publication permissions strictly to Amazon CloudWatch service principal.',
      scalabilityDetails: 'Decoupled event fan-out supporting immediate multi-recipient alerting with zero delivery latency.',
      resumeEvidence: 'Integrated Amazon SNS for real-time email notifications on threshold breaches, improving proactive issue resolution.',
      specs: {
        'Topic Name': 'CloudWatch-HighCPU-Alerts',
        'Protocol': 'Email & SMS Notifications',
        'Trigger': 'CloudWatch Alarm State: ALARM',
        'Delivery Rate': 'Instant Fan-out',
      },
    },
    s3: {
      id: 's3',
      name: 'Amazon S3 (Static Web Assets)',
      category: 'Edge',
      tier: 'Global AWS Service',
      icon: HardDrive,
      status: 'ONLINE',
      summary: 'Highly durable object storage hosting static frontend assets (HTML, CSS, JS) with controlled public bucket policies.',
      securityDetails: 'Configured S3 bucket policies to enable secure, controlled public read while disallowing unauthorized write access.',
      scalabilityDetails: '11 9s (99.999999999%) data durability with object versioning enabled for content recovery.',
      resumeEvidence: 'Hosted a static website using Amazon S3, configuring S3 bucket policies and enabling object versioning.',
      specs: {
        'Durability': '99.999999999%',
        'Features': 'Static Hosting, Object Versioning',
        'Bucket Policy': 'Enforced TLS & Restricted Methods',
        'Storage Class': 'Standard S3',
      },
    },
    iam: {
      id: 'iam',
      name: 'AWS Identity & Access Management (IAM)',
      category: 'Security',
      tier: 'Global AWS Service',
      icon: Lock,
      status: 'ACTIVE',
      summary: 'Centrally manages authentication and authorization across AWS services, enforcing strict least-privilege policies.',
      securityDetails: 'Zero hardcoded credentials; EC2 instances assume short-lived IAM roles with scoped permission boundaries.',
      scalabilityDetails: 'Role-based access control scales automatically across dynamic auto-scaling fleets.',
      resumeEvidence: 'Applied security best practices using IAM roles, policies, and secure network configurations.',
      specs: {
        'Principle': 'Least Privilege Access',
        'Instance Profiles': 'Attached to Launch Templates',
        'Credential Safety': 'Rotated STS temporary credentials',
        'Policy Scope': 'CloudWatch Logs & S3 read only',
      },
    },
    lambda: {
      id: 'lambda',
      name: 'AWS Lambda (Event Execution)',
      category: 'Compute',
      tier: 'Global AWS Service',
      icon: Zap,
      status: 'ACTIVE',
      summary: 'Serverless compute engine executing code in response to system triggers and asynchronous task pipelines.',
      securityDetails: 'Assumes scoped execution roles inside VPC with zero public attack surface.',
      scalabilityDetails: 'Scales instantaneously from 0 to thousands of concurrent executions on demand.',
      resumeEvidence: 'Worked with AWS Lambda for serverless execution of event-driven tasks.',
      specs: {
        'Execution Model': 'Event-driven invocation',
        'Integration': 'S3 object upload & CloudWatch triggers',
        'Memory': 'Configurable 128MB to 10GB',
        'Cold Start': '< 100ms optimized runtime',
      },
    },
  };

  // Synthetic Request Tracer
  const traceHops = [
    { name: '1. Client -> Route 53 DNS Resolution', latency: '1.2ms', status: '200 OK' },
    { name: '2. Ingress -> Public ALB (TLS Termination & Routing)', latency: '2.8ms', status: 'Forwarded' },
    { name: '3. Security Group Ingress -> Private EC2 App (Port 3000)', latency: '8.4ms', status: 'Executed' },
    { name: '4. Database Query -> Isolated RDS MySQL (Port 3306)', latency: '4.1ms', status: 'Row Fetched' },
    { name: '5. Response Assembly -> Client JSON Payload', latency: '1.5ms', status: '200 OK (18ms Total)' },
  ];

  const handleStartTrace = () => {
    setTracingRequest(true);
    setTraceStep(1);
    audioSynth.playPacketPing();

    const interval = setInterval(() => {
      setTraceStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setTracingRequest(false);
          audioSynth.playSuccessChord();
          return 5;
        }
        audioSynth.playPacketPing();
        return prev + 1;
      });
    }, 450);
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    audioSynth.playNodeSelect();
  };

  const selectedNode = nodes[selectedNodeId] || nodes['alb'];

  return (
    <section id="architecture" className="arch-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <span className="dot"></span>
            <span>SYSTEM ARCHITECTURE // INTERACTIVE PRODUCTION TOPOLOGY</span>
          </div>
          <h2 className="section-title">AWS Multi-Tier Infrastructure Map</h2>
          <p className="section-description">
            Interactive topology representing Adarsh&apos;s verified AWS cloud deployment. Explore the subnet boundaries, 
            traffic routing, high-availability layers, and security isolation policies.
          </p>
        </div>

        {/* TOPOLOGY MODE SELECTOR STRIP */}
        <div className="topology-mode-bar mono" role="tablist">
          <div className="mode-label">
            <Layers size={14} className="text-cyan" />
            <span>TOPOLOGY VARIANT:</span>
          </div>
          <button
            onClick={() => {
              setTopologyMode('3TIER');
              audioSynth.playNodeSelect();
            }}
            className={`mode-btn ${topologyMode === '3TIER' ? 'active' : ''}`}
            role="tab"
            aria-selected={topologyMode === '3TIER'}
          >
            01. THREE-TIER WEB APP (EC2/ALB/RDS)
          </button>
          <button
            onClick={() => {
              setTopologyMode('AI_PLATFORM');
              audioSynth.playNodeSelect();
            }}
            className={`mode-btn ${topologyMode === 'AI_PLATFORM' ? 'active' : ''}`}
            role="tab"
            aria-selected={topologyMode === 'AI_PLATFORM'}
          >
            02. CLOUD AI ANALYTICS (FASTAPI/TENSORFLOW)
          </button>
          <button
            onClick={() => {
              setTopologyMode('SERVERLESS');
              audioSynth.playNodeSelect();
            }}
            className={`mode-btn ${topologyMode === 'SERVERLESS' ? 'active' : ''}`}
            role="tab"
            aria-selected={topologyMode === 'SERVERLESS'}
          >
            03. SERVERLESS EVENT PIPELINE (LAMBDA/S3/SNS)
          </button>
        </div>

        {/* Interactive Controls Bar */}
        <div className="arch-control-bar mono">
          <div className="control-indicator">
            <span className={`live-pulse ${alarmActive ? 'amber-pulse' : ''}`}></span>
            <span>TOPOLOGY: MULTI-AZ (ap-south-1a / ap-south-1b)</span>
            <span className="divider">|</span>
            <span className="metric-chip">STATUS: {systemState}</span>
            <span className="divider">|</span>
            <span className="metric-chip">LATENCY: {latency}ms</span>
          </div>

          <div className="control-actions">
            {/* Request Tracer Button */}
            <button
              onClick={handleStartTrace}
              disabled={tracingRequest}
              className="trace-btn mono"
              title="Trace an end-to-end synthetic HTTP transaction"
            >
              <Zap size={14} className="text-cyan" />
              <span>{tracingRequest ? 'TRACING PACKET...' : 'TRACE REQUEST FLOW'}</span>
            </button>

            <button 
              onClick={() => setTrafficActive(!trafficActive)}
              className={`toggle-traffic-btn ${trafficActive ? 'active' : ''}`}
            >
              <Workflow size={14} />
              <span>{trafficActive ? 'TRAFFIC: ANIMATED' : 'TRAFFIC: PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Live Synthetic Request Trace Waterfall Drawer (When Active) */}
        {traceStep > 0 && (
          <div className="trace-waterfall-box infra-card mono">
            <div className="waterfall-header">
              <div className="waterfall-title">
                <Sparkles size={14} className="text-cyan" />
                <span>SYNTHETIC PACKET TRACE: GET /api/v1/inventory (HTTP 200 OK)</span>
              </div>
              <button onClick={() => setTraceStep(0)} className="close-trace-btn">[DISMISS TRACE]</button>
            </div>
            <div className="waterfall-steps">
              {traceHops.map((hop, idx) => (
                <div key={idx} className={`waterfall-step ${traceStep >= idx + 1 ? 'completed' : ''}`}>
                  <div className="step-num">0{idx + 1}</div>
                  <div className="step-name">{hop.name}</div>
                  <div className="step-latency text-cyan">{hop.latency}</div>
                  <div className="step-status text-green">{hop.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Canvas & Inspector Layout */}
        <div className="arch-workspace">
          {/* Visual Topology Diagram */}
          <div className="arch-diagram infra-card">
            {/* VPC Outer Boundary */}
            <div className="vpc-boundary">
              <div className="vpc-tag mono">
                <ShieldCheck size={14} className="text-cyan" />
                <span>AWS VPC [CIDR: 10.0.0.0/16 // REGION: ap-south-1]</span>
              </div>

              {/* Tier 1: Ingress & Public Subnet */}
              <div className="subnet-box public-subnet">
                <div className="subnet-header mono">
                  <span className="subnet-name">PUBLIC SUBNET (10.0.1.0/24)</span>
                  <span className="subnet-badge">Internet Gateway Attached</span>
                </div>

                <div className="nodes-row justify-center">
                  <button
                    onClick={() => handleSelectNode('alb')}
                    className={`node-card ${selectedNodeId === 'alb' ? 'selected' : ''}`}
                    aria-label="Application Load Balancer"
                  >
                    <Network size={22} className="node-icon text-cyan" />
                    <div className="node-info">
                      <div className="node-title">Application Load Balancer</div>
                      <div className="node-meta mono">PORT: 80 / 443 // HEALTH CHECK: /health</div>
                    </div>
                    {trafficActive && <div className="packet-anim packet-down"></div>}
                  </button>
                </div>
              </div>

              {/* Visual Traffic Divider */}
              <div className="traffic-connector">
                <div className="connector-line"></div>
                <div className="connector-badge mono">
                  <ArrowDown size={12} />
                  <span>SECURITY GROUP: PORT 3000 ONLY</span>
                  <ArrowDown size={12} />
                </div>
                <div className="connector-line"></div>
              </div>

              {/* Tier 2: Application / Private Subnet (Auto Scaling Group or Serverless) */}
              <div className="subnet-box private-subnet">
                <div className="subnet-header mono">
                  <span className="subnet-name">PRIVATE APPLICATION SUBNET (10.0.2.0/24 &amp; 10.0.3.0/24)</span>
                  <button
                    onClick={() => handleSelectNode('asg')}
                    className={`asg-pill mono ${selectedNodeId === 'asg' ? 'selected-pill' : ''}`}
                  >
                    <Cpu size={13} />
                    <span>ASG: {activeInstances} INSTANCES RUNNING</span>
                  </button>
                </div>

                <div className="nodes-row">
                  <button
                    onClick={() => handleSelectNode('ec2_1')}
                    className={`node-card flex-1 ${selectedNodeId === 'ec2_1' ? 'selected' : ''}`}
                    aria-label="EC2 Instance 1"
                  >
                    <Server size={20} className="node-icon text-green" />
                    <div className="node-info">
                      <div className="node-title">EC2 #1 (AZ-a)</div>
                      <div className="node-meta mono">
                        {topologyMode === 'AI_PLATFORM' ? 'FastAPI API // 10.0.2.45' : 'Node.js Express // 10.0.2.45'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectNode('ec2_2')}
                    className={`node-card flex-1 ${selectedNodeId === 'ec2_2' ? 'selected' : ''} ${
                      systemState === 'DEGRADED_FAULT' ? 'faulted-node' : ''
                    }`}
                    aria-label="EC2 Instance 2"
                  >
                    <Server size={20} className={`node-icon ${systemState === 'DEGRADED_FAULT' ? 'text-alert' : 'text-green'}`} />
                    <div className="node-info">
                      <div className="node-title">
                        EC2 #2 (AZ-b) {systemState === 'DEGRADED_FAULT' ? '[OUTAGE]' : ''}
                      </div>
                      <div className="node-meta mono">
                        {systemState === 'DEGRADED_FAULT' ? 'DRAINING TRAFFIC (HTTP 500)' : '10.0.3.112 (Healthy)'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Visual Traffic Divider */}
              <div className="traffic-connector">
                <div className="connector-line"></div>
                <div className="connector-badge mono">
                  <ArrowDown size={12} />
                  <span>PORT 3306 RESTRICTED INGRESS</span>
                  <ArrowDown size={12} />
                </div>
                <div className="connector-line"></div>
              </div>

              {/* Tier 3: Isolated Database Subnet */}
              <div className="subnet-box db-subnet">
                <div className="subnet-header mono">
                  <span className="subnet-name">ISOLATED DATABASE SUBNET (10.0.4.0/24)</span>
                  <span className="subnet-badge db-badge">No Internet Route</span>
                </div>

                <div className="nodes-row justify-center">
                  <button
                    onClick={() => handleSelectNode('rds')}
                    className={`node-card ${selectedNodeId === 'rds' ? 'selected' : ''}`}
                    aria-label="Amazon RDS Database"
                  >
                    <Database size={22} className="node-icon text-violet" />
                    <div className="node-info">
                      <div className="node-title">
                        {topologyMode === 'AI_PLATFORM' ? 'Amazon RDS (PostgreSQL Analytics)' : 'Amazon RDS (MySQL Engine)'}
                      </div>
                      <div className="node-meta mono">Multi-AZ Storage // Automated Daily Snapshots</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Side Infrastructure & Observability Rail */}
            <div className="side-services-rail">
              <div className="rail-label mono">
                <span>OBSERVABILITY, EVENT &amp; MANAGEMENT LAYER</span>
              </div>
              <div className="rail-cards">
                <button
                  onClick={() => handleSelectNode('cloudwatch')}
                  className={`side-node-card ${selectedNodeId === 'cloudwatch' ? 'selected' : ''}`}
                >
                  <Activity size={18} className="text-amber" />
                  <div className="side-node-text">
                    <div className="side-title">Amazon CloudWatch</div>
                    <div className="side-desc mono">CPU &amp; Metric Alarms</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectNode('sns')}
                  className={`side-node-card ${selectedNodeId === 'sns' ? 'selected' : ''}`}
                >
                  <Bell size={18} className="text-amber" />
                  <div className="side-node-text">
                    <div className="side-title">Amazon SNS</div>
                    <div className="side-desc mono">Real-Time Email Alerting</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectNode('s3')}
                  className={`side-node-card ${selectedNodeId === 's3' ? 'selected' : ''}`}
                >
                  <HardDrive size={18} className="text-cyan" />
                  <div className="side-node-text">
                    <div className="side-title">Amazon S3</div>
                    <div className="side-desc mono">Static Web Asset Storage</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectNode('lambda')}
                  className={`side-node-card ${selectedNodeId === 'lambda' ? 'selected' : ''}`}
                >
                  <Zap size={18} className="text-violet" />
                  <div className="side-node-text">
                    <div className="side-title">AWS Lambda</div>
                    <div className="side-desc mono">Serverless Event Tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectNode('iam')}
                  className={`side-node-card ${selectedNodeId === 'iam' ? 'selected' : ''}`}
                >
                  <Lock size={18} className="text-green" />
                  <div className="side-node-text">
                    <div className="side-title">AWS IAM</div>
                    <div className="side-desc mono">Least Privilege Roles</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Deep Engineering Node Inspector Panel */}
          <aside className="arch-inspector infra-card" aria-label="Component Specification Inspector">
            <div className="inspector-header">
              <div className="inspector-badge-row">
                <span className="badge badge-cyan">{selectedNode.tier}</span>
                <span className="badge badge-green mono">{selectedNode.status}</span>
              </div>
              <h3 className="inspector-title">{selectedNode.name}</h3>
              <p className="inspector-summary">{selectedNode.summary}</p>
            </div>

            <div className="inspector-sections">
              {/* Technical Specifications */}
              <div className="inspector-section">
                <div className="section-subtitle mono">
                  <Cpu size={14} className="text-cyan" />
                  <span>ENGINEERING PARAMETERS</span>
                </div>
                <div className="specs-table mono">
                  {Object.entries(selectedNode.specs).map(([k, v]) => (
                    <div key={k} className="spec-row">
                      <span className="spec-key">{k}:</span>
                      <span className="spec-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Boundary */}
              <div className="inspector-section">
                <div className="section-subtitle mono">
                  <ShieldCheck size={14} className="text-green" />
                  <span>SECURITY BOUNDARY</span>
                </div>
                <p className="inspector-text">{selectedNode.securityDetails}</p>
              </div>

              {/* Scalability & High Availability */}
              <div className="inspector-section">
                <div className="section-subtitle mono">
                  <Activity size={14} className="text-amber" />
                  <span>SCALABILITY &amp; FAILOVER</span>
                </div>
                <p className="inspector-text">{selectedNode.scalabilityDetails}</p>
              </div>

              {/* Resume Fact Verification */}
              <div className="inspector-section verification-box">
                <div className="section-subtitle mono text-cyan">
                  <CheckCircle2 size={14} />
                  <span>RESUME VERIFICATION PROOF</span>
                </div>
                <p className="verification-text">&ldquo;{selectedNode.resumeEvidence}&rdquo;</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
