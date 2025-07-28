import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  User,
  Tag,
  Star,
  Archive,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AdminNote {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'user-feedback' | 'technical' | 'content' | 'marketing' | 'development';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'active' | 'archived' | 'completed';
  tags: string[];
  author: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  attachments: string[];
  relatedTo?: {
    type: 'video' | 'user' | 'conference' | 'stream';
    id: string;
    title: string;
  };
}

const AdminNotes: React.FC = () => {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<AdminNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<AdminNote | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for creating/editing notes
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'general' as AdminNote['category'],
    priority: 'medium' as AdminNote['priority'],
    status: 'draft' as AdminNote['status'],
    tags: [] as string[],
    assignedTo: '',
    dueDate: '',
    relatedTo: null as AdminNote['relatedTo']
  });

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notes, searchQuery, filterCategory, filterPriority, filterStatus, sortBy]);

  const loadNotes = async () => {
    // Mock data - replace with actual API call
    const mockNotes: AdminNote[] = [
      {
        id: '1',
        title: 'Video Upload Performance Issues',
        content: 'Users are reporting slow upload speeds for videos larger than 100MB. Need to investigate server configuration and possibly implement chunked uploads.',
        category: 'technical',
        priority: 'high',
        status: 'active',
        tags: ['video-upload', 'performance', 'server'],
        author: 'Admin User',
        assignedTo: 'Dev Team',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22'),
        dueDate: new Date('2024-01-25'),
        attachments: [],
        relatedTo: {
          type: 'video',
          id: 'video-123',
          title: 'Fitness Training Session'
        }
      },
      {
        id: '2',
        title: 'User Feedback - Karate Section',
        content: 'Multiple users have requested more beginner-friendly karate content. Consider creating a dedicated beginner series with detailed explanations.',
        category: 'user-feedback',
        priority: 'medium',
        status: 'active',
        tags: ['karate', 'beginner-content', 'user-request'],
        author: 'Admin User',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
        attachments: []
      },
      {
        id: '3',
        title: 'Marketing Campaign Ideas',
        content: 'Ideas for Q1 marketing campaign:\n1. Social media challenges\n2. Free trial extensions\n3. Referral program\n4. Partnership with fitness influencers',
        category: 'marketing',
        priority: 'low',
        status: 'draft',
        tags: ['marketing', 'campaign', 'social-media', 'partnerships'],
        author: 'Admin User',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
        attachments: []
      },
      {
        id: '4',
        title: 'Conference Room Booking System',
        content: 'Implement automatic booking system for 1-on-1 sessions to prevent double bookings and improve user experience.',
        category: 'development',
        priority: 'medium',
        status: 'completed',
        tags: ['booking-system', 'conferences', 'automation'],
        author: 'Admin User',
        assignedTo: 'Dev Team',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        dueDate: new Date('2024-01-30'),
        attachments: []
      }
    ];

    setNotes(mockNotes);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = notes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(note => note.category === filterCategory);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(note => note.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(note => note.status === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'due-date':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredNotes(filtered);
  };

  const createNote = () => {
    const newNote: AdminNote = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category,
      priority: noteForm.priority,
      status: noteForm.status,
      tags: noteForm.tags,
      author: 'Current Admin', // Replace with actual admin name
      assignedTo: noteForm.assignedTo || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: noteForm.dueDate ? new Date(noteForm.dueDate) : undefined,
      attachments: [],
      relatedTo: noteForm.relatedTo
    };

    setNotes(prev => [...prev, newNote]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const updateNote = () => {
    if (!selectedNote) return;

    const updatedNote: AdminNote = {
      ...selectedNote,
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category,
      priority: noteForm.priority,
      status: noteForm.status,
      tags: noteForm.tags,
      assignedTo: noteForm.assignedTo || undefined,
      updatedAt: new Date(),
      dueDate: noteForm.dueDate ? new Date(noteForm.dueDate) : undefined,
      relatedTo: noteForm.relatedTo
    };

    setNotes(prev => prev.map(note => note.id === selectedNote.id ? updatedNote : note));
    setIsEditModalOpen(false);
    setSelectedNote(null);
    resetForm();
  };

  const deleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const duplicateNote = (note: AdminNote) => {
    const duplicatedNote: AdminNote = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    };

    setNotes(prev => [...prev, duplicatedNote]);
  };

  const openEditModal = (note: AdminNote) => {
    setSelectedNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      status: note.status,
      tags: note.tags,
      assignedTo: note.assignedTo || '',
      dueDate: note.dueDate ? note.dueDate.toISOString().split('T')[0] : '',
      relatedTo: note.relatedTo
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      status: 'draft',
      tags: [],
      assignedTo: '',
      dueDate: '',
      relatedTo: null
    });
  };

  const addTag = (tag: string) => {
    if (tag && !noteForm.tags.includes(tag)) {
      setNoteForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNoteForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const updateNoteStatus = (noteId: string, newStatus: AdminNote['status']) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, status: newStatus, updatedAt: new Date() }
        : note
    ));
  };

  const getCategoryColor = (category: AdminNote['category']) => {
    switch (category) {
      case 'technical': return 'bg-red-100 text-red-800';
      case 'user-feedback': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      case 'development': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-yellow-100 text-yellow-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: AdminNote['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
    }
  };

  const getStatusColor = (status: AdminNote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: AdminNote['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'active': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const isOverdue = (dueDate?: Date) => {
    return dueDate && dueDate < new Date();
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading notes...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notes Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {notes.filter(n => n.status === 'active').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">
                  {notes.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">
                  {notes.filter(n => isOverdue(n.dueDate)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Admin Notes & Tasks
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="user-feedback">User Feedback</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="due-date">Due Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <Badge className={getPriorityColor(note.priority)}>
                      {note.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(note.status)}>
                      {getStatusIcon(note.status)}
                      <span className="ml-1 capitalize">{note.status}</span>
                    </Badge>
                    {isOverdue(note.dueDate) && (
                      <Badge className="bg-red-500 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        OVERDUE
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>By {note.author}</span>
                    </div>
                    {note.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Assigned to {note.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(note.updatedAt)}</span>
                    </div>
                    {note.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className={isOverdue(note.dueDate) ? 'text-red-600 font-medium' : ''}>
                          Due {formatDate(note.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{note.content}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getCategoryColor(note.category)}>
                      {note.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    
                    {note.relatedTo && (
                      <Badge variant="outline">
                        Related to {note.relatedTo.type}: {note.relatedTo.title}
                      </Badge>
                    )}
                  </div>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(note)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  {note.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => updateNoteStatus(note.id, 'completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}

                  {note.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => updateNoteStatus(note.id, 'active')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateNote(note)}
                  >
                    Copy
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotes.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes found</h3>
            <p className="text-gray-600 mb-4">Create your first note or adjust your search criteria.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Note
            </Button>
          </Card>
        )}
      </div>

      {/* Create/Edit Note Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedNote(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title"
              />
            </div>

            <div>
              <Label htmlFor="note-content">Content *</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter note content..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={noteForm.category}
                  onValueChange={(value: AdminNote['category']) => 
                    setNoteForm(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="user-feedback">User Feedback</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select
                  value={noteForm.priority}
                  onValueChange={(value: AdminNote['priority']) => 
                    setNoteForm(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={noteForm.status}
                  onValueChange={(value: AdminNote['status']) => 
                    setNoteForm(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={noteForm.dueDate}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="assigned-to">Assigned To</Label>
              <Input
                id="assigned-to"
                value={noteForm.assignedTo}
                onChange={(e) => setNoteForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Enter assignee name"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {noteForm.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const tag = prompt('Enter tag:');
                    if (tag) addTag(tag);
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedNote(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={isEditModalOpen ? updateNote : createNote}
                disabled={!noteForm.title.trim() || !noteForm.content.trim()}
                className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
              >
                {isEditModalOpen ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotes;