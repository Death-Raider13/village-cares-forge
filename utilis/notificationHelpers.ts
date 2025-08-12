import { supabase } from '@/integrations/supabase/client';

// ==========================================
// TYPES
// ==========================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 1 | 2 | 3; // 1=normal, 2=important, 3=urgent
export type Discipline = 'empathy' | 'communication' | 'leadership';

interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

interface CommunityPostData {
  title: string;
  content: string;
  userId: string;
  isPublished?: boolean;
}

interface LessonData {
  title: string;
  description?: string;
  content?: string;
  discipline: Discipline;
  userId: string;
  isPublished?: boolean;
}

interface AnnouncementData {
  title: string;
  content: string;
  priority?: NotificationPriority;
  createdBy: string;
  isPublished?: boolean;
}

interface NotificationData {
  userId?: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  priority?: NotificationPriority;
  category?: string;
  isGlobal?: boolean;
}

// ==========================================
// COMMUNITY POST HELPERS
// ==========================================

/**
 * Creates a new community post
 * @param postData The data for the new community post
 * @returns A promise that resolves to a BaseResponse with the created post data
 */
export const createCommunityPost = async (postData: CommunityPostData): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('community_posts' as any)
      .insert({
        title: postData.title,
        content: postData.content,
        user_id: postData.userId,
        is_published: postData.isPublished || false,
      } as any)
      .select()
      .single());

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating community post:', error);
    return { success: false, error };
  }
};

/**
 * Publishes a community post
 * @param postId The ID of the post to publish
 * @returns A promise that resolves to a BaseResponse with the published post data
 */
export const publishCommunityPost = async (postId: string): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('community_posts' as any)
      .update({ is_published: true } as any)
      .eq('id', postId)
      .select()
      .single());

    if (error) throw error;

    // The database trigger will automatically create notifications
    return { success: true, data };
  } catch (error) {
    console.error('Error publishing community post:', error);
    return { success: false, error };
  }
};

// ==========================================
// LESSON HELPERS
// ==========================================

/**
 * Creates a new lesson
 * @param lessonData The data for the new lesson
 * @returns A promise that resolves to a BaseResponse with the created lesson data
 */
export const createLesson = async (lessonData: LessonData): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('lessons' as any)
      .insert({
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        discipline: lessonData.discipline,
        user_id: lessonData.userId,
        is_published: lessonData.isPublished || false,
      } as any)
      .select()
      .single());

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { success: false, error };
  }
};

/**
 * Publishes a lesson
 * @param lessonId The ID of the lesson to publish
 * @returns A promise that resolves to a BaseResponse with the published lesson data
 */
export const publishLesson = async (lessonId: string): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('lessons' as any)
      .update({ is_published: true } as any)
      .eq('id', lessonId)
      .select()
      .single());

    if (error) throw error;

    // The database trigger will automatically create notifications
    return { success: true, data };
  } catch (error) {
    console.error('Error publishing lesson:', error);
    return { success: false, error };
  }
};

// ==========================================
// ANNOUNCEMENT HELPERS (ADMIN ONLY)
// ==========================================

/**
 * Creates a new announcement (admin only)
 * @param announcementData The data for the new announcement
 * @returns A promise that resolves to a BaseResponse with the created announcement data
 */
export const createAnnouncement = async (announcementData: AnnouncementData): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('announcements' as any)
      .insert({
        title: announcementData.title,
        content: announcementData.content,
        priority: announcementData.priority || 1,
        created_by: announcementData.createdBy,
        is_published: announcementData.isPublished || false,
      } as any)
      .select()
      .single());

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating announcement:', error);
    return { success: false, error };
  }
};

/**
 * Publishes an announcement
 * @param announcementId The ID of the announcement to publish
 * @returns A promise that resolves to a BaseResponse with the published announcement data
 */
export const publishAnnouncement = async (announcementId: string): Promise<BaseResponse> => {
  try {
    // Using type assertion to bypass TypeScript checks
    const { data, error } = await (supabase
      .from('announcements' as any)
      .update({ is_published: true } as any)
      .eq('id', announcementId)
      .select()
      .single());

    if (error) throw error;

    // The database trigger will automatically create global notifications
    return { success: true, data };
  } catch (error) {
    console.error('Error publishing announcement:', error);
    return { success: false, error };
  }
};

// ==========================================
// MANUAL NOTIFICATION HELPERS
// ==========================================

/**
 * Creates a manual notification for a user or globally
 * @param notificationData The data for the new notification
 * @returns A promise that resolves to a BaseResponse with the created notification data
 */
export const createManualNotification = async (notificationData: NotificationData): Promise<BaseResponse> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'info',
        link: notificationData.link,
        priority: notificationData.priority || 1,
        category: notificationData.category || 'general',
        is_global: notificationData.isGlobal || !notificationData.userId,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating manual notification:', error);
    return { success: false, error };
  }
};

// ==========================================
// BULK NOTIFICATION HELPERS
// ==========================================

/**
 * Creates notifications for multiple users at once
 * @param userIds Array of user IDs to create notifications for
 * @param notificationData The notification data to use for all users
 * @returns A promise that resolves to a BaseResponse with the created notifications data
 */
export const createBulkNotifications = async (
  userIds: string[],
  notificationData: Omit<NotificationData, 'userId' | 'isGlobal'>
): Promise<BaseResponse> => {
  try {
    if (!userIds.length) {
      return { success: false, error: 'No user IDs provided' };
    }

    const notifications = userIds.map(userId => ({
      user_id: userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      link: notificationData.link,
      priority: notificationData.priority || 1,
      category: notificationData.category || 'general',
      is_global: false,
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return { success: false, error };
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Gets all user IDs for sending notifications
 * @param excludeUserId Optional user ID to exclude from the results
 * @returns A promise that resolves to a BaseResponse with an array of user IDs
 */
export const getUsersForNotification = async (excludeUserId?: string): Promise<BaseResponse<string[]>> => {
  try {
    let query = supabase
      .from('profiles')
      .select('id');

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data: data.map(user => user.id) };
  } catch (error) {
    console.error('Error getting users for notification:', error);
    return { success: false, error };
  }
};

/**
 * Checks if a user has admin privileges
 * @param userId The ID of the user to check
 * @returns A promise that resolves to a boolean indicating if the user is an admin
 */
export const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};