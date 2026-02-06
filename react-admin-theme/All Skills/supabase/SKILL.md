---
name: supabase
description: Supabase PostgreSQL specialist for Next.js projects. Focus on PostgreSQL schema design, Row Level Security (RLS), real-time subscriptions, auth integration, and Supabase-specific features. Use when working with Supabase database, auth, or real-time features.
---

# Supabase - PostgreSQL with Superpowers

Specialist in **Supabase** (PostgreSQL + Auth + Real-time + Storage) for **Next.js** projects.

## Use this skill when

- Designing Supabase PostgreSQL schemas
- Setting up Row Level Security (RLS) policies
- Using Supabase Auth integration
- Implementing real-time subscriptions
- Working with Supa base Storage
- Need relational database with built-in features

## Do not use this skill when

- Need document database patterns (use mongodb skill)
- Working with MongoAtlas (use mongoatlas skill)
- Need general PostgreSQL (this is Supabase-specific)

## Supabase Core Features

**What Supabase Provides:**
- ✅ PostgreSQL database (fully managed)
- ✅ Authentication (email, OAuth, magic links)
- ✅ Auto-generated REST API
- ✅ Real-time subscriptions
- ✅ Storage (file uploads)
- ✅ Edge Functions (serverless)
- ✅ Row Level Security (RLS)

## 1. Schema Design

### Basic Table Structure

```sql
-- Users table (managed by Supabase Auth)
-- Don't create this, extend it instead
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published_at) WHERE published_at IS NOT NULL;
```

### Relationships

```sql
-- One-to-Many (User → Posts)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT
);

-- Many-to-Many (Posts ←→ Tags)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

## 2. Row Level Security (RLS)

**Enable RLS on tables:**
```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Common RLS Patterns

**Users can only see their own data:**
```sql
CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

**Public read, authenticated write:**
```sql
-- Anyone can read
CREATE POLICY "Public posts are viewable"
  ON posts FOR SELECT
  USING (published_at IS NOT NULL);

-- Only authenticated users can create
CREATE POLICY "Authenticated users can create"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

**Role-based access:**
```sql
-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Admins can do anything
CREATE POLICY "Admins have full access"
  ON posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

## 3. Supabase Client (Next.js)

### Setup

```bash
npm install @supabase/supabase-js
```

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### CRUD Operations

```javascript
// CREATE
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: 'My Post',
    content: '...',
    user_id: user.id
  })
  .select()
  .single();

// READ
const { data: posts } = await supabase
  .from('posts')
  .select('*, profiles(*)')  // Include user profile
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10);

// UPDATE
const { data, error } = await supabase
  .from('posts')
  .update({ title: 'New Title' })
  .eq('id', postId)
  .select();

// DELETE
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

### Filtering

```javascript
// Multiple conditions
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'Electronics')
  .gte('price', 100)
  .lte('price', 1000)
  .eq('in_stock', true);

// Text search
const { data } = await supabase
  .from('articles')
  .select('*')
  .textSearch('title', 'react next.js');

// Array contains
const { data } = await supabase
  .from('posts')
  .select('*')
  .contains('tags', ['react', 'nextjs']);
```

## 4. Authentication

### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe'
    }
  }
});
```

### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### OAuth (Google, GitHub, etc.)
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

### Get Current User
```javascript
const { data: { user } } = await supabase.auth.getUser();
```

### Auth State Management (Next.js)
```javascript
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return user;
}
```

## 5. Real-time Subscriptions

### Enable Realtime

```sql
-- Enable on table
ALTER publication supabase_realtime ADD TABLE posts;
```

### Subscribe to Changes

```javascript
// Listen for new posts
const channel = supabase
  .channel('posts_channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('New post:', payload.new);
      // Update UI
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

### React Hook for Real-time

```javascript
import { useEffect, useState } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Initial load
    supabase
      .from('posts')
      .select('*')
      .then(({ data }) => setPosts(data || []));

    // Subscribe to changes
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts(prev => [payload.new, ...prev]);
        }
        if (payload.eventType === 'UPDATE') {
          setPosts(prev => prev.map(p => 
            p.id === payload.new.id ? payload.new : p
          ));
        }
        if (payload.eventType === 'DELETE') {
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, []);

  return posts;
}
```

## 6. Storage (File Uploads)

### Upload File

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${user.id}/avatar.png`);
```

### Storage with RLS

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 7. Edge Functions

```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data } = await supabase
    .from('posts')
    .select('*')
    .limit(10);

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

## 8. Next.js Integration

### SSR with Supabase

```javascript
// pages/posts.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSideProps(ctx) {
  const supabase = createServerSupabaseClient(ctx);

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { descending: true });

  return { props: { posts } };
}
```

## Performance Tips

1. **Use indexes** on foreign keys and filter columns
2. **Select specific columns** (don't use `SELECT *`)
3. **Use RLS policies** instead of application-level filtering
4. **Enable PostgREST caching** for static data
5. **Use Edge Functions** for complex logic instead of client-side

## Common Patterns

### User Profile Extension

```sql
-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Multi-tenant with RLS

```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

-- User-org membership
CREATE TABLE org_members (
  user_id UUID REFERENCES profiles(id),
  org_id UUID REFERENCES organizations(id),
  role TEXT DEFAULT 'member',
  PRIMARY KEY (user_id, org_id)
);

-- RLS: Users can only see data from their orgs
CREATE POLICY "Users see own org data"
  ON posts FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid()
    )
  );
```

## Key Reminders

- **Enable RLS** on all tables
- **Use auth.uid()** in RLS policies
- **Leverage built-in Auth** instead of custom
- **Real-time** is great but use wisely (costs)
- **Storage RLS** protects file uploads
- **Edge Functions** for server-side logic

---

Focus on leveraging Supabase's integrated features for rapid Next.js development.
