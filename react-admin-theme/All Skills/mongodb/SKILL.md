---
name: mongodb
description: MongoDB document database specialist for Next.js and vanilla JavaScript. Focus on schema design, indexing, queries, and data modeling patterns for document databases. Use when designing MongoDB schemas, optimizing queries, or working with document data structures.
---

# MongoDB - Document Database Expert

Specialist in **MongoDB** document database design and optimization for **Next.js** and **vanilla JavaScript** projects.

## Use this skill when

- Designing MongoDB document schemas
- Choosing between embedding vs referencing
- Writing MongoDB queries and aggregations
- Optimizing MongoDB indexes
- Modeling relationships in document databases
- Working with MongoDB in Node.js/Next.js

## Do not use this skill when

- Need cloud-specific MongoAtlas features (use mongoatlas skill)
- Working with relational databases (use supabase skill)
- Need deployment/infrastructure guidance

## Core MongoDB Concepts

### 1. Document Schema Design

**Key Decision: Embedding vs Referencing**

**Embed when:**
- ✅ 1-to-few relationships (< 100 sub-documents)
- ✅ Data is always accessed together
- ✅ Child data doesn't change frequently
- ✅ Need atomic updates

**Reference when:**
- ✅ 1-to-many or many-to-many relationships
- ✅ Data accessed independently
- ✅ Child data grows unbounded
- ✅ Need to share data across documents

### 2. Common Schema Patterns

**One-to-Few (Embedding)**
```javascript
// Blog post with comments (< 100 comments)
{
  _id: ObjectId("..."),
  title: "My Blog Post",
  content: "...",
  comments: [  // Embedded
    {
      author: "John",
      text: "Great post!",
      date: ISODate("2024-01-01")
    }
  ]
}
```

**One-to-Many (Referencing)**
```javascript
// User and Orders (unbounded orders)
// Users collection
{
  _id: ObjectId("user1"),
  name: "John Doe",
  email: "john@example.com"
}

// Orders collection
{
  _id: ObjectId("order1"),
  userId: ObjectId("user1"),  // Reference
  items: [...],
  total: 150
}
```

**Many-to-Many (Reference Arrays)**
```javascript
// Products and Categories
// Products collection
{
  _id: ObjectId("prod1"),
  name: "Laptop",
  categoryIds: [  // Array of references
    ObjectId("cat1"),
    ObjectId("cat2")
  ]
}

// Categories collection
{
  _id: ObjectId("cat1"),
  name: "Electronics"
}
```

**Hybrid (Embedding + Referencing)**
```javascript
// E-commerce Order with product snapshots
{
  _id: ObjectId("order1"),
  userId: ObjectId("user1"),
  items: [
    {
      productId: ObjectId("prod1"),  // Reference
      name: "Laptop",                // Snapshot (embedded)
      price: 999,                    // Snapshot at purchase time
      qty: 1
    }
  ],
  total: 999
}
```

### 3. Indexing Strategy

**Types of Indexes:**

```javascript
// Single field index
db.users.createIndex({ email: 1 })

// Compound index (order matters!)
db.products.createIndex({ category: 1, price: -1 })

// Text search index
db.articles.createIndex({ title: "text", content: "text" })

// Unique index
db.users.createIndex({ email: 1 }, { unique: true })

// TTL index (auto-delete after time)
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)
```

**Index Best Practices:**
- ✅ Index fields used in queries, sorts, and filters
- ✅ Put equality filters first in compound indexes
- ✅ Sort fields should match index order
- ❌ Don't over-index (slows writes)
- ❌ Don't index low-cardinality fields (e.g., boolean)

### 4. Query Patterns

**Basic Queries:**
```javascript
// Find all active users
db.users.find({ active: true })

// Find with multiple conditions
db.products.find({
  category: "Electronics",
  price: { $lt: 1000 },
  inStock: true
})

// Projection (select specific fields)
db.users.find(
  { active: true },
  { name: 1, email: 1, _id: 0 }
)

// Sorting and limiting
db.products.find()
  .sort({ price: -1 })
  .limit(10)
```

**Aggregation Pipeline:**
```javascript
// Group and count
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$userId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
])

// Lookup (JOIN)
db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }},
  { $unwind: "$user" }
])
```

### 5. Data Modeling Decisions

**When to Denormalize:**
```javascript
// Instead of this (normalized)
// Users: { _id, name }
// Posts: { _id, authorId, title }

// Consider this (denormalized)
{
  _id: ObjectId("post1"),
  title: "My Post",
  author: {           // Embedded author info
    id: ObjectId("user1"),
    name: "John Doe"  // Duplicated but fast
  }
}
```

**Benefits:** Faster reads, single query  
**Trade-offs:** Data duplication, update complexity

### 6. Next.js Integration

**Connection Pattern:**
```javascript
// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
```

**API Route Usage:**
```javascript
// pages/api/products.js
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('myapp');
  
  if (req.method === 'GET') {
    const products = await db.collection('products')
      .find({})
      .limit(20)
      .toArray();
    return res.json(products);
  }
  
  if (req.method === 'POST') {
    const result = await db.collection('products')
      .insertOne(req.body);
    return res.json(result);
  }
}
```

## Common Patterns by Use Case

### Blog/CMS
```javascript
// Posts collection
{
  _id: ObjectId("..."),
  title: "Post Title",
  slug: "post-title",
  content: "...",
  author: {              // Embedded author snapshot
    id: ObjectId("..."),
    name: "John",
    avatar: "..."
  },
  tags: ["tech", "js"],  // Embedded array
  comments: [],          // Embedded (if < 100)
  publishedAt: ISODate("...")
}

// Index
db.posts.createIndex({ slug: 1 }, { unique: true })
db.posts.createIndex({ publishedAt: -1 })
db.posts.createIndex({ tags: 1 })
```

### E-commerce
```javascript
// Products
{
  _id: ObjectId("..."),
  sku: "LAPTOP-001",
  name: "Gaming Laptop",
  price: 999,
  categoryIds: [ObjectId("...")],
  inventory: { inStock: 50, reserved: 5 },
  images: ["url1", "url2"],
  reviews: []  // Separate collection if > 100
}

// Indexes
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ categoryIds: 1, price: 1 })
db.products.createIndex({ name: "text" })
```

### User Profiles
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  name: "John Doe",
  profile: {             // Embedded sub-document
    avatar: "url",
    bio: "...",
    location: "NYC"
  },
  settings: {
    emailNotifications: true,
    theme: "dark"
  },
  createdAt: ISODate("...")
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
```

## Performance Tips

1. **Use Projections**: Only fetch fields you need
2. **Limit Results**: Always use `.limit()` for lists
3. **Index Queries**: Ensure queries use indexes (`explain()`)
4. **Avoid Large Arrays**: Keep embedded arrays < 100 items
5. **Use Aggregation**: For complex queries, use aggregation pipeline

## Validation

MongoDB supports schema validation:
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^.+@.+$"
        },
        name: {
          bsonType: "string"
        }
      }
    }
  }
})
```

## Key Reminders

- **Embed** for 1-to-few, **Reference** for 1-to-many
- **Index** what you query, not everything
- **Denormalize** for read-heavy workloads
- **Keep arrays** under 100 items when embedding
- **Use aggregation** for complex queries
- **Project** only needed fields

---

Focus on practical MongoDB patterns for Next.js and vanilla JavaScript applications.
