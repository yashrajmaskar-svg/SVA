export type PriorityLevel = 'Urgent' | 'Important' | 'General' | 'Normal';

export interface SchoolSettings {
  institutionName: string;
  schoolName?: string;
  schoolCode?: string;
  affiliationNumber?: string;
  boardName?: string;
  schoolAddress: string;
  principalName: string;
  principalEmail?: string;
  contactEmail?: string;
  contactPhone?: string;
  academicYear: string;
  smtpConfigured?: boolean;
  senderEmail?: string;
  logoUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  targetAudience: string; // 'All Faculty' | 'Primary Wing' | 'Secondary Wing' | 'Senior Wing' | 'All Staff'
  published: boolean;
  sendEmailNotification: boolean;
  createdAt: string;
  author: string;
  tags?: string[];
}

export interface Circular {
  id: string;
  refNo: string;
  title: string;
  date: string;
  category: 'Administrative' | 'Academic' | 'Examination' | 'General' | 'Finance';
  summary: string;
  content: string;
  signedBy: string;
  fileUrl?: string;
  fileName?: string;
  published: boolean;
  createdAt: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: 'Academic' | 'Exam' | 'Cultural' | 'Sports' | 'Meeting' | 'Holiday';
  organizer: string;
  targetAudience?: string;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableEntry {
  id: string;
  day: Weekday;
  period: number;
  timeSlot: string; // e.g. "08:30 AM - 09:15 AM"
  gradeClass: string; // e.g. "Grade 10-A"
  subject: string;
  teacherName: string;
  room: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  active: boolean;
  joinedDate: string;
  assignedClasses?: string[];
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  messageType: 'announcement' | 'circular' | 'event' | 'direct' | 'system';
  status: 'sent' | 'failed' | 'queued';
  sentAt: string;
  errorMessage?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'principal' | 'teacher';
  department?: string;
  designation?: string;
}
