export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  period: string;
  description: string;
  tags: string[];
  bulletPoints: string[];
  metrics?: { label: string; value: string }[];
  architecture?: {
    layers: { name: string; tech: string; description: string }[];
    security: string[];
    scalability: string[];
  };
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; level: 'Proficient' | 'Hands-on' | 'Core'; role: string }[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  type: 'internship' | 'education';
  highlights: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  type: string;
  badgeCode: string;
}

export const CANDIDATE_INFO = {
  name: 'Thekkinkatil Adarsh',
  role: 'Cloud / Backend / Infrastructure Engineer',
  primaryPositioning: 'I build cloud systems designed to scale.',
  secondaryText:
    'Cloud-focused computer science engineer working across AWS, backend systems, scalable architectures, DevOps, and AI-powered applications.',
  email: 'adarsh200004@gmail.com',
  phone: '8140663537',
  linkedin: 'https://www.linkedin.com/in/adarsh-sadanandan',
  github: 'https://github.com/GithubforAdarsh',
  location: 'Ahmedabad / Kherva, Gujarat, India',
  summary:
    'Cloud-focused Computer Science Engineering student with hands-on experience in AWS, full-stack development, and AI-powered applications. Skilled in architecting and deploying scalable web applications using Flask, Node.js, Docker, and MongoDB. Demonstrated ability to develop data-driven solutions, improve user engagement, and work with cloud-native technologies.',
};

export const FLAGSHIP_THREE_TIER: ProjectItem = {
  id: 'three-tier-aws',
  title: 'Three-Tier Scalable Node.js Application Deployment on AWS',
  category: 'Cloud Architecture & Infrastructure',
  period: 'Jan 2026 – Apr 2026',
  description:
    'Architected a highly available, fault-tolerant, and secure three-tier web application infrastructure on AWS using EC2, VPC, ALB, Auto Scaling, and Amazon RDS.',
  tags: ['AWS', 'EC2', 'VPC', 'RDS MySQL', 'Application Load Balancer', 'Auto Scaling', 'CloudWatch', 'SNS', 'Node.js', 'React'],
  bulletPoints: [
    'Architected a highly available and scalable three-tier Node.js application on AWS using EC2, VPC, and RDS.',
    'Designed Web (React), Application (Node.js), and Database (MySQL) layers with secure network isolation.',
    'Configured Application Load Balancer (ALB) and Auto Scaling Groups (ASG) for high availability and automatic horizontal scaling.',
    'Configured Amazon CloudWatch metrics and integrated SNS for real-time alerts on system health and CPU threshold breaches.',
    'Implemented security best practices using isolated private subnets, security group ingress rules, and IAM least-privilege roles.',
  ],
  architecture: {
    layers: [
      {
        name: 'Tier 1: Presentation (Web)',
        tech: 'React / Amazon S3 / ALB',
        description: 'Public-facing traffic entry via Application Load Balancer with SSL/TLS termination and path-based routing.',
      },
      {
        name: 'Tier 2: Logic (Application)',
        tech: 'Node.js / Express on EC2 in ASG',
        description: 'Stateless application instances residing in private subnets, autoscaling dynamically based on CPU utilization.',
      },
      {
        name: 'Tier 3: Persistence (Database)',
        tech: 'Amazon RDS MySQL',
        description: 'Isolated in dedicated private database subnets with automated backups, Multi-AZ capability, and strict security groups.',
      },
    ],
    security: [
      'Isolated VPC with public subnets for ALB and private subnets for EC2 and RDS.',
      'Tier-to-tier Security Groups: DB accepts traffic only from App tier; App tier accepts traffic only from ALB.',
      'IAM Roles assigned directly to EC2 instances for secure AWS service communication without hardcoded keys.',
    ],
    scalability: [
      'Auto Scaling Group with minimum 2 instances distributed across availability zones.',
      'Dynamic target tracking scaling policies trigger new instances during traffic surges.',
      'ALB automatically routes requests only to healthy target instances via HTTP health checks.',
    ],
  },
};

