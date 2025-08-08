import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { CommunityPost } from '@/pages/Community';

interface PostCardProps {
  post: CommunityPost;
  currentUserId: string | null;
  onRefresh?: () => void;
}

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onRefresh }) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes_count ?? 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const canInteract = useMemo(() => Boolean(currentUserId), [currentUserId]);

  useEffect(() => {
    const checkLiked = async () => {
      if (!currentUserId) return;
      const { data, error } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', currentUserId)
        .maybeSingle();
      if (!error && data) setLiked(true);
    };
    checkLiked();
  }, [currentUserId, post.id]);

  const toggleLike = async () => {
    if (!canInteract) {
      toast({ title: 'Sign in required', description: 'Please sign in to like posts.' });
      return;
    }
    if (liked) {
      // unlike
      const { error } = await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', currentUserId as string);
      if (error) {
        toast({ title: 'Could not unlike', description: error.message });
      } else {
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
        onRefresh?.();
      }
    } else {
      const { error } = await supabase
        .from('community_post_likes')
        .insert({ post_id: post.id, user_id: currentUserId as string });
      if (error) {
        toast({ title: 'Could not like', description: error.message });
      } else {
        setLiked(true);
        setLikeCount((c) => c + 1);
        onRefresh?.();
      }
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (error) {
      toast({ title: 'Failed to load comments', description: error.message });
    } else {
      setComments((data as CommentRow[]) || []);
    }
    setLoadingComments(false);
  };

  const handleToggleComments = async () => {
    const open = !commentsOpen;
    setCommentsOpen(open);
    if (open) await loadComments();
  };

  const submitComment = async () => {
    if (!canInteract) {
      toast({ title: 'Sign in required', description: 'Please sign in to comment.' });
      return;
    }
    if (!commentText.trim()) return;
    const { error } = await supabase.from('community_comments').insert({
      post_id: post.id,
      user_id: currentUserId as string,
      content: commentText.trim(),
    });
    if (error) {
      toast({ title: 'Could not comment', description: error.message });
    } else {
      setCommentText('');
      await loadComments();
      onRefresh?.();
    }
  };

  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base md:text-lg">
            <span>{post.title}</span>
            <span className="text-xs rounded-full px-2 py-0.5 border border-vintage-gold/40 text-vintage-deep-blue/70">
              {post.discipline}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-vintage-deep-blue/90 whitespace-pre-wrap">{post.content}</p>
          <div className="flex items-center gap-3">
            <Button variant={liked ? 'default' : 'outline'} size="sm" onClick={toggleLike} aria-pressed={liked} aria-label="Like post">
              <ThumbsUp className="h-4 w-4 mr-2" /> {likeCount}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleComments} aria-expanded={commentsOpen} aria-controls={`comments-${post.id}`}>
              <MessageSquare className="h-4 w-4 mr-2" /> {post.comments_count ?? 0}
            </Button>
          </div>

          {commentsOpen && (
            <div id={`comments-${post.id}`}>
              <Separator className="my-3" />
              <div className="space-y-3">
                {loadingComments && <div className="text-xs text-vintage-deep-blue/70">Loading comments...</div>}
                {!loadingComments && comments.length === 0 && (
                  <div className="text-xs text-vintage-deep-blue/70">No comments yet.</div>
                )}
                {!loadingComments && comments.map((c) => (
                  <div key={c.id} className="text-sm">
                    {c.content}
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                <Textarea
                  placeholder={canInteract ? 'Write a comment...' : 'Sign in to comment'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!canInteract}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={submitComment} disabled={!canInteract || !commentText.trim()}>
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  );
};

export default PostCard;
