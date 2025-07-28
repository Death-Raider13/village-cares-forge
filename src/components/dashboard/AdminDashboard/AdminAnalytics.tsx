import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Video, 
  Eye,
  Clock,
  Star,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalVideos: number;
    totalViews: number;
    totalWatchTime: number; // in minutes
    avgSessionDuration: number; // in minutes
    userGrowth: number; // percentage
    viewsGrowth: number; // percentage
  };
  videoMetrics: {
    mostWatched: Array<{
      id: string;
      title: string;
      views: number;
      category: string;
      watchTime: number;
      completionRate: number;
    }>;
    categoryPerformance: Array<{
      category: 'fitness' | 'karate' | 'forex';
      views: number;
      videos: number;
      avgRating: number;
      engagement: number;
    }>;
  };
  userMetrics: {
    registrations: Array<{
      date: string;
      count: number;
    }>;
    deviceTypes: Array<{
      type: 'desktop' | 'mobile' | 'tablet';
      count: number;
      percentage: number;
    }>;
    locations: Array<{
      country: string;
      users: number;
      percentage: number;
    }>;
  };
  engagement: {
    dailyActiveUsers: Array<{
      date: string;
      users: number;
    }>;
    sessionDuration: Array<{
      date: string;
      avgDuration: number;
    }>;
    retention: {
      day1: number;
      day7: number;
      day30: number;
    };
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurring: number;
    subscriptions: {
      active: number;
      churned: number;
      growth: number;
    };
  };
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedCategory]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call with loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock analytics data
    const mockData: AnalyticsData = {
      overview: {
        totalUsers: 2847,
        activeUsers: 1203,
        totalVideos: 156,
        totalViews: 45678,
        totalWatchTime: 125340, // minutes
        avgSessionDuration: 24.5,
        userGrowth: 12.3,
        viewsGrowth: 8.7
      },
      videoMetrics: {
        mostWatched: [
          {
            id: '1',
            title: 'Full Body HIIT Workout - 30 Minutes',
            views: 3456,
            category: 'fitness',
            watchTime: 2870,
            completionRate: 87
          },
          {
            id: '2',
            title: 'Forex Trading Psychology',
            views: 2890,
            category: 'forex',
            watchTime: 5780,
            completionRate: 72
          },
          {
            id: '3',
            title: 'Karate Kata: Heian Shodan',
            views: 2456,
            category: 'karate',
            watchTime: 3890,
            completionRate: 91
          }
        ],
        categoryPerformance: [
          {
            category: 'fitness',
            views: 18543,
            videos: 67,
            avgRating: 4.6,
            engagement: 78
          },
          {
            category: 'karate',
            views: 15234,
            videos: 45,
            avgRating: 4.8,
            engagement: 82
          },
          {
            category: 'forex',
            views: 11901,
            videos: 44,
            avgRating: 4.4,
            engagement: 65
          }
        ]
      },
      userMetrics: {
        registrations: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 38 },
          { date: '2024-01-04', count: 67 },
          { date: '2024-01-05', count: 43 }
        ],
        deviceTypes: [
          { type: 'desktop', count: 1598, percentage: 56.2 },
          { type: 'mobile', count: 952, percentage: 33.4 },
          { type: 'tablet', count: 297, percentage: 10.4 }
        ],
        locations: [
          { country: 'United States', users: 1245, percentage: 43.7 },
          { country: 'United Kingdom', users: 432, percentage: 15.2 },
          { country: 'Canada', users: 298, percentage: 10.5 },
          { country: 'Australia', users: 187, percentage: 6.6 },
          { country: 'Germany', users: 156, percentage: 5.5 }
        ]
      },
      engagement: {
        dailyActiveUsers: [
          { date: '2024-01-20', users: 892 },
          { date: '2024-01-21', users: 945 },
          { date: '2024-01-22', users: 1023 },
          { date: '2024-01-23', users: 1156 },
          { date: '2024-01-24', users: 1203 }
        ],
        sessionDuration: [
          { date: '2024-01-20', avgDuration: 22.3 },
          { date: '2024-01-21', avgDuration: 24.1 },
          { date: '2024-01-22', avgDuration: 23.8 },
          { date: '2024-01-23', avgDuration: 25.2 },
          { date: '2024-01-24', avgDuration: 24.5 }
        ],
        retention: {
          day1: 78.5,
          day7: 45.2,
          day30: 28.7
        }
      },
      revenue: {
        totalRevenue: 125430,
        monthlyRecurring: 18750,
        subscriptions: {
          active: 1847,
          churned: 123,
          growth: 8.3
        }
      }
    };

    setData(mockData);
    setLastUpdated(new Date());
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${Math.floor(mins)}m` : `${Math.floor(mins)}m`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    } else if (growth < 0) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading analytics...</span>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Unable to load analytics data at this time.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadAnalyticsData()}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
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

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.totalUsers)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(data.overview.userGrowth)}
                  <span className={`text-sm ${getGrowthColor(data.overview.userGrowth)}`}>
                    {Math.abs(data.overview.userGrowth)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.activeUsers)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((data.overview.activeUsers / data.overview.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.totalViews)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(data.overview.viewsGrowth)}
                  <span className={`text-sm ${getGrowthColor(data.overview.viewsGrowth)}`}>
                    {Math.abs(data.overview.viewsGrowth)}%
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Watch Time</p>
                <p className="text-3xl font-bold">{formatDuration(data.overview.totalWatchTime)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: {formatDuration(data.overview.avgSessionDuration)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Watched Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.videoMetrics.mostWatched.map((video, index) => (
                <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-vintage-gold rounded-full flex items-center justify-center text-sm font-bold text-vintage-deep-blue">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-1">{video.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="capitalize">{video.category}</span>
                        <span>{video.completionRate}% completion</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatNumber(video.views)}</div>
                    <div className="text-sm text-gray-600">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.videoMetrics.categoryPerformance.map((category) => (
                <div key={category.category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold capitalize">{category.category}</h4>
                    <Badge variant="secondary">{category.videos} videos</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Views</div>
                      <div className="font-bold">{formatNumber(category.views)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Rating</div>
                      <div className="font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {category.avgRating}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Engagement</div>
                      <div className="font-bold">{category.engagement}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.userMetrics.deviceTypes.map((device) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <span className="capitalize font-medium">{device.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{device.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.userMetrics.locations.map((location) => (
                <div key={location.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="font-medium">{location.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{location.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Day 1 Retention</span>
                <span className="font-bold text-green-600">{data.engagement.retention.day1}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Day 7 Retention</span>
                <span className="font-bold text-yellow-600">{data.engagement.retention.day7}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Day 30 Retention</span>
                <span className="font-bold text-red-600">{data.engagement.retention.day30}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Total Revenue</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(data.revenue.totalRevenue)}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Monthly Recurring</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(data.revenue.monthlyRecurring)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Subscriptions</span>
                <span className="font-bold text-2xl">{data.revenue.subscriptions.active.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Churned (this month)</span>
                <span className="font-bold text-red-600">{data.revenue.subscriptions.churned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Growth Rate</span>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(data.revenue.subscriptions.growth)}
                  <span className={`font-bold ${getGrowthColor(data.revenue.subscriptions.growth)}`}>
                    {Math.abs(data.revenue.subscriptions.growth)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Daily Active Users (Last 5 days)</h4>
              <div className="space-y-2">
                {data.engagement.dailyActiveUsers.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    <span className="font-medium">{day.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Average Session Duration</h4>
              <div className="space-y-2">
                {data.engagement.sessionDuration.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    <span className="font-medium">{formatDuration(day.avgDuration)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export User Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Video Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Revenue Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;