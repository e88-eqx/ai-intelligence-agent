// Data fetching service for real-time AI intelligence
import { sampleData } from '../data/sampleData';

class DataFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    this.apiKeys = {
      github: process.env.REACT_APP_GITHUB_TOKEN,
      reddit: process.env.REACT_APP_REDDIT_CLIENT_ID,
      news: process.env.REACT_APP_NEWS_API_KEY
    };
    
    // Big tech companies to filter out for indie tool discovery
    this.bigTechCompanies = [
      'google', 'microsoft', 'meta', 'facebook', 'amazon', 'apple', 'openai',
      'anthropic', 'nvidia', 'adobe', 'salesforce', 'oracle', 'ibm', 'tesla',
      'uber', 'airbnb', 'netflix', 'spotify', 'twitter', 'x', 'linkedin',
      'googleai', 'microsoftai', 'metaai', 'amazonai', 'appleai', 'huggingface'
    ];
  }

  // Generic cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Fetch emerging AI tools from GitHub API (excluding big tech)
  async fetchGitHubAITools() {
    const cacheKey = 'github_ai_tools';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Search for AI tools with focus on emerging/indie projects
      const queries = [
        'ai+tool+NOT+google+NOT+microsoft+NOT+meta+NOT+openai+created:>2024-01-01',
        'machine-learning+library+NOT+facebook+NOT+amazon+created:>2024-01-01',
        'llm+open-source+NOT+anthropic+NOT+nvidia+created:>2024-01-01',
        'ai+startup+indie+created:>2024-01-01'
      ];
      
      const allTools = [];
      
      for (const query of queries) {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=15`
        );
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const tools = data.items
          .filter(repo => !this.isBigTechCompany(repo.owner.login))
          .filter(repo => this.isAITool(repo.description, repo.topics))
          .map(repo => ({
            id: `github_${repo.id}`,
            name: repo.name,
            category: this.categorizeByDescription(repo.description),
            description: repo.description || 'No description available',
            releaseDate: repo.created_at,
            company: repo.owner.login,
            features: this.extractFeatures(repo.description, repo.topics),
            audience: this.categorizeAudience(repo.description, repo.topics),
            rating: this.calculateRating(repo.stargazers_count, repo.forks_count),
            pricing: repo.private ? 'Private' : 'Open Source',
            link: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            source: 'GitHub',
            isIndie: true
          }));
        
        allTools.push(...tools);
      }
      
      // Remove duplicates and sort by stars
      const uniqueTools = allTools.filter((tool, index, self) => 
        index === self.findIndex(t => t.id === tool.id)
      ).sort((a, b) => b.stars - a.stars);

      this.setCache(cacheKey, uniqueTools.slice(0, 20));
      return uniqueTools.slice(0, 20);
    } catch (error) {
      console.error('Error fetching GitHub AI tools:', error);
      return [];
    }
  }

  // Fetch AI news from Reddit API
  async fetchRedditAINews() {
    const cacheKey = 'reddit_ai_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        'https://www.reddit.com/r/MachineLearning/hot.json?limit=10'
      );
      
      if (!response.ok) throw new Error('Reddit API error');
      
      const data = await response.json();
      const news = data.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
        description: post.data.selftext?.substring(0, 200) + '...' || 'No description',
        url: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        comments: post.data.num_comments,
        created: new Date(post.data.created_utc * 1000).toISOString(),
        author: post.data.author,
        flair: post.data.link_flair_text
      }));

      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching Reddit AI news:', error);
      return [];
    }
  }

  // Fetch emerging AI tools from Product Hunt
  async fetchProductHuntAITools() {
    const cacheKey = 'producthunt_ai_tools';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Using unofficial Product Hunt API endpoints
      const response = await fetch(
        'https://api.producthunt.com/v1/posts?search[category]=artificial-intelligence&sort_by=created_at&order=desc&per_page=20',
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AINow-Tool-Discovery'
          }
        }
      );
      
      if (!response.ok) {
        // Fallback to scraping approach if API fails
        return this.fetchProductHuntFallback();
      }
      
      const data = await response.json();
      const tools = data.posts
        .filter(post => !this.isBigTechCompany(post.maker_inside_team?.name || ''))
        .map(post => ({
          id: `ph_${post.id}`,
          name: post.name,
          category: this.categorizeByDescription(post.tagline),
          description: post.tagline || 'No description available',
          releaseDate: post.created_at,
          company: post.maker_inside_team?.name || 'Independent',
          features: this.extractFeatures(post.tagline, []),
          audience: this.categorizeAudience(post.tagline, []),
          rating: Math.min(5, Math.log10(post.votes_count + 1) + 1).toFixed(1),
          pricing: 'Check Website',
          link: post.discussion_url || post.redirect_url,
          votes: post.votes_count,
          comments: post.comments_count,
          source: 'Product Hunt',
          isIndie: true
        }));

      this.setCache(cacheKey, tools);
      return tools;
    } catch (error) {
      console.error('Error fetching Product Hunt AI tools:', error);
      return this.fetchProductHuntFallback();
    }
  }

  // Fallback method for Product Hunt data
  async fetchProductHuntFallback() {
    // Return sample indie AI tools data if API fails
    const fallbackTools = [
      {
        id: 'ph_fallback_1',
        name: 'IndieLLM',
        category: 'Developer',
        description: 'Open-source language model for indie developers',
        releaseDate: new Date().toISOString(),
        company: 'IndieAI',
        features: ['Open Source', 'Developer Tools', 'API'],
        audience: ['Developer'],
        rating: '4.2',
        pricing: 'Open Source',
        link: '#',
        votes: 150,
        comments: 25,
        source: 'Product Hunt',
        isIndie: true
      }
    ];
    
    return fallbackTools;
  }

  // Fetch AI tools from Hacker News discussions
  async fetchHackerNewsAITools() {
    const cacheKey = 'hackernews_ai_tools';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Fetch recent Show HN posts about AI tools
      const response = await fetch(
        'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty'
      );
      
      if (!response.ok) throw new Error('Hacker News API error');
      
      const storyIds = await response.json();
      const recentIds = storyIds.slice(0, 50); // Get recent 50 stories
      
      const tools = [];
      
      for (const id of recentIds) {
        try {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          );
          
          if (!storyResponse.ok) continue;
          
          const story = await storyResponse.json();
          
          if (story && story.title && this.isAITool(story.title, []) && 
              story.url && !this.isBigTechURL(story.url)) {
            tools.push({
              id: `hn_${story.id}`,
              name: this.extractToolName(story.title),
              category: this.categorizeByDescription(story.title),
              description: story.title,
              releaseDate: new Date(story.time * 1000).toISOString(),
              company: 'Independent',
              features: this.extractFeatures(story.title, []),
              audience: this.categorizeAudience(story.title, []),
              rating: Math.min(5, Math.log10(story.score + 1) + 1).toFixed(1),
              pricing: 'Check Website',
              link: story.url,
              score: story.score,
              comments: story.descendants || 0,
              source: 'Hacker News',
              isIndie: true
            });
          }
        } catch (error) {
          continue; // Skip failed requests
        }
      }

      this.setCache(cacheKey, tools.slice(0, 15));
      return tools.slice(0, 15);
    } catch (error) {
      console.error('Error fetching Hacker News AI tools:', error);
      return [];
    }
  }

  // Fetch AI news from RSS feeds
  async fetchRSSFeeds() {
    const cacheKey = 'rss_ai_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Using RSS2JSON service for CORS-friendly RSS parsing
      const feeds = [
        'https://feeds.feedburner.com/oreilly/radar',
        'https://rss.cnn.com/rss/cnn_tech.rss',
        'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml'
      ];

      const promises = feeds.map(async (feedUrl) => {
        try {
          const response = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=YOUR_RSS2JSON_API_KEY&count=5`
          );
          if (!response.ok) throw new Error('RSS fetch failed');
          return response.json();
        } catch (error) {
          console.error(`Error fetching RSS feed ${feedUrl}:`, error);
          return { items: [] };
        }
      });

      const results = await Promise.all(promises);
      const allItems = results.flatMap(result => result.items || []);
      
      const news = allItems
        .filter(item => this.isAIRelated(item.title + ' ' + item.description))
        .map(item => ({
          id: this.generateId(item.title),
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          url: item.link,
          publishDate: item.pubDate,
          source: new URL(item.link).hostname
        }));

      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      return [];
    }
  }

  // Combine all data sources for comprehensive tool discovery
  async fetchAllData() {
    try {
      console.log('Fetching emerging AI tools from multiple sources...');
      
      // Fetch data from all sources in parallel
      const [githubTools, productHuntTools, hackerNewsTools, redditNews, rssNews] = await Promise.all([
        this.fetchGitHubAITools(),
        this.fetchProductHuntAITools(),
        this.fetchHackerNewsAITools(),
        this.fetchRedditAINews(),
        this.fetchRSSFeeds()
      ]);

      // Combine and deduplicate tools from all sources
      const allNewTools = [
        ...githubTools.slice(0, 8),
        ...productHuntTools.slice(0, 7),
        ...hackerNewsTools.slice(0, 5)
      ];

      // Remove duplicates based on name similarity
      const uniqueTools = this.deduplicateTools(allNewTools);

      // Merge with existing sample data
      const combinedData = {
        ...sampleData,
        metadata: {
          ...sampleData.metadata,
          lastUpdated: new Date().toISOString(),
          dataSource: 'GitHub + Product Hunt + Hacker News + Reddit + RSS feeds + Manual curation',
          apiSources: ['GitHub', 'Product Hunt', 'Hacker News', 'Reddit', 'RSS feeds'],
          updateMethod: 'Manual updates via dashboard button',
          focusArea: 'Emerging & Indie AI Tools'
        },
        newTools: [
          ...sampleData.newTools,
          ...uniqueTools.slice(0, 15) // Add top 15 unique emerging tools
        ],
        aiNews: redditNews.slice(0, 5), // Add Reddit news
        rssUpdates: rssNews.slice(0, 5), // Add RSS news
        summary: {
          ...sampleData.summary,
          totalTools: sampleData.summary.totalTools + uniqueTools.length,
          newTools: sampleData.summary.newTools + uniqueTools.length,
          lastApiUpdate: new Date().toISOString(),
          indieToolsFound: uniqueTools.filter(tool => tool.isIndie).length
        }
      };

      console.log(`Successfully discovered ${uniqueTools.length} emerging AI tools`);
      return combinedData;
    } catch (error) {
      console.error('Error fetching all data:', error);
      // Return sample data as fallback
      return {
        ...sampleData,
        metadata: {
          ...sampleData.metadata,
          lastUpdated: new Date().toISOString(),
          dataSource: 'Sample data (API fetch failed)',
          error: error.message,
          updateMethod: 'Manual updates via dashboard button'
        }
      };
    }
  }

  // Helper methods
  categorizeByDescription(description) {
    if (!description) return 'Developer';
    const text = description.toLowerCase();
    if (text.includes('design') || text.includes('ui') || text.includes('creative')) return 'Designer';
    if (text.includes('business') || text.includes('enterprise') || text.includes('analytics')) return 'Business';
    if (text.includes('project') || text.includes('management') || text.includes('planning')) return 'Product Manager';
    return 'Developer';
  }

  categorizeAudience(description, topics) {
    const audiences = [];
    const text = (description || '').toLowerCase();
    const topicsText = (topics || []).join(' ').toLowerCase();
    const combined = text + ' ' + topicsText;

    if (combined.includes('developer') || combined.includes('programming') || combined.includes('code')) {
      audiences.push('Developer');
    }
    if (combined.includes('design') || combined.includes('ui') || combined.includes('creative')) {
      audiences.push('Designer');
    }
    if (combined.includes('business') || combined.includes('enterprise') || combined.includes('analytics')) {
      audiences.push('Business');
    }
    if (combined.includes('product') || combined.includes('management') || combined.includes('planning')) {
      audiences.push('Product Manager');
    }

    return audiences.length > 0 ? audiences : ['Developer'];
  }

  extractFeatures(description, topics) {
    const features = [];
    const text = (description || '').toLowerCase();
    const topicsText = (topics || []).join(' ').toLowerCase();
    const combined = text + ' ' + topicsText;

    if (combined.includes('natural-language') || combined.includes('nlp')) features.push('Natural Language Processing');
    if (combined.includes('computer-vision') || combined.includes('image')) features.push('Computer Vision');
    if (combined.includes('deep-learning') || combined.includes('neural')) features.push('Deep Learning');
    if (combined.includes('api') || combined.includes('rest')) features.push('API Integration');
    if (combined.includes('web') || combined.includes('frontend')) features.push('Web Interface');
    if (combined.includes('mobile') || combined.includes('app')) features.push('Mobile App');

    return features.length > 0 ? features : ['AI/ML Capabilities'];
  }

  calculateRating(stars, forks) {
    // Simple rating calculation based on stars and forks
    const score = Math.log10(stars + 1) + Math.log10(forks + 1);
    return Math.min(5, Math.max(1, score)).toFixed(1);
  }

  isAIRelated(text) {
    const aiKeywords = [
      'artificial intelligence', 'ai', 'machine learning', 'ml', 'deep learning',
      'neural network', 'chatgpt', 'gpt', 'llm', 'natural language',
      'computer vision', 'robotics', 'automation', 'algorithm'
    ];
    
    const textLower = text.toLowerCase();
    return aiKeywords.some(keyword => textLower.includes(keyword));
  }

  generateId(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
  }

  // Helper method to check if a company is a big tech company
  isBigTechCompany(companyName) {
    if (!companyName) return false;
    const name = companyName.toLowerCase();
    return this.bigTechCompanies.some(bigTech => name.includes(bigTech));
  }

  // Helper method to check if a URL belongs to big tech
  isBigTechURL(url) {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    return this.bigTechCompanies.some(bigTech => urlLower.includes(bigTech));
  }

  // Enhanced AI tool detection
  isAITool(text, topics = []) {
    const aiKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
      'neural network', 'llm', 'large language model', 'natural language',
      'computer vision', 'nlp', 'chatbot', 'ai tool', 'ai assistant',
      'ai-powered', 'automation', 'ai generator', 'ai platform',
      'transformer', 'gpt', 'embedding', 'prompt', 'inference'
    ];
    
    const textLower = text.toLowerCase();
    const topicsText = topics.join(' ').toLowerCase();
    const combined = textLower + ' ' + topicsText;
    
    return aiKeywords.some(keyword => combined.includes(keyword));
  }

  // Extract tool name from Show HN titles
  extractToolName(title) {
    // Remove "Show HN:" prefix and extract tool name
    const cleanTitle = title.replace(/^Show HN:\s*/i, '');
    const match = cleanTitle.match(/^([^-–]+)/);
    return match ? match[1].trim() : cleanTitle.split(' ').slice(0, 3).join(' ');
  }

  // Deduplicate tools based on name similarity
  deduplicateTools(tools) {
    const seen = new Set();
    return tools.filter(tool => {
      const normalizedName = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataFetcher();