---
name: mongoatlas
description: MongoAtlas free tier specialist for Next.js projects. Focus on maximizing query performance for text-heavy workloads using Atlas Search, Data API, Triggers, and aggressive indexing strategies. Optimize for speed, not storage.
---

# MongoAtlas - Cloud MongoDB Platform

Specialist in **MongoAtlas Free Tier** features and optimization for **Next.js** projects.

## Use this skill when

- Deploying MongoDB to MongoAtlas free tier
- Using Atlas Search (full-text search)
- Setting up Atlas Triggers or Functions
- Configuring Atlas Data API
- Optimizing query performance and indexing
- MongoAtlas security and network access
- Speed optimization for text-heavy workloads

## Do not use this skill when

- Need general MongoDB schema design (use mongodb skill)
- Working with local MongoDB
- Need Supabase/PostgreSQL guidance

## Atlas Free Tier (M0 Shared Cluster)

**What You Get:**
- ✅ **512MB storage** (shared cluster)
- ✅ **100 connections** max
- ✅ **Free forever** (no credit card required)
- ✅ **Shared CPU/RAM** (sufficient for learning and small projects)
- ✅ **All core features** (indexes, aggregations, full MongoDB features)
- ✅ **Atlas Search** (limited but available)
- ✅ **Perfect for**: Learning, MVPs, prototypes, personal projects

**Limitations:**
- ⚠️ Shared resources (slower than dedicated)
- ⚠️ 512MB storage limit
- ⚠️ No automated backups (use manual exports)
- ⚠️ Pauses after 60 days of inactivity

**Connection:**
```javascript
// .env.local
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

**Speed Optimization for Text Data (Free Tier):**
1. **Index aggressively** - Text data is small, index all query fields for max speed
2. **Denormalize for reads** - Embed related data to avoid JOINs/lookups
3. **Use projections** - Only fetch needed fields (`{title: 1, _id: 0}`)
4. **Connection pooling** - Reuse connections (critical for Vercel serverless)
5. **Compound indexes** - Index multiple fields together for common queries
6. **Atlas Search** - Use for full-text search instead of regex (much faster)
7. **Limit results** - Always use `.limit()` to prevent fetching everything
8. **Monitor slow queries** - Check Performance Advisor for optimization hints

**Storage Won't Be a Problem:**
- Text is tiny (1000 articles = ~1-5MB typically)
- Focus 100% on speed, not storage

## Atlas-Specific Features

### 1. Atlas Search (Full-Text Search)

**Setup:**
```javascript
// Create search index in Atlas UI
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "content": {
        "type": "string"
      }
    }
  }
}
```

**Query:**
```javascript
// Full-text search with Atlas Search
const results = await db.collection('articles').aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "react next.js",
        path: ["title", "content"],
        fuzzy: { maxEdits: 1 }
      }
    }
  },
  { $limit: 10 },
  {
    $project: {
      title: 1,
      score: { $meta: "searchScore" }
    }
  }
]).toArray();
```

### 2. Atlas Triggers

**Database Triggers** (run code on data changes):
```javascript
// Trigger function example
// Runs on new user registration
exports = async function(changeEvent) {
  const {fullDocument} = changeEvent;
  
  // Send welcome email
  await context.services.get("sendgrid").send({
    to: fullDocument.email,
    subject: "Welcome!",
    body: `Hi ${fullDocument.name}!`
  });
};
```

**Scheduled Triggers** (cron jobs):
```javascript
// Run daily cleanup at midnight
exports = async function() {
  const db = context.services.get("mongodb-atlas")
    .db("myapp");
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Delete expired sessions
  await db.collection("sessions")
    .deleteMany({
      expiresAt: { $lt: yesterday }
    });
};
```

### 3. Atlas Data API (REST Endpoints)

**Enable in Atlas UI**, then:

```javascript
// Auto-generated REST API
// GET documents
const response = await fetch(
  'https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action/find',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.ATLAS_API_KEY
    },
    body: JSON.stringify({
      dataSource: "Cluster0",
      database: "myapp",
      collection: "products",
      filter: { category: "Electronics" }
    })
  }
);
```

**When to use:**
- ✅ Serverless Edge Functions (Vercel Edge)
- ✅ Mobile apps (no MongoDB driver needed)
- ✅ Quick prototypes
- ❌ Don't use for complex queries (use driver instead)

### 4. Atlas Functions (Serverless)

**Edge Functions:**
```javascript
// Atlas Function (runs on Atlas)
exports = async function(arg) {
  const db = context.services.get("mongodb-atlas")
    .db("myapp");
  
  const products = await db.collection("products")
    .find({ featured: true })
    .limit(10)
    .toArray();
    
  return products;
};

