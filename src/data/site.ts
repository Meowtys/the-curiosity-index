export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
  external: boolean;
}

export interface ExperienceItem {
  title: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  summary?: string;
  activities?: string[];
}

export interface ToolboxGroup {
  category: string;
  items: string[];
}

export interface ExploringItem {
  topic: string;
  tag: string;
  description: string;
}

export type ProjectStatus = 'Live' | 'Open Beta' | 'In Development' | 'Archived';

const STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  Live: 'badge-status badge-live',
  'Open Beta': 'badge-status badge-beta',
  'In Development': 'badge-status badge-dev',
  Archived: 'badge-status badge-archived',
};

export function getStatusBadgeClass(status: ProjectStatus): string {
  return STATUS_BADGE_CLASSES[status];
}

export const SITE = {
  name: 'Westen Dasig',
  fullName: 'John Westen Rey Dasig',
  subtitle: 'The Curiosity Index',
  role: 'CS Student at Foundation University Dumaguete · Full-Stack Builder',
  location: 'Tanjay City, Philippines',
  bio: "I'm a computer science student interested in exploring different areas of technology. I spend my time building software, working with hardware, and learning about things that catch my curiosity.",
  email: 'westendasig2003@gmail.com',
  siteUrl: 'https://westendasig.pages.dev',
  description:
    'Westen Dasig — CS student at Foundation University Dumaguete and full-stack developer building web and mobile apps, custom PCs, and device repairs.',
} as const;

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: 'Email',
    href: 'mailto:westendasig2003@gmail.com',
    handle: 'westendasig2003@gmail.com',
    external: false,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Meowtys',
    handle: 'github.com/Meowtys',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/westen-dasig/',
    handle: 'linkedin.com/in/westen-dasig',
    external: true,
  },
];

export const EXPERIENCE: readonly ExperienceItem[] = [
  {
    title: 'Software Quality Assurance Intern',
    organization: 'eGetinnz',
    period: 'Jun 2026 – Aug 2026',
    location: 'Remote',
    summary:
      'Conducted exploratory QA testing across partner brand websites and prototyped automated web crawling and merchant data extraction pipelines.',
    highlights: [
      'Conducted exploratory QA testing across multiple partner brand websites, covering UI/UX, navigation, usability, and functionality, and documented issues with recommendations for improvement.',
      'Researched and evaluated web crawling and data extraction tools, including Crawl4AI and Trafilatura, and built a web crawler prototype to assess automating merchant discovery across websites with varying structures.',
      'Performed structured data sourcing for a Southeast Asian (Myanmar) e-commerce business directory.',
    ],
  },
  {
    title: 'Event Host',
    organization: 'SugarPy Meetup Event (Negros Island Python User Group)',
    period: 'September 2025',
    location: 'DICT Digital Transformation Center · Dumaguete City',
    summary:
      'Hosted the local Python developer community gathering featuring hands-on workshops on Python fundamentals, FastAPI web services, and Retrieval-Augmented Generation (RAG).',
    highlights: [
      'Coordinated speaker transitions, program flow, and technical sessions for students and developers across Negros Oriental.',
    ],
  },
  {
    title: 'Teaching Assistant',
    organization: 're:load Agentic AI Edition',
    period: 'September 2025',
    location: 'Dumaguete City, Philippines',
    summary:
      'Supported the hands-on workshop "Building AI Agents with Python using LangGraph" led by Jouella Fabe (Senior Software Engineer, PagerDuty).',
    highlights: [
      'Assisted attendees with Python environment configuration, dependency troubleshooting, and LangGraph state-graph execution.',
    ],
  },
  {
    title: 'Founder & Technician',
    organization: 'WesTech',
    period: '2020 – Present',
    location: 'Tanjay City, Philippines',
    summary:
      'Local computer and phone repair shop and custom PC building business.',
    highlights: [
      'Troubleshoot and repair laptops, desktop PCs, and mobile phones for local clients.',
      'Select parts, assemble, cable-manage, and test custom desktop PC builds matched to each client’s budget and workload.',
    ],
  },
];

