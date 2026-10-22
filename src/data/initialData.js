export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'CloudScale Infrastructure v2',
    code: 'CSI-2',
    category: 'DevOps & Cloud',
    description: 'Migrating legacy monolith into microservices cluster on Kubernetes with auto-scaling and zero-downtime CI/CD.',
    color: '#4f46e5',
    status: 'In Progress',
    health: 'On Track',
    startDate: '2026-09-01',
    dueDate: '2026-11-30',
    budgetTotal: 45000,
    budgetSpent: 28500,
    lead: 'Alex Rivera'
  },
  {
    id: 'proj-2',
    name: 'FinFlow Mobile App Redesign',
    code: 'FFM',
    category: 'Product & UX',
    description: 'Complete UX revamp of personal finance dashboard, onboarding flow, and instant biometric transfers.',
    color: '#06b6d4',
    status: 'In Progress',
    health: 'On Track',
    startDate: '2026-09-15',
    dueDate: '2026-12-15',
    budgetTotal: 38000,
    budgetSpent: 22100,
    lead: 'Maya Patel'
  },
  {
    id: 'proj-3',
    name: 'AI Agent Workflow Engine',
    code: 'AWE',
    category: 'Artificial Intelligence',
    description: 'Autonomous multi-agent orchestration service with function calling, retrieval augmentation, and real-time streaming.',
    color: '#8b5cf6',
    status: 'Planning',
    health: 'At Risk',
    startDate: '2026-10-01',
    dueDate: '2027-01-20',
    budgetTotal: 62000,
    budgetSpent: 14500,
    lead: 'Elena Rostova'
  },
  {
    id: 'proj-4',
    name: 'Unified Design System (Titan)',
    code: 'TDS',
    category: 'Design Systems',
    description: 'Enterprise React & Figma tokenized design system supporting dark/light mode, accessibility standards (WCAG AAA), and animations.',
    color: '#ec4899',
    status: 'Completed',
    health: 'On Track',
    startDate: '2026-07-01',
    dueDate: '2026-10-15',
    budgetTotal: 25000,
    budgetSpent: 23800,
    lead: 'Jordan Lee'
  }
];

export const INITIAL_TEAM = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    role: 'Principal Cloud Architect',
    email: 'alex.rivera@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    capacity: 85,
    department: 'Engineering'
  },
  {
    id: 'user-2',
    name: 'Maya Patel',
    role: 'Lead Product Designer',
    email: 'maya.patel@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    capacity: 70,
    department: 'Design'
  },
  {
    id: 'user-3',
    name: 'Elena Rostova',
    role: 'Senior AI Engineer',
    email: 'elena.rostova@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    capacity: 92,
    department: 'Engineering'
  },
  {
    id: 'user-4',
    name: 'Jordan Lee',
    role: 'Frontend Engineering Lead',
    email: 'jordan.lee@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    capacity: 60,
    department: 'Engineering'
  },
  {
    id: 'user-5',
    name: 'Samir Chen',
    role: 'Full Stack Developer',
    email: 'samir.chen@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    capacity: 75,
    department: 'Engineering'
  },
  {
    id: 'user-6',
    name: 'Chloe Davis',
    role: 'QA & Test Automation Lead',
    email: 'chloe.davis@pulseflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    capacity: 45,
    department: 'Quality Assurance'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Configure Terraform Helm charts for EKS cluster',
    description: 'Set up declarative infrastructure scripts with VPC subnets, IAM roles, and Prometheus ingress controllers.',
    status: 'in-progress',
    priority: 'Urgent',
    assigneeId: 'user-1',
    dueDate: '2026-10-25',
    tags: ['DevOps', 'Terraform', 'AWS'],
    subtasks: [
      { id: 'sub-1', title: 'Write terraform module for VPC peering', completed: true },
      { id: 'sub-2', title: 'Configure cert-manager with Let\'s Encrypt', completed: true },
      { id: 'sub-3', title: 'Test multi-az fallback failover', completed: false }
    ],
    commentsCount: 4,
    estimatedHours: 16,
    loggedHours: 11
  },
  {
    id: 'task-102',
    projectId: 'proj-2',
    title: 'Design Dark Mode tokens for Transaction History screen',
    description: 'Create high-contrast tokens in Figma complying with WCAG AAA standards for low-light banking view.',
    status: 'in-review',
    priority: 'High',
    assigneeId: 'user-2',
    dueDate: '2026-10-24',
    tags: ['Figma', 'UI/UX', 'Dark Mode'],
    subtasks: [
      { id: 'sub-4', title: 'Audit color contrast ratios', completed: true },
      { id: 'sub-5', title: 'Stakeholder review session', completed: true }
    ],
    commentsCount: 7,
    estimatedHours: 8,
    loggedHours: 7.5
  },
  {
    id: 'task-103',
    projectId: 'proj-3',
    title: 'Implement streaming tool execution fallback',
    description: 'Add error recovery handler when external MCP tools return rate limit or timeout errors during LLM inference.',
    status: 'todo',
    priority: 'Urgent',
    assigneeId: 'user-3',
    dueDate: '2026-10-26',
    tags: ['AI', 'Python', 'FastAPI'],
    subtasks: [
      { id: 'sub-6', title: 'Unit test retry exponential backoff', completed: false },
      { id: 'sub-7', title: 'Add circuit breaker threshold', completed: false }
    ],
    commentsCount: 2,
    estimatedHours: 12,
    loggedHours: 0
  },
  {
    id: 'task-104',
    projectId: 'proj-2',
    title: 'Integrate WebAuthn Biometric passkey login',
    description: 'Connect frontend authentication flow to Passkey credentials API with fallback SMS OTP verification.',
    status: 'in-progress',
    priority: 'High',
    assigneeId: 'user-4',
    dueDate: '2026-10-28',
    tags: ['Security', 'Frontend', 'Auth'],
    subtasks: [
      { id: 'sub-8', title: 'Verify public key credential registration', completed: true },
      { id: 'sub-9', title: 'Handle platform authenticator cancellation', completed: false }
    ],
    commentsCount: 5,
    estimatedHours: 20,
    loggedHours: 14
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    title: 'Set up Grafana dashboards & PagerDuty alerts',
    description: 'Establish SLI/SLO metrics for p99 latency, HTTP 5xx error spikes, and memory saturation alerts.',
    status: 'todo',
    priority: 'Medium',
    assigneeId: 'user-5',
    dueDate: '2026-10-30',
    tags: ['Monitoring', 'SRE'],
    subtasks: [
      { id: 'sub-10', title: 'Import redis and postgres dashboard templates', completed: false },
      { id: 'sub-11', title: 'Simulate synthetic traffic outage alert', completed: false }
    ],
    commentsCount: 1,
    estimatedHours: 10,
    loggedHours: 0
  },
  {
    id: 'task-106',
    projectId: 'proj-4',
    title: 'Publish v1.4.0 NPM package for Design System',
    description: 'Finalize release notes, build ESM & CJS distribution bundles, update documentation site.',
    status: 'done',
    priority: 'Medium',
    assigneeId: 'user-4',
    dueDate: '2026-10-14',
    tags: ['NPM', 'React', 'Documentation'],
    subtasks: [
      { id: 'sub-12', title: 'Generate changelog with semantic-release', completed: true },
      { id: 'sub-13', title: 'Publish Storybook live deployment', completed: true }
    ],
    commentsCount: 12,
    estimatedHours: 6,
    loggedHours: 5.5
  },
  {
    id: 'task-107',
    projectId: 'proj-3',
    title: 'Benchmark Vector Database Retrieval Latency',
    description: 'Run load testing on Qdrant vs pgvector with 500k embedding vectors and 50 concurrency.',
    status: 'backlog',
    priority: 'Low',
    assigneeId: 'user-3',
    dueDate: '2026-11-05',
    tags: ['AI', 'Performance', 'Database'],
    subtasks: [],
    commentsCount: 0,
    estimatedHours: 14,
    loggedHours: 0
  },
  {
    id: 'task-108',
    projectId: 'proj-2',
    title: 'Automated end-to-end Cypress test suite',
    description: 'Create regression test suite for money transfer flow, card locking, and profile settings update.',
    status: 'done',
    priority: 'High',
    assigneeId: 'user-6',
    dueDate: '2026-10-18',
    tags: ['Testing', 'E2E', 'QA'],
    subtasks: [
      { id: 'sub-14', title: 'Write tests for funds transfer validation', completed: true },
      { id: 'sub-15', title: 'Configure CI GitHub Actions workflow', completed: true }
    ],
    commentsCount: 3,
    estimatedHours: 18,
    loggedHours: 16
  }
];