// Call from Next.js
const response = await fetch(
  'https://realm.mongodb.com/api/client/v2.0/app/<app-id>/functions/call',
  {
    method: 'POST',
    headers: { 'api-key': process.env.ATLAS_API_KEY },
    body: JSON.stringify({
      name: "getFeaturedProducts",
      arguments: []
    })
  }
);
```

## Connection Best Practices

### Next.js Connection Pooling (Optimized for Speed)

```javascript
// lib/mongodb.js (speed-optimized for text data)
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

// Speed-optimized connection options
const options = {
  // Connection pool (reuse connections for speed)
  maxPoolSize: 10,  // Max concurrent connections
  minPoolSize: 5,   // Keep 5 connections ready
  
  // Timeout settings (balance speed vs reliability)
  serverSelectionTimeoutMS: 5000,   // 5s to find server
  socketTimeoutMS: 45000,            // 45s for long queries
  connectTimeoutMS: 10000,           // 10s to establish connection
  
  // Read preference (for speed on shared cluster)
  readPreference: 'primaryPreferred', // Read from primary (fastest)
  
  // Write concern (balance speed vs safety)
  w: 'majority',                     // Wait for majority confirmation
  journal: true,                     // Persist to disk
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use global to preserve across HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### Serverless Functions (Speed-Optimized for Text)

```javascript
// pages/api/articles.js
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('myapp');
    
    if (req.method === 'GET') {
      const { category, search } = req.query;
      
      // Speed optimization: Use projection (only fetch needed fields)
      const articles = await db.collection('articles')
        .find(
          category ? { category } : {},  // Filter
          { 
            projection: {  // 🚀 Only fetch what you need!
              title: 1,
              excerpt: 1,
              publishedAt: 1,
              // Don't fetch 'content' field (faster!)
              _id: 1
            }
          }
        )
        .sort({ publishedAt: -1 })  // Use index for sorting
        .limit(20)                   // Always limit results
        .toArray();
      
      // Set cache headers (Vercel Edge caching)
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.json({ articles });
    }
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
}

// 🚀 Speed Tips:
// 1. Use .find({}, { projection: {...} }) to fetch only needed fields
// 2. Create index: db.collection('articles').createIndex({ publishedAt: -1 })
// 3. Always use .limit() to prevent fetching thousands of docs
// 4. Add Vercel caching headers for static-ish data
```

## Security Best Practices

### 1. Network Access

**Atlas IP Whitelist:**
- ✅ Add your IP for development
- ✅ Add `0.0.0.0/0` for serverless (Vercel, AWS Lambda)
- ⚠️ Use VPC Peering for production (if possible)

### 2. Database Users

```javascript
// Create read-only user for analytics
db.createUser({
  user: "analytics",
  pwd: "secretPassword",
  roles: [
    { role: "read", db: "myapp" }
  ]
})

// Create app user with limited access
db.createUser({
  user: "app",
  pwd: "secretPassword",
  roles: [
    { role: "readWrite", db: "myapp" }
  ]
})
```

### 3. Connection String Security

```javascript
// ❌ WRONG - Hardcoded
const uri = "mongodb+srv://user:pass@cluster.mongodb.net/db";

// ✅ CORRECT - Environment variable
const uri = process.env.MONGODB_URI;
```

## Monitoring & Performance

### Atlas UI Metrics

Monitor in Atlas Dashboard:
- 📊 **Operations per second** (reads/writes)
- 📊 **Connection count**
- 📊 **Query performance** (slow queries)
- 📊 **Index usage** (unused indexes)
- 📊 **Storage size**

### Performance Advisor

Atlas will suggest:
- Missing indexes
- Slow queries to optimize
- Schema anti-patterns

### Real-Time Performance Panel

```javascript
// Enable profiling for slow queries
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find().sort({ ts: -1 });
```



## Atlas Free Tier vs Local MongoDB

| Feature | Atlas Free Tier | Local |
|---------|-----------------|-------|
| Setup | Click deploy | Manual install |
| Speed | Fast (cloud) | Depends on hardware |
| Backups | Manual exports | Manual |
| Monitoring | Built-in dashboard | Setup required |
| Security | Managed | Manual |
| Cost | **Free forever** | Infrastructure cost |

## Quick Setup Checklist (Free Tier)

- [ ] Create Atlas account (free, no credit card)
- [ ] Create **M0 Free Tier** cluster (512MB)
- [ ] Create database user (username + password)
- [ ] Whitelist IP (`0.0.0.0/0` for Vercel/serverless or your IP)
- [ ] Get connection string from Atlas UI
- [ ] Add `MONGODB_URI` to `.env.local`
- [ ] Test connection in Next.js
- [ ] Create indexes for frequently queried fields
- [ ] Enable Performance Advisor in Atlas dashboard
- [ ] Set up weekly manual backup exports

---

**Focus:** Maximize query performance and speed for text-heavy Next.js projects on Atlas free tier. Storage is not a concern—optimize aggressively for the fastest possible reads.