export const EDUCATION: readonly EducationItem[] = [
  {
    institution: 'Foundation University',
    degree: 'Bachelor of Science (BS) in Computer Science',
    period: '2025 – 2027',
    location: 'Dumaguete City, Philippines',
    activities: [
      '4th Year Computer Science Representative, Executive Council of Student Leaders (2026–Present)',
      'Multimedia Committee Member, Executive Council of Student Leaders (2025–2026)',
    ],
  },
  {
    institution: 'Silliman University',
    degree: 'Bachelor of Science (BS) in Computer Science',
    period: '2021 – 2025',
    location: 'Dumaguete City, Philippines',
    summary:
      'Completed Computer Science coursework from 2021 to 2025 before transferring to Foundation University to finish my degree.',
    activities: [
      'Executive Chairperson, Research Committee, Silliman University Student Government (2023–2024)',
      'Legislative Representative, Student Assembly, Silliman University Student Government (2022–2023)',
      'Technical Head, Cheering Committee, Silliman University Student Government (2022–2023)',
      'Press Relations Officer, Confederates Student Council, College of Computer Studies (2022–2023)',
    ],
  },
];

export const TOOLBOX: readonly ToolboxGroup[] = [
  {
    category: 'Languages & Backend',
    items: [
      'PHP 8.2–8.4',
      'Laravel 13',
      'Python',
      'Dart',
      'TypeScript',
      'JavaScript',
      'MariaDB / MySQL',
      'SQLite',
    ],
  },
  {
    category: 'Frontend & Mobile',
    items: [
      'Flutter (Android)',
      'React 19',
      'Inertia.js v3',
      'Astro',
      'Tailwind CSS v4',
      'Semantic HTML & CSS',
    ],
  },
  {
    category: 'On-Device ML & Infrastructure',
    items: [
      'Google ML Kit',
      'TensorFlow Lite (MobileFaceNet)',
      'Firebase Auth & Cloud Firestore',
      'Cloudflare Pages',
      'Railway',
      'Vercel',
    ],
  },
  {
    category: 'Quality, Security & Hardware',
    items: [
      'PHPUnit',
      'PHPStan / Larastan',
      'Flutter Test',
      'WCAG 2.2 AA Accessibility',
      'PC & Mobile Hardware Diagnostics',
      'Custom PC Assembly',
    ],
  },
];

export const CORE_STACK: readonly string[] = [
  'Laravel 13',
  'PHP 8.4',
  'React 19',
  'Inertia 3',
  'Flutter',
  'Dart',
  'TypeScript',
  'Python',
  'Astro',
  'Tailwind CSS v4',
  'TensorFlow Lite',
  'MariaDB / MySQL',
];

export const EXPLORING: readonly ExploringItem[] = [
  {
    topic: 'On-Device ML & Vision',
    tag: 'Android · TFLite',
    description:
      'Running quantized MobileFaceNet embeddings and Google ML Kit pipelines directly on Android devices for zero-cost offline verification.',
  },
  {
    topic: 'AI Agents & RAG Workflows',
    tag: 'Python · LangGraph',
    description:
      'Building stateful multi-step agent graphs and retrieval-augmented generation pipelines in Python.',
  },
  {
    topic: 'Full-Stack Web Systems',
    tag: 'Laravel · React · Astro',
    description:
      'Designing type-safe monolithic applications with Laravel 13, Inertia.js v3, and React 19 alongside zero-JS static Astro frontends.',
  },
  {
    topic: 'Custom PC Builds & Repair',
    tag: 'WesTech · Tanjay City',
    description:
      'Selecting components, assembling custom desktop builds, and troubleshooting laptop, PC, and mobile hardware for local clients.',
  },
];
