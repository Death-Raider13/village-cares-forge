import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  Phone,
  PhoneOff,
  Settings,
  Copy,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Monitor,
  Archive,
  Play,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';

interface Conference {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: 'fitness' | 'karate' | 'forex';
  type: 'one-on-one' | 'group' | 'webinar';
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  scheduledTime: Date;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  participants: Participant[];
  meetingUrl: string;
  meetingId: string;
  passcode?: string;
  isRecording: boolean;
  recordingUrl?: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  waitingRoomEnabled: boolean;
  isPrivate: boolean;
  createdAt: Date;
  actualDuration?: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'host' | 'instructor' | 'student';
  joinedAt?: Date;
  leftAt?: Date;
  status: 'invited' | 'joined' | 'left' | 'waiting';
}

const ConferenceManager: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create conference form state
  const [newConference, setNewConference] = useState({
    title: '',
    description: '',
    category: 'fitness' as 'fitness' | 'karate' | 'forex',
    type: 'one-on-one' as 'one-on-one' | 'group' | 'webinar',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 1,
    chatEnabled: true,
    screenShareEnabled: true,
    waitingRoomEnabled: false,
    isRecording: false,
    isPrivate: false,
    participantEmails: ''
  });

  useEffect(() => {
    loadConferences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [conferences, filterStatus, filterCategory]);

  const loadConferences = async () => {
    // Mock data - replace with actual API call
    const mockConferences: Conference[] = [
      {
        id: '1',
        title: 'Personal Fitness Consultation',
        description: 'One-on-one fitness assessment and workout planning',
        instructor: 'Sarah Mitchell',
        category: 'fitness',
        type: 'one-on-one',
        status: 'scheduled',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 60,
        maxParticipants: 1,
        currentParticipants: 1,
        participants: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'student',
            status: 'invited'
          }
        ],
        meetingUrl: 'https://meet.example.com/room/abc123',
        meetingId: 'abc123',
        passcode: '1234',
        isRecording: true,
        chatEnabled: true,
        screenShareEnabled: true,
        waitingRoomEnabled: false,
        isPrivate: false,
        createdAt: new Date('2024-01-20')
      },
      {
        id: '2',
        title: 'Advanced Karate Techniques Workshop',
        description: 'Group session focusing on advanced kata and kumite techniques',
        instructor: 'Sensei Kenji Tanaka',
        category: 'karate',
        type: 'group',
        status: 'active',
        scheduledTime: new Date(Date.now() - 30 * 60 * 1000),
        duration: 90,
        maxParticipants: 8,
        currentParticipants: 6,
        participants: [
          {
            id: '2',
            name: 'Alice Smith',
            email: 'alice@example.com',
            role: 'student',
            status: 'joined',
            joinedAt: new Date(Date.now() - 25 * 60 * 1000)
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'student',
            status: 'joined',
            joinedAt: new Date(Date.now() - 20 * 60 * 1000)
          }
        ],
        meetingUrl: 'https://meet.example.com/room/def456',
        meetingId: 'def456',
        isRecording: true,
        chatEnabled: true,
        screenShareEnabled: true,
        waitingRoomEnabled: true,
        isPrivate: false,
        createdAt: new Date('2024-01-18')
      },
      {
        id: '3',
        title: 'Forex Market Analysis Webinar',
        description: 'Weekly market analysis and trading strategies discussion',
        instructor: 'Michael Thompson',
        category: 'forex',
        type: 'webinar',
        status: 'ended',
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        duration: 120,
        maxParticipants: 50,
        currentParticipants: 0,
        participants: [],
        meetingUrl: 'https://meet.example.com/room/ghi789',
        meetingId: 'ghi789',
        isRecording: true,
        recordingUrl: 'https://recordings.example.com/ghi789',
        chatEnabled: true,
        screenShareEnabled: true,
        waitingRoomEnabled: false,
        isPrivate: false,
        createdAt: new Date('2024-01-15'),
        actualDuration: 115
      }
    ];

    setConferences(mockConferences);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = conferences;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(conf => conf.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(conf => conf.category === filterCategory);
    }

    // Sort by scheduled time (upcoming first, then recent)
    filtered.sort((a, b) => {
      if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
      if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;
      return b.scheduledTime.getTime() - a.scheduledTime.getTime();
    });

    setFilteredConferences(filtered);
  };

  const createConference = async () => {
    if (!newConference.title.trim() || !newConference.scheduledTime) return;

    const participants: Participant[] = [];
    if (newConference.participantEmails) {
      const emails = newConference.participantEmails.split(',').map(email => email.trim());
      emails.forEach((email, index) => {
        if (email) {
          participants.push({
            id: (Date.now() + index).toString(),
            name: email.split('@')[0],
            email,
            role: 'student',
            status: 'invited'
          });
        }
      });
    }

    const conference: Conference = {
      id: Date.now().toString(),
      title: newConference.title,
      description: newConference.description,
      instructor: 'Current User', // Replace with actual instructor name
      category: newConference.category,
      type: newConference.type,
      status: 'scheduled',
      scheduledTime: new Date(newConference.scheduledTime),
      duration: newConference.duration,
      maxParticipants: newConference.maxParticipants,
      currentParticipants: participants.length,
      participants,
      meetingUrl: `https://meet.example.com/room/${Math.random().toString(36).substr(2, 9)}`,
      meetingId: Math.random().toString(36).substr(2, 9),
      passcode: Math.random().toString().substr(2, 4),
      isRecording: newConference.isRecording,
      chatEnabled: newConference.chatEnabled,
      screenShareEnabled: newConference.screenShareEnabled,
      waitingRoomEnabled: newConference.waitingRoomEnabled,
      isPrivate: newConference.isPrivate,
      createdAt: new Date()
    };

    setConferences(prev => [...prev, conference]);
    setIsCreateModalOpen(false);
    
    // Reset form
    setNewConference({
      title: '',
      description: '',
      category: 'fitness',
      type: 'one-on-one',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 1,
      chatEnabled: true,
      screenShareEnabled: true,
      waitingRoomEnabled: false,
      isRecording: false,
      isPrivate: false,
      participantEmails: ''
    });
  };

  const startConference = (conferenceId: string) => {
    setConferences(prev => prev.map(conf => 
      conf.id === conferenceId 
        ? { ...conf, status: 'active' as const }
        : conf
    ));
  };

  const endConference = (conferenceId: string) => {
    setConferences(prev => prev.map(conf => 
      conf.id === conferenceId 
        ? { 
            ...conf, 
            status: 'ended' as const,
            actualDuration: Math.floor((Date.now() - conf.scheduledTime.getTime()) / 1000 / 60)
          }
        : conf
    ));
  };

  const cancelConference = (conferenceId: string) => {
    setConferences(prev => prev.map(conf => 
      conf.id === conferenceId 
        ? { ...conf, status: 'cancelled' as const }
        : conf
    ));
  };

  const deleteConference = (conferenceId: string) => {
    if (confirm('Are you sure you want to delete this conference?')) {
      setConferences(prev => prev.filter(conf => conf.id !== conferenceId));
    }
  };

  const openDetails = (conference: Conference) => {
    setSelectedConference(conference);
    setIsDetailsModalOpen(true);
  };

  const copyMeetingUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  const copyMeetingDetails = (conference: Conference) => {
    const details = `
Meeting: ${conference.title}
Time: ${conference.scheduledTime.toLocaleString()}
Duration: ${conference.duration} minutes
Meeting URL: ${conference.meetingUrl}
Meeting ID: ${conference.meetingId}
${conference.passcode ? `Passcode: ${conference.passcode}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(details);
    // Show toast notification
  };

  const getStatusColor = (status: Conference['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeIcon = (type: Conference['type']) => {
    switch (type) {
      case 'one-on-one': return '👤';
      case 'group': return '👥';
      case 'webinar': return '📢';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isUpcoming = (date: Date) => {
    return date > new Date();
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading conferences...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conference Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conferences</p>
                <p className="text-2xl font-bold">{conferences.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-2xl font-bold">
                  {conferences.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Video className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">
                  {conferences.filter(c => c.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">
                  {conferences.reduce((sum, c) => sum + c.participants.length, 0)}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Video Conference Manager
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Conference
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="karate">Karate</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conferences List */}
      <div className="space-y-4">
        {filteredConferences.map((conference) => (
          <Card key={conference.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{getTypeIcon(conference.type)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{conference.title}</h3>
                      <p className="text-sm text-gray-600">with {conference.instructor}</p>
                    </div>
                    <Badge className={getStatusColor(conference.status)}>
                      {conference.status.toUpperCase()}
                    </Badge>
                    {conference.status === 'active' && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{conference.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {formatDateTime(conference.scheduledTime)}
                        </div>
                        {isUpcoming(conference.scheduledTime) && (
                          <div className="text-xs text-green-600">Upcoming</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {formatDuration(conference.duration)}
                        </div>
                        {conference.actualDuration && (
                          <div className="text-xs text-gray-500">
                            Actual: {formatDuration(conference.actualDuration)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {conference.currentParticipants}/{conference.maxParticipants}
                        </div>
                        <div className="text-xs text-gray-500">participants</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="capitalize">
                        {conference.category}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {conference.type.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Meeting ID:</span>
                        <code className="ml-2 bg-white px-2 py-1 rounded">
                          {conference.meetingId}
                        </code>
                      </div>
                      {conference.passcode && (
                        <div>
                          <span className="font-medium">Passcode:</span>
                          <code className="ml-2 bg-white px-2 py-1 rounded">
                            {conference.passcode}
                          </code>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Features:</span>
                        {conference.isRecording && <Badge variant="secondary">Recording</Badge>}
                        {conference.chatEnabled && <Badge variant="secondary">Chat</Badge>}
                        {conference.screenShareEnabled && <Badge variant="secondary">Screen Share</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  {conference.participants.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Participants ({conference.participants.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {conference.participants.slice(0, 5).map((participant) => (
                          <div key={participant.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              participant.status === 'joined' ? 'bg-green-500' :
                              participant.status === 'waiting' ? 'bg-yellow-500' :
                              participant.status === 'left' ? 'bg-gray-500' : 'bg-blue-500'
                            }`}></div>
                            {participant.name}
                          </div>
                        ))}
                        {conference.participants.length > 5 && (
                          <Badge variant="secondary">
                            +{conference.participants.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {conference.status === 'scheduled' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => startConference(conference.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyMeetingUrl(conference.meetingUrl)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </>
                  )}

                  {conference.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => window.open(conference.meetingUrl, '_blank')}
                        className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => endConference(conference.id)}
                      >
                        <PhoneOff className="w-4 h-4 mr-2" />
                        End
                      </Button>
                    </>
                  )}

                  {conference.status === 'ended' && conference.recordingUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(conference.recordingUrl, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View Recording
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDetails(conference)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Details
                  </Button>

                  {conference.status === 'scheduled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelConference(conference.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredConferences.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conferences found</h3>
            <p className="text-gray-600 mb-4">Schedule your first conference to get started.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
            >
              Schedule Conference
            </Button>
          </Card>
        )}
      </div>

      {/* Create Conference Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Conference</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="conf-title">Title *</Label>
              <Input
                id="conf-title"
                value={newConference.title}
                onChange={(e) => setNewConference(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter conference title"
              />
            </div>

            <div>
              <Label htmlFor="conf-description">Description</Label>
              <Textarea
                id="conf-description"
                value={newConference.description}
                onChange={(e) => setNewConference(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the conference..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={newConference.category}
                  onValueChange={(value: 'fitness' | 'karate' | 'forex') => 
                    setNewConference(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="karate">Karate</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={newConference.type}
                  onValueChange={(value: 'one-on-one' | 'group' | 'webinar') => {
                    setNewConference(prev => ({ 
                      ...prev, 
                      type: value,
                      maxParticipants: value === 'one-on-one' ? 1 : value === 'group' ? 8 : 50
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-on-one">One-on-One</SelectItem>
                    <SelectItem value="group">Group Session</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="conf-time">Scheduled Time *</Label>
                <Input
                  id="conf-time"
                  type="datetime-local"
                  value={newConference.scheduledTime}
                  onChange={(e) => setNewConference(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="conf-duration">Duration (minutes)</Label>
                <Input
                  id="conf-duration"
                  type="number"
                  value={newConference.duration}
                  onChange={(e) => setNewConference(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  min="15"
                  max="480"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="max-participants">Max Participants</Label>
              <Input
                id="max-participants"
                type="number"
                value={newConference.maxParticipants}
                onChange={(e) => setNewConference(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                min="1"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="participant-emails">Participant Emails (comma-separated)</Label>
              <Textarea
                id="participant-emails"
                value={newConference.participantEmails}
                onChange={(e) => setNewConference(prev => ({ ...prev, participantEmails: e.target.value }))}
                placeholder="user1@example.com, user2@example.com"
                rows={2}
              />
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h4 className="font-medium">Conference Settings</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="chat-enabled">Enable Chat</Label>
                <Switch
                  id="chat-enabled"
                  checked={newConference.chatEnabled}
                  onCheckedChange={(checked) => 
                    setNewConference(prev => ({ ...prev, chatEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="screen-share">Enable Screen Sharing</Label>
                <Switch
                  id="screen-share"
                  checked={newConference.screenShareEnabled}
                  onCheckedChange={(checked) => 
                    setNewConference(prev => ({ ...prev, screenShareEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="waiting-room">Enable Waiting Room</Label>
                <Switch
                  id="waiting-room"
                  checked={newConference.waitingRoomEnabled}
                  onCheckedChange={(checked) => 
                    setNewConference(prev => ({ ...prev, waitingRoomEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recording">Auto-Record Session</Label>
                <Switch
                  id="recording"
                  checked={newConference.isRecording}
                  onCheckedChange={(checked) => 
                    setNewConference(prev => ({ ...prev, isRecording: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="private">Private Conference</Label>
                <Switch
                  id="private"
                  checked={newConference.isPrivate}
                  onCheckedChange={(checked) => 
                    setNewConference(prev => ({ ...prev, isPrivate: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createConference}
                disabled={!newConference.title.trim() || !newConference.scheduledTime}
                className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
              >
                Schedule Conference
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conference Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Conference Details</DialogTitle>
          </DialogHeader>
          
          {selectedConference && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {selectedConference.title}</div>
                    <div><strong>Instructor:</strong> {selectedConference.instructor}</div>
                    <div><strong>Category:</strong> {selectedConference.category}</div>
                    <div><strong>Type:</strong> {selectedConference.type}</div>
                    <div><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedConference.status)}`}>
                        {selectedConference.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Schedule & Duration</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Scheduled:</strong> {formatDateTime(selectedConference.scheduledTime)}</div>
                    <div><strong>Duration:</strong> {formatDuration(selectedConference.duration)}</div>
                    {selectedConference.actualDuration && (
                      <div><strong>Actual Duration:</strong> {formatDuration(selectedConference.actualDuration)}</div>
                    )}
                    <div><strong>Created:</strong> {formatDateTime(selectedConference.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Meeting Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span><strong>Meeting URL:</strong></span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyMeetingUrl(selectedConference.meetingUrl)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="text-sm font-mono bg-white p-2 rounded border break-all">
                    {selectedConference.meetingUrl}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <strong>Meeting ID:</strong>
                      <div className="font-mono text-lg">{selectedConference.meetingId}</div>
                    </div>
                    {selectedConference.passcode && (
                      <div>
                        <strong>Passcode:</strong>
                        <div className="font-mono text-lg">{selectedConference.passcode}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features & Settings</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedConference.isRecording && <Badge>Recording Enabled</Badge>}
                  {selectedConference.chatEnabled && <Badge>Chat Enabled</Badge>}
                  {selectedConference.screenShareEnabled && <Badge>Screen Share</Badge>}
                  {selectedConference.waitingRoomEnabled && <Badge>Waiting Room</Badge>}
                  {selectedConference.isPrivate && <Badge>Private</Badge>}
                </div>
              </div>

              {selectedConference.participants.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Participants ({selectedConference.participants.length})</h3>
                  <div className="space-y-2">
                    {selectedConference.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            participant.status === 'joined' ? 'bg-green-500' :
                            participant.status === 'waiting' ? 'bg-yellow-500' :
                            participant.status === 'left' ? 'bg-gray-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-gray-600">{participant.email}</div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="capitalize font-medium">{participant.status}</div>
                          {participant.joinedAt && (
                            <div className="text-gray-500">
                              Joined: {participant.joinedAt.toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedConference.recordingUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Recording</h3>
                  <Button
                    onClick={() => window.open(selectedConference.recordingUrl, '_blank')}
                    className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Recording
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyMeetingDetails(selectedConference)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConferenceManager;