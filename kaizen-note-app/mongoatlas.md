# MongoDB Atlas Connection

## Connection String
```
mongodb+srv://goodmotorvn_db_user:pVroPce0jfWVRAaQ@cluster0.cleimzg.mongodb.net/?appName=Cluster0
```

## Credentials

**User:** goodmotorvn_db_user

**Password:** pVroPce0jfWVRAaQ

## Cluster Information
- **Cluster Name:** Cluster0
- **Cluster ID:** cleimzg
- **App Name:** Cluster0

## Environment Variables
For Next.js, add to `.env.local`:
```env
MONGODB_URI=mongodb+srv://goodmotorvn_db_user:pVroPce0jfWVRAaQ@cluster0.cleimzg.mongodb.net/?appName=Cluster0
MONGODB_DB=kaizennote
```

## Usage Example
```typescript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  return { client, db };
}
```
