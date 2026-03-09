import type { IWordPressService } from '~/interfaces/IWordPressService'
import type { IPost } from '~/interfaces/IPost'
import type { ICategory } from '~/interfaces/ICategory'
import { PostModel } from '~/models/PostModel'
import { CategoryModel } from '~/models/CategoryModel'

const MOCK_CATEGORIES = [
  { id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' as const },
  { id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' as const },
  { id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' as const },
]

const MOCK_POSTS = [
  {
    id: 1,
    slug: 'gpt-4o-everything-you-need-to-know',
    date: '2025-02-10T10:00:00',
    title: { rendered: 'GPT-4o: Everything You Need to Know' },
    excerpt: { rendered: `<p>OpenAI's latest model brings multimodal capabilities to the masses. Here's a full breakdown of what changed and why it matters for developers.</p>` },
    content: { rendered: `<p>GPT-4o (pronounced "omni") is OpenAI's flagship model combining text, audio, and vision in a single unified system. Unlike GPT-4 Turbo, it processes all modalities natively without separate encoders.</p><h2>Key Improvements</h2><p>Faster response times, lower cost per token, and natively streaming audio make it a step change for real-time applications.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/gpt4o/800/450', alt_text: 'GPT-4o' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 10, name: 'openai', slug: 'openai', count: 5, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 2,
    slug: 'google-gemini-ultra-vs-gpt4',
    date: '2025-02-18T09:30:00',
    title: { rendered: 'Google Gemini Ultra vs GPT-4: The Real Comparison' },
    excerpt: { rendered: `<p>We ran both models through 200 benchmarks across coding, reasoning, and creativity. The results may surprise you.</p>` },
    content: { rendered: `<p>Gemini Ultra and GPT-4 are both frontier models, but they have very different strengths. In coding (HumanEval): GPT-4 87.1% vs Gemini Ultra 74.4%. In math (MATH): Gemini 59.4% vs GPT-4 52.9%.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', description: 'ML engineer and benchmarking enthusiast.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/gemini/800/450', alt_text: 'Gemini vs GPT' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 11, name: 'google', slug: 'google', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 3,
    slug: 'claude-3-opus-coding-assistant',
    date: '2025-03-01T08:00:00',
    title: { rendered: 'Claude 3 Opus: The Best Coding Assistant?' },
    excerpt: { rendered: `<p>Anthropic's Claude 3 Opus has been quietly dominating coding benchmarks. We tested it on real-world projects to see if the hype is real.</p>` },
    content: { rendered: `<p>Claude 3 Opus scored 84.9% on HumanEval, beating GPT-4 Turbo in several head-to-head tests. More impressively, it handles 200k token context windows natively — useful for large codebases.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', description: 'Full-stack developer and AI tooling reviewer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/claude3/800/450', alt_text: 'Claude 3' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 12, name: 'anthropic', slug: 'anthropic', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 4,
    slug: 'prompt-engineering-best-practices-2025',
    date: '2025-03-05T11:00:00',
    title: { rendered: 'Prompt Engineering Best Practices in 2025' },
    excerpt: { rendered: `<p>Prompt engineering has matured. Here are the techniques that actually work across GPT, Gemini, and Claude in 2025.</p>` },
    content: { rendered: `<p>Chain-of-thought, few-shot examples, and role prompting remain the core toolkit. In 2025 we also have structured output schemas, tool-use patterns, and multi-agent orchestration.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/prompt/800/450', alt_text: 'Prompt Engineering' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 13, name: 'prompting', slug: 'prompting', count: 6, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 5,
    slug: 'gemini-flash-speed-benchmark',
    date: '2025-03-08T07:00:00',
    title: { rendered: 'Gemini Flash: Speed Without Sacrifice' },
    excerpt: { rendered: `<p>Google's lighter Gemini Flash model hits an incredible speed-to-quality ratio. We benchmarked it for production use cases.</p>` },
    content: { rendered: `<p>Gemini Flash generates 1,000 tokens in under 0.8 seconds on average. For classification, summarisation, and extraction tasks it matches Gemini Pro at a fraction of the cost.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', description: 'ML engineer and benchmarking enthusiast.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/flash/800/450', alt_text: 'Gemini Flash' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 14, name: 'speed', slug: 'speed', count: 2, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 6,
    slug: 'claude-haiku-for-production-apps',
    date: '2025-03-09T06:00:00',
    title: { rendered: 'Claude Haiku: Production-Ready AI on a Budget' },
    excerpt: { rendered: `<p>Anthropic's smallest model packs a punch for structured tasks. Here's how to get the most out of Claude Haiku in production.</p>` },
    content: { rendered: `<p>Claude Haiku is Anthropic's fastest and most cost-effective model. At $0.25/M input tokens it is the go-to choice for high-volume classification, extraction, and summarisation workloads.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', description: 'Full-stack developer and AI tooling reviewer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/haiku/800/450', alt_text: 'Claude Haiku' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 15, name: 'production', slug: 'production', count: 4, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 7,
    slug: 'gpt-4-vision-use-cases',
    date: '2025-01-20T10:00:00',
    title: { rendered: 'GPT-4 Vision: 10 Real Use Cases Developers Love' },
    excerpt: { rendered: `<p>From receipt scanning to diagram-to-code, GPT-4V is unlocking new product categories. Here are ten that are shipping in production.</p>` },
    content: { rendered: `<p>GPT-4 Vision accepts image inputs alongside text, enabling a new class of applications — OCR, chart analysis, UI generation from screenshots, and more.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/vision/800/450', alt_text: 'GPT Vision' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 16, name: 'vision', slug: 'vision', count: 3, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 8,
    slug: 'gemini-code-assist-review',
    date: '2025-01-28T09:00:00',
    title: { rendered: 'Gemini Code Assist: A Deep Dive Review' },
    excerpt: { rendered: `<p>Google's Gemini Code Assist is now available in VS Code and JetBrains. We used it for two weeks to give you the honest verdict.</p>` },
    content: { rendered: `<p>Gemini Code Assist integrates into your IDE and offers inline completions, chat, and code generation. It handles large files better than GitHub Copilot in our tests.</p>` },
    _embedded: {
      author: [{ id: 2, name: 'Sara Patel', description: 'ML engineer and benchmarking enthusiast.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=5' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/codeassist/800/450', alt_text: 'Gemini Code Assist' }],
      'wp:term': [
        [{ id: 2, name: 'Gemini', slug: 'gemini', count: 3, taxonomy: 'category' }],
        [{ id: 17, name: 'coding', slug: 'coding', count: 5, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 9,
    slug: 'claude-constitutional-ai-explained',
    date: '2025-02-05T08:00:00',
    title: { rendered: 'Constitutional AI: How Anthropic Builds Safe Models' },
    excerpt: { rendered: `<p>Anthropic's Constitutional AI framework is the foundation of Claude's safety. We explain how it works and why it matters.</p>` },
    content: { rendered: `<p>Constitutional AI (CAI) is a training technique where the model critiques and revises its own outputs against a set of principles. This reduces harmful outputs without sacrificing helpfulness.</p>` },
    _embedded: {
      author: [{ id: 3, name: 'James Liu', description: 'Full-stack developer and AI tooling reviewer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=33' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/cai/800/450', alt_text: 'Constitutional AI' }],
      'wp:term': [
        [{ id: 3, name: 'Claude', slug: 'claude', count: 3, taxonomy: 'category' }],
        [{ id: 18, name: 'safety', slug: 'safety', count: 4, taxonomy: 'post_tag' }],
      ],
    },
  },
  {
    id: 10,
    slug: 'ai-agents-2025-landscape',
    date: '2025-03-07T12:00:00',
    title: { rendered: 'AI Agents in 2025: The Full Landscape' },
    excerpt: { rendered: `<p>From LangChain to AutoGPT to Claude's tool use — autonomous AI agents are maturing fast. Here's where the ecosystem stands today.</p>` },
    content: { rendered: `<p>AI agents combine LLMs with tools, memory, and planning to autonomously complete multi-step tasks. In 2025 the major frameworks are LangGraph, CrewAI, AutoGen, and Anthropic's own agent primitives.</p>` },
    _embedded: {
      author: [{ id: 1, name: 'Alex Kim', description: 'AI researcher and writer.', avatar_urls: { '96': 'https://i.pravatar.cc/96?img=11' } }],
      'wp:featuredmedia': [{ source_url: 'https://picsum.photos/seed/agents/800/450', alt_text: 'AI Agents' }],
      'wp:term': [
        [{ id: 1, name: 'GPT', slug: 'gpt', count: 4, taxonomy: 'category' }],
        [{ id: 19, name: 'agents', slug: 'agents', count: 6, taxonomy: 'post_tag' }],
      ],
    },
  },
]

export class MockWordPressService implements IWordPressService {
  async getPosts(page = 1, perPage = 10): Promise<IPost[]> {
    const start = (page - 1) * perPage
    return MOCK_POSTS.slice(start, start + perPage).map(raw => new PostModel(raw as any))
  }

  async getPostBySlug(slug: string): Promise<IPost | null> {
    const raw = MOCK_POSTS.find(p => p.slug === slug)
    return raw ? new PostModel(raw as any) : null
  }

  async getCategories(): Promise<ICategory[]> {
    return MOCK_CATEGORIES.map(raw => new CategoryModel(raw as any))
  }

  async getPostsByCategory(categoryId: number, _page = 1): Promise<IPost[]> {
    return MOCK_POSTS
      .filter(p => p._embedded['wp:term'][0].some((t: any) => t.id === categoryId))
      .map(raw => new PostModel(raw as any))
  }
}
