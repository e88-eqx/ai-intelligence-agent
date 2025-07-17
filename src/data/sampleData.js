// Sample data for AI Intelligence Agent Dashboard
export const sampleData = {
  summary: {
    totalTools: 24,
    newTools: 8,
    majorUpdates: 12,
    breakthroughs: 5,
    concerns: 3,
    weeklyGrowth: 15.8
  },
  
  newTools: [
    {
      id: 1,
      name: "Claude 3.5 Sonnet",
      category: "Developer",
      description: "Advanced AI assistant with improved coding capabilities and reasoning",
      releaseDate: "2024-06-20",
      company: "Anthropic",
      features: ["Code generation", "Complex reasoning", "Multi-modal"],
      audience: ["Developer", "Product Manager"],
      rating: 4.8,
      pricing: "Free tier + Pro",
      link: "https://claude.ai"
    },
    {
      id: 2,
      name: "Cursor IDE",
      category: "Developer",
      description: "AI-powered code editor with intelligent autocomplete and refactoring",
      releaseDate: "2024-06-15",
      company: "Cursor",
      features: ["Smart autocomplete", "Code refactoring", "Bug detection"],
      audience: ["Developer"],
      rating: 4.7,
      pricing: "Free + Pro",
      link: "https://cursor.sh"
    },
    {
      id: 3,
      name: "Figma AI",
      category: "Designer",
      description: "AI-powered design assistance and automated design system generation",
      releaseDate: "2024-06-10",
      company: "Figma",
      features: ["Auto-layout", "Design suggestions", "Component generation"],
      audience: ["Designer"],
      rating: 4.6,
      pricing: "Included in Pro",
      link: "https://figma.com"
    },
    {
      id: 4,
      name: "NotionAI 2.0",
      category: "Product Manager",
      description: "Enhanced AI writing assistant with project management capabilities",
      releaseDate: "2024-06-05",
      company: "Notion",
      features: ["Document generation", "Project planning", "Team collaboration"],
      audience: ["Product Manager", "Business"],
      rating: 4.5,
      pricing: "Add-on subscription",
      link: "https://notion.so"
    },
    {
      id: 5,
      name: "Salesforce Einstein GPT",
      category: "Business",
      description: "CRM-integrated AI for sales automation and customer insights",
      releaseDate: "2024-06-01",
      company: "Salesforce",
      features: ["Lead scoring", "Email automation", "Sales forecasting"],
      audience: ["Business"],
      rating: 4.4,
      pricing: "Enterprise",
      link: "https://salesforce.com"
    },
    {
      id: 6,
      name: "GitHub Copilot Workspace",
      category: "Developer",
      description: "AI-powered development environment with project-wide understanding",
      releaseDate: "2024-05-28",
      company: "GitHub",
      features: ["Project analysis", "Code generation", "Bug fixing"],
      audience: ["Developer"],
      rating: 4.9,
      pricing: "Pro subscription",
      link: "https://github.com"
    },
    {
      id: 7,
      name: "Adobe Firefly 3",
      category: "Designer",
      description: "Advanced generative AI for creative content creation",
      releaseDate: "2024-05-25",
      company: "Adobe",
      features: ["Image generation", "Video creation", "3D modeling"],
      audience: ["Designer"],
      rating: 4.7,
      pricing: "Creative Cloud",
      link: "https://adobe.com"
    },
    {
      id: 8,
      name: "Jira AI Assistant",
      category: "Product Manager",
      description: "AI-powered project management and issue tracking automation",
      releaseDate: "2024-05-20",
      company: "Atlassian",
      features: ["Issue categorization", "Sprint planning", "Risk assessment"],
      audience: ["Product Manager"],
      rating: 4.3,
      pricing: "Premium add-on",
      link: "https://atlassian.com"
    }
  ],

  majorUpdates: [
    {
      id: 1,
      tool: "ChatGPT",
      company: "OpenAI",
      update: "Custom GPTs marketplace launch",
      date: "2024-06-18",
      description: "Users can now create, share, and monetize custom AI assistants",
      impact: "High",
      category: "Platform"
    },
    {
      id: 2,
      tool: "Midjourney",
      company: "Midjourney",
      update: "V6 model with improved photorealism",
      date: "2024-06-12",
      description: "New model delivers significantly improved image quality and consistency",
      impact: "High",
      category: "Creative"
    },
    {
      id: 3,
      tool: "Google Gemini",
      company: "Google",
      update: "Gemini 1.5 Pro with 2M context window",
      date: "2024-06-08",
      description: "Expanded context window enables processing of entire codebases",
      impact: "High",
      category: "Development"
    },
    {
      id: 4,
      tool: "Microsoft 365 Copilot",
      company: "Microsoft",
      update: "Integration with Teams and Outlook",
      date: "2024-06-03",
      description: "AI assistant now works across all Microsoft 365 applications",
      impact: "Medium",
      category: "Business"
    }
  ],

  breakthroughs: [
    {
      id: 1,
      title: "GPT-4 Turbo with Vision",
      organization: "OpenAI",
      date: "2024-06-15",
      description: "Multimodal AI that can process text, images, and code simultaneously",
      significance: "Revolutionary",
      applications: ["Code review", "Design feedback", "Document analysis"],
      impact: "Transforms how developers and designers work with AI"
    },
    {
      id: 2,
      title: "Anthropic's Constitutional AI",
      organization: "Anthropic",
      date: "2024-06-10",
      description: "AI system that can self-correct and improve its responses based on ethical principles",
      significance: "High",
      applications: ["Safe AI deployment", "Ethical decision making", "Risk mitigation"],
      impact: "Addresses key concerns about AI safety and alignment"
    },
    {
      id: 3,
      title: "Google's Gemini Code Execution",
      organization: "Google",
      date: "2024-06-05",
      description: "AI that can write, execute, and debug code in real-time",
      significance: "High",
      applications: ["Automated testing", "Code verification", "Bug fixing"],
      impact: "Accelerates software development cycles"
    },
    {
      id: 4,
      title: "Meta's Code Llama 2",
      organization: "Meta",
      date: "2024-05-30",
      description: "Open-source code generation model rivaling proprietary solutions",
      significance: "Medium",
      applications: ["Open-source development", "Code completion", "Documentation"],
      impact: "Democratizes access to advanced coding AI"
    },
    {
      id: 5,
      title: "Stability AI's Stable Video Diffusion",
      organization: "Stability AI",
      date: "2024-05-25",
      description: "AI model that generates high-quality videos from text descriptions",
      significance: "High",
      applications: ["Video production", "Marketing content", "Prototyping"],
      impact: "Transforms video creation workflows"
    }
  ],

  concerns: [
    {
      id: 1,
      title: "AI Hallucination in Production Systems",
      severity: "High",
      description: "Increasing reports of AI systems generating false or misleading information in critical applications",
      affectedAreas: ["Healthcare", "Finance", "Legal"],
      mitigationStrategies: ["Human oversight", "Validation systems", "Confidence scoring"],
      status: "Active monitoring"
    },
    {
      id: 2,
      title: "Job Displacement Acceleration",
      severity: "Medium",
      description: "Rapid AI advancement leading to faster job market changes than anticipated",
      affectedAreas: ["Customer service", "Content creation", "Data analysis"],
      mitigationStrategies: ["Reskilling programs", "Gradual integration", "Human-AI collaboration"],
      status: "Industry response needed"
    },
    {
      id: 3,
      title: "AI Model Bias and Fairness",
      severity: "High",
      description: "Persistent bias issues in AI models affecting underrepresented groups",
      affectedAreas: ["Hiring", "Lending", "Healthcare"],
      mitigationStrategies: ["Diverse training data", "Bias testing", "Algorithmic auditing"],
      status: "Ongoing research"
    }
  ],

  marketTrends: [
    {
      id: 1,
      trend: "AI-First Development",
      description: "Companies building AI capabilities into core products from the ground up",
      growth: "+45%",
      timeframe: "Q2 2024"
    },
    {
      id: 2,
      trend: "Multimodal AI Adoption",
      description: "Increasing demand for AI that can process text, images, and audio simultaneously",
      growth: "+67%",
      timeframe: "Q2 2024"
    },
    {
      id: 3,
      trend: "AI Safety Investments",
      description: "Growing investment in AI safety research and responsible AI development",
      growth: "+89%",
      timeframe: "Q2 2024"
    },
    {
      id: 4,
      trend: "Edge AI Deployment",
      description: "Moving AI processing closer to data sources for better performance and privacy",
      growth: "+34%",
      timeframe: "Q2 2024"
    }
  ]
};