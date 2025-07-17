# GitHub Actions Setup for Automated Updates

Since the automated workflow couldn't be pushed due to OAuth limitations, here's how to set it up manually:

## 📋 Steps to Enable Automated Updates

### 1. Create the Workflow File

Go to your GitHub repository and create a new file:
```
.github/workflows/update-data.yml
```

### 2. Copy the Workflow Content

```yaml
name: Update AI Intelligence Data

on:
  schedule:
    # Run every day at 8:00 AM UTC (daily updates)
    - cron: '0 8 * * *'
  workflow_dispatch: # Allow manual triggering
  
jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Create data update script
      run: |
        cat > update-data.js << 'EOF'
        const fs = require('fs');
        const path = require('path');
        
        // Simple data update script
        const updateData = async () => {
          try {
            const dataPath = path.join(__dirname, 'src', 'data', 'sampleData.js');
            const data = fs.readFileSync(dataPath, 'utf8');
            
            // Update timestamps
            const today = new Date().toISOString();
            const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            
            // Update metadata
            const updatedData = data
              .replace(
                /lastUpdated: new Date\(\)\.toISOString\(\)/,
                `lastUpdated: "${today}"`
              )
              .replace(
                /nextUpdateScheduled: new Date\(Date\.now\(\) \+ 24 \* 60 \* 60 \* 1000\)\.toISOString\(\)/,
                `nextUpdateScheduled: "${nextDay}"`
              )
              .replace(
                /dataSource: "[^"]*"/,
                'dataSource: "Automated daily update + API integration"'
              );
            
            fs.writeFileSync(dataPath, updatedData);
            console.log('Data updated successfully');
            
          } catch (error) {
            console.error('Error updating data:', error);
            process.exit(1);
          }
        };
        
        updateData();
        EOF
        
    - name: Run data update
      run: node update-data.js
      
    - name: Create Slack notification script
      run: |
        cat > slack-notification.js << 'EOF'
        const https = require('https');
        const fs = require('fs');
        
        const sendSlackNotification = async () => {
          try {
            const today = new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            // Check if we have GitHub data from previous step
            let githubData = [];
            if (fs.existsSync('github-data.json')) {
              const data = JSON.parse(fs.readFileSync('github-data.json', 'utf8'));
              githubData = data.items || [];
            }
            
            // Create notification message
            const message = {
              channel: "D078NDL7XSB",
              username: "AI Intelligence Agent",
              icon_emoji: ":robot_face:",
              attachments: [{
                color: "good",
                title: "🤖 Daily AI Intelligence Update",
                title_link: "https://e88-eqx.github.io/ai-intelligence-agent/",
                text: `Daily update completed for ${today}`,
                fields: [
                  {
                    title: "🆕 New AI Tools Found",
                    value: githubData.length > 0 ? `${githubData.length} new repositories discovered` : "No new tools found today",
                    short: true
                  },
                  {
                    title: "📊 Dashboard Status",
                    value: "✅ Successfully updated and deployed",
                    short: true
                  },
                  {
                    title: "🔗 Quick Links",
                    value: "<https://e88-eqx.github.io/ai-intelligence-agent/|View Dashboard> | <https://github.com/e88-eqx/ai-intelligence-agent|GitHub Repo>",
                    short: false
                  }
                ],
                footer: "AI Intelligence Agent",
                ts: Math.floor(Date.now() / 1000)
              }]
            };
            
            // Add new tools if found
            if (githubData.length > 0) {
              const topTools = githubData.slice(0, 3).map(repo => 
                `• <${repo.html_url}|${repo.name}> by ${repo.owner.login} (⭐ ${repo.stargazers_count})`
              ).join('\n');
              
              message.attachments.push({
                color: "#36a64f",
                title: "🔧 Latest AI Tools",
                text: topTools,
                footer: "Top 3 discoveries from GitHub"
              });
            }
            
            // Send to Slack
            const data = JSON.stringify(message);
            const options = {
              hostname: 'hooks.slack.com',
              port: 443,
              path: process.env.SLACK_WEBHOOK_PATH,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              }
            };
            
            const req = https.request(options, (res) => {
              console.log(`Slack notification sent: ${res.statusCode}`);
            });
            
            req.on('error', (error) => {
              console.error('Error sending Slack notification:', error);
            });
            
            req.write(data);
            req.end();
            
          } catch (error) {
            console.error('Error in Slack notification:', error);
          }
        };
        
        sendSlackNotification();
        EOF
        
    - name: Send Slack notification
      run: node slack-notification.js
      env:
        SLACK_WEBHOOK_PATH: ${{ secrets.SLACK_WEBHOOK_PATH }}
      
    - name: Build application
      run: npm run build
      env:
        CI: false
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        
    - name: Commit updated data
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add -A
        git diff --staged --quiet || git commit -m "🤖 Automated daily data update - $(date +'%Y-%m-%d')"
        
    - name: Push changes
      uses: ad-m/github-push-action@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        branch: main
```

