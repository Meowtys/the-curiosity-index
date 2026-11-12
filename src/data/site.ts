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
  location: string;
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

export const SITE = {
  name: 'Westen Dasig',
  fullName: 'John Westen Rey Dasig',
  subtitle: 'The Curiosity Index',
  role: 'CS Student at Foundation University Dumaguete · Full-Stack Builder',
  location: 'Tanjay City, Philippines',
  bio: "I'm Westen, a computer science student interested in exploring different areas of technology. I spend my time building software, working with hardware, and learning about things that catch my curiosity.",
  email: 'westendasig2003@gmail.com',
  siteUrl: 'https://westendasig.pages.dev',
  description:
    'Westen Dasig — The Curiosity Index. Computer science student at Foundation University Dumaguete and full-stack developer building web and mobile software, custom PCs, and handling computer and phone repairs.',
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
];

export const EDUCATION: readonly EducationItem[] = [
  {
    institution: 'Foundation University',
    degree: 'Bachelor of Science (BS) in Computer Science',
    location: 'Dumaguete City, Philippines',
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