export const FLAGSHIP_MNIST: ProjectItem = {
  id: 'mnist-cloud-platform',
  title: 'Cloud-Based MNIST Digit Classification & Analytics Platform',
  category: 'Cloud AI & Data Analytics',
  period: 'Jan 2026 – Apr 2026',
  description:
    'Architected and deployed a secure three-tier cloud application for handwritten digit recognition and inference analytics on AWS.',
  tags: ['AWS', 'FastAPI', 'React', 'TensorFlow', 'PostgreSQL', 'OpenCV', 'JWT', 'ALB', 'Auto Scaling', 'RDS'],
  bulletPoints: [
    'Architected and deployed a secure three-tier cloud application for handwritten digit recognition and analytics on AWS.',
    'Configured VPC networking, Security Groups, Application Load Balancer, Auto Scaling Groups, and Amazon RDS for scalable and highly available deployment.',
    'Developed REST APIs using FastAPI for digit prediction, user management, authentication, and analytics reporting.',
    'Created interactive analytics dashboards to visualize prediction frequency, confidence metrics, user activity, and model performance.',
    'Secured the platform using JWT authentication, role-based authorization, password policies, and controlled API access.',
    'Implemented CNN-based digit classification with OpenCV preprocessing and confidence tracking.',
  ],
  metrics: [
    { label: 'API Framework', value: 'FastAPI REST' },
    { label: 'Inference Engine', value: 'TensorFlow CNN' },
    { label: 'Preprocessing', value: 'OpenCV 28x28 Normalization' },
    { label: 'Data Persistence', value: 'Amazon RDS PostgreSQL' },
  ],
};