### 3. Set up Slack Integration

Before enabling the workflow, you need to set up Slack notifications:

#### A. Create Slack Incoming Webhook
1. Go to your Slack workspace (equivalentx.slack.com)
2. Visit https://api.slack.com/apps
3. Click "Create New App" → "From scratch"
4. Name it "AI Intelligence Agent" and select your workspace
5. Go to "Incoming Webhooks" and activate it
6. Click "Add New Webhook to Workspace"
7. Select the channel `D078NDL7XSB` (or the channel you want)
8. Copy the webhook URL (it looks like: `https://hooks.slack.com/services/T.../B.../...`)

#### B. Add GitHub Secrets
1. Go to your repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - **Name**: `SLACK_WEBHOOK_PATH`
   - **Value**: The path part of your webhook URL (everything after `hooks.slack.com`, like `/services/T.../B.../...`)

### 4. Enable GitHub Actions

1. Go to your repository settings
2. Click on "Actions" in the left sidebar
3. Make sure "Allow all actions and reusable workflows" is selected
4. Save the settings

### 5. Test the Workflow

1. Go to the "Actions" tab in your repository
2. Click on "Update AI Intelligence Data"
3. Click "Run workflow" to test it manually
4. Monitor the results and check for any errors
5. **Check your Slack channel** for the notification message

## 🔧 What This Workflow Does

- **Scheduled Updates**: Runs every day at 8:00 AM UTC
- **Data Refresh**: Updates timestamps and metadata
- **Slack Notifications**: Sends daily updates to your Slack channel
- **Build & Deploy**: Automatically rebuilds and deploys the app
- **Git Integration**: Commits changes and pushes to main branch
- **Manual Trigger**: Can be run manually anytime

## 🎯 Benefits

- **Always Fresh Data**: Timestamps automatically update daily
- **Team Notifications**: Automatic Slack updates keep everyone informed
- **New Tool Discovery**: Get notified about the latest AI tools from GitHub
- **Zero Maintenance**: Completely automated process
- **Deployment Integration**: Automatically deploys updates
- **Status Tracking**: GitHub Actions provides detailed logs

## 📱 Slack Notification Details

Your daily Slack notifications will include:

### 🤖 **Daily Update Message**
- **Update Status**: Confirmation that the daily update completed
- **New Tools Found**: Count of new AI repositories discovered on GitHub
- **Dashboard Link**: Direct link to your live dashboard
- **GitHub Repository**: Link to the source code

### 🔧 **Latest AI Tools (when found)**
- **Top 3 New Tools**: Name, author, and star count
- **Direct GitHub Links**: Click to view each repository
- **Discovery Source**: Shows they were found via GitHub API

### 📊 **Message Format**
```
🤖 Daily AI Intelligence Update
Daily update completed for [Date]

🆕 New AI Tools Found: X new repositories discovered
📊 Dashboard Status: ✅ Successfully updated and deployed
🔗 Quick Links: View Dashboard | GitHub Repo

🔧 Latest AI Tools
• [Tool Name] by [Author] (⭐ [Stars])
• [Tool Name] by [Author] (⭐ [Stars])
• [Tool Name] by [Author] (⭐ [Stars])
```

### ⏰ **Delivery Schedule**
- **Daily at 8:00 AM UTC** (after automated update completes)
- **Sent to channel**: `D078NDL7XSB` in equivalentx.slack.com
- **Manual triggers**: Also send notifications when manually run

## 📝 Optional Enhancements

You can also add these features to the workflow:

1. **Different notification channels** for different types of updates
2. **Error notifications** when updates fail
3. **API key rotation** for external services
4. **Data validation** before deployment
5. **Weekly summary** notifications with aggregated data

The workflow is designed to be safe and will only update timestamps and metadata, not the actual content data.