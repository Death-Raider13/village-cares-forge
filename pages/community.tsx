import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import PostComposer from '@/components/community/PostComposer';
import PostCard from '@/components/community/PostCard';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  discipline: string;
  category: string;
  tags: string[] | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
}

const setSEO = (title: string, description: string, canonicalPath = '/community') => {
  document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', description);
  else {
    const m = document.createElement('meta');
    m.name = 'description';
    m.content = description;
    document.head.appendChild(m);
  }
  const linkRel = Array.from(document.getElementsByTagName('link')).find(
    (l) => l.getAttribute('rel') === 'canonical'
  );
  const baseUrl = window.location.origin;
  if (linkRel) linkRel.setAttribute('href', `${baseUrl}${canonicalPath}`);
  else {
    const l = document.createElement('link');
    l.setAttribute('rel', 'canonical');
    l.setAttribute('href', `${baseUrl}${canonicalPath}`);
    document.head.appendChild(l);
  }
};

const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = 'Community Discussions & Tips | Andrew Cares Village';
  const description = 'Join multi-discipline community discussions for Forex, Fitness, and Karate. Share tips and learn from others.';

  useEffect(() => {
    setSEO(title, description);
  }, [title, description]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      setError(error.message);
    } else {
      setPosts((data as unknown as CommunityPost[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user?.id), [user]);

  return (
    <div>
      <header className="mt-16">
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-vintage-deep-blue">
            Community discussions and tips
          </h1>
          <p className="mt-2 text-vintage-deep-blue/80 max-w-2xl">
            Share knowledge, ask questions, and connect across Forex, Fitness, and Karate disciplines.
          </p>
        </section>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <section aria-label="Create post" className="mb-6">
          {isAuthenticated ? (
            <PostComposer onPosted={fetchPosts} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Join the conversation</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-vintage-deep-blue/80">
                  Sign in to start a discussion and comment on posts.
                </p>
                <Button asChild>
                  <a href="/auth" aria-label="Sign in to post">Sign In</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section aria-label="Community stats" className="mb-6">
          <Card>
            <CardContent className="py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-vintage-burgundy" />
                <span className="text-sm">Open to all users</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-vintage-burgundy" />
                <span className="text-sm">Like posts</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-vintage-burgundy" />
                <span className="text-sm">Comment & discuss</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-6" />

        <section aria-label="Posts feed">
          {loading && (
            <div className="flex items-center gap-2 text-vintage-deep-blue/80">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading posts...
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="text-sm text-vintage-deep-blue/80">No posts yet. Be the first to start a discussion!</div>
          )}
          <div className="space-y-4 mt-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} onRefresh={fetchPosts} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Community;