export const CLOUD_INFRA_PROJECTS: ProjectItem[] = [
  {
    id: 'auto-scaling-implementation',
    title: 'Auto Scaling Implementation on AWS',
    category: 'AWS Infrastructure',
    period: 'Jan 2026 – Apr 2026',
    description: 'Dynamic Auto Scaling configuration ensuring high availability, performance optimization, and automatic failover.',
    tags: ['Auto Scaling Groups', 'Launch Templates', 'User Data', 'EC2', 'CloudWatch Alarms'],
    bulletPoints: [
      'Configured Auto Scaling Groups (ASGs) to ensure high availability and fault tolerance for applications.',
      'Configured dynamic scaling policies based on demand to optimize performance and cost.',
      'Created and maintained Launch Templates with secure configurations for consistent instance provisioning.',
      'Automated EC2 instance setup using user data scripts for seamless bootstrapping.',
      'Improved system reliability by enabling automatic instance replacement and load balancing integration.',
    ],
  },
  {
    id: 'aws-load-balancer',
    title: 'AWS Application Load Balancer Implementation',
    category: 'AWS Infrastructure',
    period: 'Jan 2026 – Apr 2026',
    description: 'Traffic distribution, health checks, and zero-downtime routing across multi-instance EC2 deployments.',
    tags: ['ALB', 'Target Groups', 'Health Checks', 'High Availability', 'Fault Tolerance'],
    bulletPoints: [
      'Configured Application Load Balancers (ALB) to distribute traffic efficiently across multiple EC2 instances.',
      'Enhanced application availability and reliability through efficient load-balancing strategies.',
      'Integrated ALB with Auto Scaling Groups (ASG) for automatic scaling and fault tolerance.',
      'Ensured seamless traffic routing and minimized downtime during traffic spikes.',
    ],
  },
  {
    id: 'cloudwatch-sns-alerting',
    title: 'CloudWatch with SNS and Alarm Configuration',
    category: 'Observability & Monitoring',
    period: 'Jan 2026 – Apr 2026',
    description: 'Proactive observability suite with automated CloudWatch threshold alarms and SNS event fan-out.',
    tags: ['Amazon CloudWatch', 'Amazon SNS', 'Alarms', 'EC2 Metrics', 'Proactive Monitoring'],
    bulletPoints: [
      'Created Amazon CloudWatch dashboards to monitor EC2 instance metrics such as CPU utilization.',
      'Configured CloudWatch alarms to detect high CPU usage and trigger automated alerts.',
      'Integrated Amazon SNS for real-time email notifications on threshold breaches.',
      'Improved system monitoring, scalability, and proactive issue resolution.',
      'Enabled efficient performance tracking and reduced downtime through alerting mechanisms.',
    ],
  },
  {
    id: 's3-static-hosting',
    title: 'Static Website Hosting on Amazon S3',
    category: 'Storage & Content Delivery',
    period: 'Jan 2026 – Apr 2026',
    description: 'Cost-effective, highly durable web hosting with custom bucket policies and versioning control.',
    tags: ['Amazon S3', 'Bucket Policies', 'Object Versioning', 'Public Access Control', 'High Durability'],
    bulletPoints: [
      'Hosted a static website using Amazon S3, ensuring a cost-effective and scalable hosting solution.',
      'Configured S3 bucket policies to enable secure and controlled public access.',
      'Enabled object versioning for efficient content management and recovery.',
      'Optimized static content delivery with high availability and durability.',
      'Organized website assets (HTML, CSS, JS) with structured storage and access control.',
    ],
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness Tracker & GitHub Metrics Visualizer',
    category: 'Full-Stack Application',
    period: 'Jun 2024 – Jul 2024',
    description: 'Full-stack task management, health routine tracking, and GitHub contribution metrics visualization system.',
    tags: ['Python', 'Flask', 'MongoDB', 'Docker', 'HTML/CSS', 'GitHub API'],
    bulletPoints: [
      'Built a full-stack web application using Flask, Python, with MongoDB, enhancing user experience.',
      'Designed an admin interface allowing administrators to dynamically add and manage users’ daily tasks.',
      'Created a data visualisation system leveraging GitHub metrics to track team engagement and code contribution growth.',
      'Created a Fitness Tracker app to automate tracking of daily routines and workouts, boosting user engagement and health insights.',
    ],
  },
  {
    id: 'image-colorization-deoldify',
    title: 'Automated Image Colorization using deOldify',
    category: 'Machine Learning',
    period: 'Sep 2024',
    description: 'Flask-based neural network integration for high-fidelity automated grayscale image colorization.',
    tags: ['Python', 'Flask', 'Neural Networks', 'deOldify', 'Git', 'Computer Vision'],
    bulletPoints: [
      'Implemented a Flask-based website integrating neural networks for automated image colorization, achieving 90 percent accuracy on test datasets.',
      'Maintained Git-based repositories for an AI-powered image colorization system.',
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Cloud Computing (AWS)',
    description: 'Hands-on architectural and operational experience with Amazon Web Services core ecosystem.',
    skills: [
      { name: 'Amazon EC2', level: 'Proficient', role: 'Compute instances, Launch Templates, User Data scripts' },
      { name: 'Amazon S3', level: 'Proficient', role: 'Static hosting, bucket policies, object versioning' },
      { name: 'Amazon VPC', level: 'Proficient', role: 'Public/private subnets, Route Tables, NAT, Internet Gateway' },
      { name: 'AWS IAM', level: 'Proficient', role: 'Roles, policies, least-privilege security configurations' },
      { name: 'Amazon RDS', level: 'Proficient', role: 'Relational database isolation, MySQL, PostgreSQL, Multi-AZ' },
      { name: 'Amazon CloudWatch', level: 'Proficient', role: 'Dashboards, metric alarms, CPU tracking' },
      { name: 'Amazon SNS', level: 'Proficient', role: 'Real-time alert dispatching and event fan-out' },
      { name: 'AWS Auto Scaling', level: 'Proficient', role: 'Dynamic scaling policies, target tracking, instance cycling' },
      { name: 'Elastic Load Balancing', level: 'Proficient', role: 'Application Load Balancer, health checks, target groups' },
      { name: 'AWS Lambda', level: 'Hands-on', role: 'Serverless execution of event-driven tasks' },
      { name: 'Route 53', level: 'Core', role: 'DNS management and routing policies' },
    ],
  },
  {
    category: 'Backend Technologies',
    description: 'Building robust RESTful services, micro-services, and scalable application logic.',
    skills: [
      { name: 'Node.js', level: 'Proficient', role: 'Event-driven server runtime, 3-tier application tier' },
      { name: 'Express.js', level: 'Proficient', role: 'RESTful API routing and middleware pipelines' },
      { name: 'FastAPI', level: 'Proficient', role: 'High-speed Python APIs for AI inference and analytics' },
      { name: 'Flask', level: 'Proficient', role: 'Lightweight web services for full-stack and ML apps' },
    ],
  },
  {
    category: 'Databases & Storage',
    description: 'Designing relational and document data layers with isolation and durability.',
    skills: [
      { name: 'MySQL', level: 'Proficient', role: '3-Tier application persistence with relational schemas' },
      { name: 'PostgreSQL', level: 'Proficient', role: 'MNIST analytics platform persistent logging' },
      { name: 'MongoDB', level: 'Hands-on', role: 'Document database for fitness routine tracker' },
      { name: 'DynamoDB', level: 'Core', role: 'NoSQL key-value cloud data store' },
      { name: 'Amazon Aurora', level: 'Core', role: 'High-performance cloud-native relational engine' },
    ],
  },
  {
    category: 'DevOps & Containers',
    description: 'Automating build pipelines, containerizing workloads, and version management.',
    skills: [
      { name: 'Docker', level: 'Proficient', role: 'Application containerization and reproducible runtime' },
      { name: 'Kubernetes', level: 'Core', role: 'Container orchestration fundamentals and pod concepts' },
      { name: 'CI/CD Fundamentals', level: 'Hands-on', role: 'Automated deployment workflows and test gates' },
      { name: 'GitHub Actions', level: 'Hands-on', role: 'Workflow automation and continuous integration' },
      { name: 'Git & GitHub', level: 'Proficient', role: 'Version control, branch protection, code collaboration' },
    ],
  },
  {
    category: 'Networking & Security',
    description: 'Enforcing perimeter boundaries, traffic inspection, and network isolation.',
    skills: [
      { name: 'VPC Networking', level: 'Proficient', role: 'Subnet segmentation, CIDR allocation, route tables' },
      { name: 'Security Groups', level: 'Proficient', role: 'Stateful firewall rules between Web, App, and DB' },
      { name: 'Load Balancing', level: 'Proficient', role: 'Layer 7 HTTP/HTTPS traffic balancing and health monitoring' },
      { name: 'DNS & HTTP/HTTPS', level: 'Proficient', role: 'Domain resolution, TLS/SSL handshake, HTTP headers' },
    ],
  },
  {
    category: 'AI / Machine Learning',
    description: 'Integrating predictive neural models with cloud backend infrastructure.',
    skills: [
      { name: 'TensorFlow & Keras', level: 'Proficient', role: 'CNN training and inference for handwritten digits' },
      { name: 'OpenCV', level: 'Proficient', role: 'Image transformation, thresholding, and normalization' },
      { name: 'Scikit-learn', level: 'Hands-on', role: 'Classification, evaluation metrics, data preprocessing' },
      { name: 'Pandas & NumPy', level: 'Proficient', role: 'Data manipulation, vectorization, and matrix operations' },
      { name: 'Matplotlib', level: 'Hands-on', role: 'Data and model performance visualization' },
    ],
  },
  {
    category: 'Programming Languages',
    description: 'Foundational and systems programming languages.',
    skills: [
      { name: 'Python', level: 'Proficient', role: 'Backend APIs (FastAPI/Flask), ML pipelines, automation' },
      { name: 'SQL', level: 'Proficient', role: 'Relational schema design, queries, transactions' },
      { name: 'JavaScript', level: 'Proficient', role: 'Full-stack application logic, Node.js, React' },
      { name: 'C / C++', level: 'Core', role: 'Systems programming and algorithmic fundamentals' },
    ],
  },
  {
    category: 'Frontend Technologies & Tools',
    description: 'Modern component-driven web interfaces and engineering toolsets.',
    skills: [
      { name: 'React.js', level: 'Proficient', role: 'Component-based UI for 3-tier and analytics applications' },
      { name: 'HTML5 & CSS3', level: 'Proficient', role: 'Semantic markup, responsive layouts, design systems' },
      { name: 'Postman', level: 'Proficient', role: 'API testing, mock servers, request validation' },
      { name: 'VS Code', level: 'Proficient', role: 'Primary development environment and debugging' },
      { name: 'MobaXterm', level: 'Hands-on', role: 'Remote SSH terminal and cloud server management' },
    ],
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    company: 'Grras IT Solution',
    role: 'Cloud Internship',
    location: 'Ahmedabad, IN',
    period: 'Jan 2026 – Apr 2026',
    type: 'internship',
    highlights: [
      'Gained hands-on experience with core AWS services, including EC2, S3, IAM, Lambda, Auto Scaling, and Elastic Load Balancing.',
      'Implemented Auto Scaling to ensure high availability and fault tolerance of applications.',
      'Configured AWS Elastic Load Balancer to distribute traffic efficiently across multiple EC2 instances.',
      'Hosted a static website using Amazon S3 with proper configuration and public access control.',
      'Configured monitoring and alerting using Amazon CloudWatch integrated with SNS for real-time notifications.',
      'Architected a highly available and scalable three-tier Node.js application architecture on AWS.',
      'Applied security best practices using IAM roles, policies, and secure network configurations.',
      'Worked with AWS Lambda for serverless execution of event-driven tasks.',
    ],
  },
  {
    company: 'IBhavan',
    role: 'Summer Intern',
    location: 'Ahmedabad, IN',
    period: 'Jun 2024 – Jul 2024',
    type: 'internship',
    highlights: [
      'Completed a hands-on internship focused on AWS cloud services and deployment workflows.',
      'Implemented and demonstrated cloud-based projects, improving understanding of real-world cloud architectures.',
      'Gained practical experience with AWS services, deployment pipelines, and cloud fundamentals.',
      'Earned AWS Cloud Practitioner Certification, validating foundational cloud knowledge.',
    ],
  },
];

export const EDUCATION_TIMELINE: ExperienceItem[] = [
  {
    company: 'Ganpat University',
    role: 'B.Tech CSE with specialization in Cloud-Based Applications',
    location: 'Kherva, IN',
    period: '2023 – 2026',
    type: 'education',
    highlights: [
      'Rigorous academic curriculum focused on Cloud-Based Applications, Scalable Architectures, and Distributed Systems.',
      'Hands-on lab coursework across AWS cloud environments, containerization, and data-driven systems.',
    ],
  },
  {
    company: 'Government Polytechnic',
    role: 'Diploma in Electronics and Communication',
    location: 'Ahmedabad, IN',
    period: '2018 – 2021',
    type: 'education',
    highlights: [
      'Built strong fundamentals in digital electronics, computer hardware architecture, network signals, and communication protocols.',
    ],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: 'AWS Cloud Quest: Cloud Practitioner',
    issuer: 'AWS Skill Builder',
    type: 'Hands-on Cloud Credential',
    badgeCode: 'AWS-QUEST-CP',
  },
  {
    title: 'AWS Cloud Quest: AWS Technical Essentials',
    issuer: 'AWS Skill Builder',
    type: 'Technical Foundations',
    badgeCode: 'AWS-QUEST-TE',
  },
  {
    title: 'Digital Course: AWS Cloud Practitioner Essentials',
    issuer: 'AWS Skill Builder',
    type: 'Cloud Architecture Core',
    badgeCode: 'AWS-COURSE-CPE',
  },
];
