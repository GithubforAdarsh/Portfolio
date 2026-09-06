# Adarsh.Infra — Cloud System Portfolio

> **"A Cloud System You Can Explore"**  
> An award-caliber, technically credible portfolio web application for **Thekkinkatil Adarsh** (Cloud / Backend / Infrastructure Engineer).

Built around the central metaphor of an interactive AWS Cloud Infrastructure Control Center, translating real, verified AWS architectures, dynamic auto-scaling topologies, and machine learning backend services into an interactive engineering experience.

---

## 🛠️ Zero-Fabrication Guarantee

Every technical competency, architecture design, metric rule, internship deliverable, and credential presented in this portfolio is **100% sourced from and verified against Adarsh's official resume (`ADARSH_CLOUD_DEVOPS_RESUME.pdf`)**:

- **AWS Core Services**: EC2, VPC, S3, IAM, Route 53, RDS (MySQL / PostgreSQL), CloudWatch, SNS, Lambda, Auto Scaling, Elastic Load Balancing.
- **Backend**: Node.js, Express.js, FastAPI, Flask, Python.
- **Databases**: MySQL, PostgreSQL, MongoDB, DynamoDB, Amazon Aurora.
- **DevOps & Containers**: Docker, Kubernetes, CI/CD Fundamentals, GitHub Actions.
- **Internships**: Grras IT Solution (Cloud Internship, Jan–Apr 2026) & IBhavan (Summer Intern, Jun–Jul 2024).
- **Education**: Ganpat University (B.Tech CSE with specialization in Cloud-Based Applications, 2023–2026) & Government Polytechnic Ahmedabad (Diploma in EC, 2018–2021).
- **Certifications**: AWS Cloud Quest: Cloud Practitioner, AWS Cloud Quest: AWS Technical Essentials, Digital Course: AWS Cloud Practitioner Essentials.

---

## 🏛️ Interactive Architecture & Simulators

1. **System Initialization Bootloader (`#sys-hero`)**:
   - Fast, non-blocking telemetry sequence revealing candidate identity and core AWS metrics.
   - Interactive 60 FPS canvas mesh with cursor proximity routing.
2. **AWS Three-Tier System Architecture Map (`#architecture`)**:
   - Visual topology spanning Public Subnet (ALB), Private Application Subnet (Multi-AZ EC2 Auto Scaling Group), and Isolated DB Subnet (Amazon RDS).
   - Clickable nodes open a deep engineering inspector detailing security group chaining, CIDR blocks, and failover mechanics.
3. **Flagship 1: Three-Tier Scalable Node.js App on AWS (`#flagships`)**:
   - Interactive tier tabs (Web, Application, Database, Management) and engineering interviewer Q&A accordion.
4. **Flagship 2: Cloud-Based MNIST AI & Analytics Platform (`#flagships-mnist`)**:
   - Interactive 240x240 digit drawing canvas with client-side OpenCV normalization and neural softmax probability distribution.
   - Live FastAPI telemetry stream with JWT authorization.
5. **Interactive Cloud Infrastructure Labs (`#simulators`)**:
   - **Auto Scaling Group (ASG)**: Live traffic load slider triggering dynamic scale-out when CPU breaches 70%.
   - **Application Load Balancer (ALB)**: Interactive fault injection (HTTP 500) demonstrating zero-downtime traffic draining.
   - **CloudWatch & SNS Alerting Engine**: Real-time CPU chart with threshold breach triggering simulated AWS SNS email alert payload.
6. **Recruiter Diagnostics HUD Modal (Shortcut: `~` or Status Pill)**:
   - 10-second executive briefing tailored for technical recruiters and hiring managers.
   - One-click resume download and contact copying.

---

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build System**: Vite 5
- **Styling**: Modular Vanilla CSS with semantic HSL/HEX design tokens (Obsidian slate `#06090d`, Cyan `#00f0ff`, Emerald `#10b981`, Amber `#f59e0b`, Neural Violet `#a855f7`)
- **Icons**: Lucide React + custom inline SVG icons
- **Performance**: Zero bulky 3D engine overhead, hardware-accelerated Canvas 2D/SVG rendering, compressed bundle size (<80 kB gzipped).

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on v23.1.0)
- npm 9+ (tested on 10.8.3)

### Installation
```bash
# Clone the repository
git clone https://github.com/GithubforAdarsh/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🚢 Production Build & Deployment

### Build
```bash
npm run build
```
This performs full TypeScript verification (`tsc`) and generates an optimized production bundle in the `dist/` directory.

### Deploying to AWS S3 + CloudFront (Static Website Hosting)
As demonstrated in Adarsh's S3 hosting implementation:
```bash
# 1. Build project
npm run build

# 2. Sync to S3 bucket
aws s3 sync dist/ s3://adarsh-portfolio-bucket --delete

# 3. Invalidate CloudFront distribution
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

---

## ⌨️ Accessibility & Keyboard Shortcuts

- **`~` or `` ` ``**: Open / Close System Diagnostics & Recruiter HUD.
- **`Escape`**: Close any active modal or HUD.
- **`Tab` / `Shift+Tab`**: Full visible focus ring navigation across all interactive nodes, buttons, and simulation sliders.
- **`prefers-reduced-motion`**: Automatically detected and honored, with manual toggle in navigation bar.

---

## 👤 Candidate Contact
- **Name**: Thekkinkatil Adarsh
- **Email**: [adarsh200004@gmail.com](mailto:adarsh200004@gmail.com)
- **LinkedIn**: [linkedin.com/in/adarsh-sadanandan](https://www.linkedin.com/in/adarsh-sadanandan)
- **GitHub**: [github.com/GithubforAdarsh](https://github.com/GithubforAdarsh)
- **Location**: Ahmedabad / Kherva, Gujarat, India