export const INITIAL_ACTIVITY = [
  {
    id: 'act-1',
    user: 'Jordan Lee',
    action: 'published design tokens',
    target: 'Unified Design System (Titan)',
    timestamp: '15 minutes ago',
    type: 'success'
  },
  {
    id: 'act-2',
    user: 'Alex Rivera',
    action: 'updated Terraform charts',
    target: 'CloudScale Infrastructure v2',
    timestamp: '1 hour ago',
    type: 'primary'
  },
  {
    id: 'act-3',
    user: 'Maya Patel',
    action: 'submitted PR for review',
    target: 'Dark Mode tokens for Transaction History',
    timestamp: '3 hours ago',
    type: 'warning'
  },
  {
    id: 'act-4',
    user: 'Chloe Davis',
    action: 'passed 32 automated tests',
    target: 'FinFlow Mobile App Redesign',
    timestamp: '5 hours ago',
    type: 'info'
  }
];

export const INITIAL_TIMELOGS = [
  {
    id: 'tl-1',
    taskId: 'task-101',
    projectId: 'proj-1',
    taskTitle: 'Configure Terraform Helm charts for EKS cluster',
    projectName: 'CloudScale Infrastructure v2',
    userName: 'Alex Rivera',
    duration: 14400, // 4 hours in seconds
    date: '2026-10-22',
    billable: true,
    notes: 'Configured ingress routing and TLS cert automation'
  },
  {
    id: 'tl-2',
    taskId: 'task-104',
    projectId: 'proj-2',
    taskTitle: 'Integrate WebAuthn Biometric passkey login',
    projectName: 'FinFlow Mobile App Redesign',
    userName: 'Jordan Lee',
    duration: 10800, // 3 hours
    date: '2026-10-22',
    billable: true,
    notes: 'Handled user credential registration and platform prompt'
  },
  {
    id: 'tl-3',
    taskId: 'task-102',
    projectId: 'proj-2',
    taskTitle: 'Design Dark Mode tokens for Transaction History screen',
    projectName: 'FinFlow Mobile App Redesign',
    userName: 'Maya Patel',
    duration: 7200, // 2 hours
    date: '2026-10-21',
    billable: false,
    notes: 'Design review with accessibility specialist'
  }
];
