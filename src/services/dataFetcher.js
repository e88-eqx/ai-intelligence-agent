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

  // Fetch AI tools from GitHub API
  async fetchGitHubAITools() {
    const cacheKey = 'github_ai_tools';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const query = 'ai+machine-learning+llm+artificial-intelligence';
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&sort=created&order=desc&per_page=20`
      );
      
      if (!response.ok) throw new Error('GitHub API error');
      
      const data = await response.json();
      const tools = data.items.map((repo, index) => ({
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
        language: repo.language
      }));

      this.setCache(cacheKey, tools);
      return tools;
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

  // Combine all data sources
  async fetchAllData() {
    try {
      console.log('Fetching real-time AI data...');
      
      // Fetch data from all sources in parallel
      const [githubTools, redditNews, rssNews] = await Promise.all([
        this.fetchGitHubAITools(),
        this.fetchRedditAINews(),
        this.fetchRSSFeeds()
      ]);

      // Merge with existing sample data
      const combinedData = {
        ...sampleData,
        metadata: {
          ...sampleData.metadata,
          lastUpdated: new Date().toISOString(),
          dataSource: 'GitHub API + Reddit + RSS feeds + Manual curation',
          apiSources: ['GitHub', 'Reddit', 'RSS feeds'],
          nextUpdateScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        },
        newTools: [
          ...sampleData.newTools,
          ...githubTools.slice(0, 10) // Add top 10 GitHub tools
        ],
        aiNews: redditNews.slice(0, 5), // Add Reddit news
        rssUpdates: rssNews.slice(0, 5), // Add RSS news
        summary: {
          ...sampleData.summary,
          totalTools: sampleData.summary.totalTools + githubTools.length,
          newTools: sampleData.summary.newTools + githubTools.length,
          lastApiUpdate: new Date().toISOString()
        }
      };

      console.log('Successfully fetched and merged real-time data');
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
          nextUpdateScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
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
}

export default new DataFetcher();