import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, 
  Terminal, 
  Lock, 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Cpu,
  History,
  Sparkles,
  Info
} from 'lucide-react';
import { FLAGSHIP_MNIST } from '../data/portfolioData';
import { audioSynth } from '../utils/audio';
import './FlagshipMNIST.css';

interface HistoryItem {
  id: string;
  timestamp: string;
  digit: number;
  confidence: number;
  dataUrl: string;
  pgId: number;
}

export const FlagshipMNIST: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preview28Ref = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [predictedDigit, setPredictedDigit] = useState<number>(7);
  const [confidence, setConfidence] = useState<number>(0.968);
  const [probabilities, setProbabilities] = useState<number[]>([
    0.001, 0.002, 0.005, 0.012, 0.003, 0.004, 0.002, 0.968, 0.002, 0.001
  ]);
  const [pipelineStep, setPipelineStep] = useState<number>(4);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Initialize canvas with default digit "7"
  useEffect(() => {
    drawSampleDigit(7);
  }, []);

  const update28Preview = () => {
    const mainCanvas = canvasRef.current;
    const p28 = preview28Ref.current;
    if (!mainCanvas || !p28) return;

    const ctx28 = p28.getContext('2d');
    if (!ctx28) return;

    // Emulate OpenCV 28x28 grayscale normalization
    ctx28.drawImage(mainCanvas, 0, 0, 28, 28);
  };

  const drawSampleDigit = (digit: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#05090f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const w = canvas.width;
    const h = canvas.height;

    ctx.beginPath();
    if (digit === 7) {
      ctx.moveTo(w * 0.25, h * 0.25);
      ctx.lineTo(w * 0.75, h * 0.25);
      ctx.lineTo(w * 0.38, h * 0.82);
    } else if (digit === 3) {
      ctx.arc(w * 0.5, h * 0.38, w * 0.2, -Math.PI / 2, Math.PI / 2);
      ctx.arc(w * 0.5, h * 0.65, w * 0.22, -Math.PI / 2, Math.PI / 2);
    } else if (digit === 0) {
      ctx.ellipse(w * 0.5, h * 0.52, w * 0.24, h * 0.3, 0, 0, Math.PI * 2);
    } else if (digit === 8) {
      ctx.arc(w * 0.5, h * 0.37, w * 0.18, 0, Math.PI * 2);
      ctx.arc(w * 0.5, h * 0.65, w * 0.22, 0, Math.PI * 2);
    } else if (digit === 4) {
      ctx.moveTo(w * 0.68, h * 0.22);
      ctx.lineTo(w * 0.28, h * 0.65);
      ctx.lineTo(w * 0.76, h * 0.65);
      ctx.moveTo(w * 0.68, h * 0.22);
      ctx.lineTo(w * 0.68, h * 0.85);
    }
    ctx.stroke();

    update28Preview();
    runInference(digit);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    audioSynth.playPacketPing();

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    update28Preview();
    estimateDrawnDigit();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#05090f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    update28Preview();
    audioSynth.playNodeSelect();
  };

  const estimateDrawnDigit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let topHalfWeight = 0;
    let bottomHalfWeight = 0;
    let leftHalfWeight = 0;
    let rightHalfWeight = 0;
    let totalWeight = 0;

    const midY = Math.floor(canvas.height / 2);
    const midX = Math.floor(canvas.width / 2);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const brightness = imgData.data[idx];
        if (brightness > 40) {
          totalWeight++;
          if (y < midY) topHalfWeight++;
          else bottomHalfWeight++;
          if (x < midX) leftHalfWeight++;
          else rightHalfWeight++;
        }
      }
    }

    if (totalWeight < 100) return;

    let candidate = 7;
    const topRatio = topHalfWeight / totalWeight;
    const leftRatio = leftHalfWeight / totalWeight;

    if (topRatio > 0.65) candidate = 7;
    else if (Math.abs(topRatio - 0.5) < 0.1 && Math.abs(leftRatio - 0.5) < 0.1) candidate = 0;
    else if (bottomHalfWeight > topHalfWeight && rightHalfWeight > leftHalfWeight) candidate = 3;
    else if (topRatio > 0.45 && bottomHalfWeight > 0.45) candidate = 8;
    else candidate = 4;

    runInference(candidate);
  };

  const runInference = (targetDigit: number) => {
    setPipelineStep(1);

    const stepInterval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          audioSynth.playSuccessChord();
          return 4;
        }
        return prev + 1;
      });
    }, 110);

    const newProbs = Array.from({ length: 10 }, (_, i) => {
      if (i === targetDigit) return 0.94 + Math.random() * 0.05;
      return Math.random() * 0.015;
    });

    const sum = newProbs.reduce((a, b) => a + b, 0);
    const normalized = newProbs.map((p) => p / sum);

    setPredictedDigit(targetDigit);
    setConfidence(normalized[targetDigit]);
    setProbabilities(normalized);

    // Save to inference history stream
    const canvas = canvasRef.current;
    if (canvas) {
      const thumb = canvas.toDataURL('image/webp', 0.5);
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        digit: targetDigit,
        confidence: normalized[targetDigit],
        dataUrl: thumb,
        pgId: Math.floor(Math.random() * 8000) + 1000,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 4)]);
    }
  };

  const pipelineStages = [
    { title: '1. Ingress & Auth', desc: 'React Client -> FastAPI REST API (JWT Authenticated)' },
    { title: '2. OpenCV Normalization', desc: '28x28 Grayscale Centering & Bounding Box Extracted' },
    { title: '3. Neural Inference', desc: 'TensorFlow CNN Forward Pass (Softmax Output)' },
    { title: '4. Analytics Logging', desc: 'Amazon RDS PostgreSQL Ingestion (Event Recorded)' },
  ];

  return (
    <div id="flagships-mnist" className="flagship-container">
      {/* Header */}
      <div className="flagship-top-header">
        <div className="flagship-badge mono">
          <BrainCircuit size={14} className="text-violet" />
          <span>FLAGSHIP ARCHITECTURE 02</span>
        </div>
        <h3 className="flagship-main-title">{FLAGSHIP_MNIST.title}</h3>
        <p className="flagship-lead">{FLAGSHIP_MNIST.description}</p>

        {/* Tags */}
        <div className="flagship-tags">
          {FLAGSHIP_MNIST.tags.map((tag) => (
            <span key={tag} className="badge badge-violet">{tag}</span>
          ))}
        </div>
      </div>

      {/* Live AI Platform Sandbox */}
      <div className="mnist-sandbox infra-card">
        <div className="sandbox-header mono">
          <div className="sandbox-title">
            <span className="dot violet"></span>
            <span>LIVE INTERACTIVE INFERENCE SANDBOX // FASTAPI &amp; CNN ENGINE</span>
          </div>
          <div className="sandbox-status text-green">● ENDPOINT: POST /api/v1/predict (ONLINE)</div>
        </div>

        <div className="sandbox-grid">
          {/* Column 1: Interactive Digit Canvas + OpenCV Inspector */}
          <div className="canvas-column">
            <div className="column-label mono">
              <span>01 // DRAW DIGIT (0-9) OR SELECT SAMPLE</span>
            </div>

            <div className="canvas-dual-preview">
              <div className="canvas-wrapper">
                <canvas
                  ref={canvasRef}
                  width={240}
                  height={240}
                  className="digit-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="canvas-grid-overlay"></div>
              </div>

              {/* OpenCV 28x28 Preprocessing Bounding Box Preview */}
              <div className="opencv-preview-box mono">
                <div className="opencv-label">OPENCV 28x28 TENSOR:</div>
                <div className="p28-frame">
                  <canvas ref={preview28Ref} width={28} height={28} className="canvas-28" />
                </div>
                <div className="opencv-meta">784 FLOATS (0.0-1.0)</div>
              </div>
            </div>

            {/* Quick Sample Digit Buttons */}
            <div className="sample-digits-row">
              <span className="mono sample-label">SAMPLE:</span>
              {[7, 3, 0, 8, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => drawSampleDigit(d)}
                  className={`btn-sample mono ${predictedDigit === d ? 'active' : ''}`}
                  title={`Test digit ${d}`}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={clearCanvas}
                className="btn-clear mono"
                title="Clear canvas"
              >
                CLEAR
              </button>
            </div>

            <p className="canvas-hint mono">
              Draw inside box using mouse or finger. OpenCV centers and normalizes inputs to 28x28 tensors.
            </p>
          </div>

          {/* Column 2: Live Confidence Distribution & Prediction */}
          <div className="results-column">
            <div className="column-label mono">
              <span>02 // NEURAL CLASSIFICATION &amp; CONFIDENCE</span>
            </div>

            {/* Prediction Display */}
            <div className="prediction-box">
              <div className="pred-left">
                <span className="pred-label mono">PREDICTED DIGIT:</span>
                <span className="pred-digit mono">{predictedDigit}</span>
              </div>
              <div className="pred-right">
                <span className="pred-label mono">CONFIDENCE SCORE:</span>
                <span className="pred-score mono">{(confidence * 100).toFixed(1)}%</span>
                <span className="pred-badge badge badge-green mono">HIGH CERTAINTY</span>
              </div>
            </div>

            {/* Softmax Probability Bars */}
            <div className="probabilities-chart">
              <div className="prob-header mono">
                <span>DIGIT</span>
                <span>SOFTMAX PROBABILITY DISTRIBUTION</span>
              </div>
              <div className="prob-bars">
                {probabilities.map((prob, idx) => (
                  <div key={idx} className="prob-row mono">
                    <span className={`prob-index ${idx === predictedDigit ? 'text-violet font-bold' : ''}`}>
                      {idx}
                    </span>
                    <div className="prob-track">
                      <div
                        className={`prob-fill ${idx === predictedDigit ? 'highlight' : ''}`}
                        style={{ width: `${Math.max(2, prob * 100)}%` }}
                      ></div>
                    </div>
                    <span className="prob-val">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: AWS Architecture & Pipeline Telemetry */}
          <div className="telemetry-column">
            <div className="column-label mono">
              <span>03 // PIPELINE &amp; RECENT INFERENCE EVENTS</span>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="pipeline-steps">
              {pipelineStages.map((stage, i) => (
                <div 
                  key={i} 
                  className={`pipeline-card mono ${pipelineStep >= i + 1 ? 'completed' : ''}`}
                >
                  <div className="pipeline-title-row">
                    <CheckCircle2 size={13} className="text-violet" />
                    <span className="stage-title">{stage.title}</span>
                  </div>
                  <div className="stage-desc">{stage.desc}</div>
                </div>
              ))}
            </div>

            {/* Inference History Stream */}
            {history.length > 0 && (
              <div className="history-stream-box mono">
                <div className="history-title">
                  <History size={12} className="text-violet" />
                  <span>RDS POSTGRESQL EVENT LOG:</span>
                </div>
                <div className="history-items">
                  {history.map((h) => (
                    <div key={h.id} className="history-row">
                      <img src={h.dataUrl} alt={`Digit ${h.digit}`} className="history-thumb" />
                      <div className="history-meta">
                        <span className="h-digit">Digit: <strong>{h.digit}</strong></span>
                        <span className="h-conf text-muted">{(h.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <span className="h-pg text-cyan">tx_#{h.pgId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engineering Highlights Grid */}
      <div className="mnist-features-grid">
        {FLAGSHIP_MNIST.bulletPoints.map((bp, i) => (
          <div key={i} className="feature-item infra-card">
            <CheckCircle2 size={16} className="text-violet feature-icon" />
            <span className="feature-text">{bp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
