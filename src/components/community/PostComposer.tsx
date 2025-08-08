import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

interface PostComposerProps {
  onPosted?: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onPosted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [discipline, setDiscipline] = useState<string>('fitness');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({ title: 'Sign in required', description: 'Please sign in to create a post.' });
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Missing fields', description: 'Please add a title and some content.' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('community_posts').insert({
      title: title.trim(),
      content: content.trim(),
      discipline,
      category: 'discussion',
      user_id: user.id,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not publish', description: error.message });
    } else {
      setTitle('');
      setContent('');
      toast({ title: 'Posted!', description: 'Your discussion has been published.' });
      onPosted?.();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Share a tip, ask a question..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discipline">Discipline</Label>
            <Select value={discipline} onValueChange={setDiscipline}>
              <SelectTrigger id="discipline" aria-label="Select discipline">
                <SelectValue placeholder="Select a discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forex">Forex</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="karate">Karate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your question, advice, or experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostComposer;
