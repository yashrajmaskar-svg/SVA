import {
  SchoolSettings,
  Announcement,
  Circular,
  SchoolEvent,
  TimetableEntry,
  Teacher,
  EmailLog,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'school_hub_settings',
  ANNOUNCEMENTS: 'school_hub_announcements',
  CIRCULARS: 'school_hub_circulars',
  EVENTS: 'school_hub_events',
  TIMETABLE: 'school_hub_timetable',
  TEACHERS: 'school_hub_teachers',
  EMAIL_LOGS: 'school_hub_email_logs',
};

const INITIAL_SETTINGS: SchoolSettings = {
  institutionName: "St. Xavier's International Academy",
  schoolName: "St. Xavier's International Academy",
  schoolCode: 'SXIA-DEL-409',
  affiliationNumber: 'CBSE/AFF/2130894/2026',
  boardName: 'Central Board of Secondary Education (CBSE)',
  schoolAddress: 'Heritage Campus, Sector 14, Institutional Area, New Delhi - 110001',
  principalName: 'Dr. Rajeshwar Sharma, Ph.D.',
  principalEmail: 'principal@schoolsmarthub.edu',
  contactEmail: 'admissions@schoolsmarthub.edu',
  contactPhone: '+91 11 2684 9000 / +91 98101 23456',
  academicYear: '2026-2027',
  smtpConfigured: true,
  senderEmail: 'notifications@schoolsmarthub.edu',
};

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-01',
    name: 'Mrs. Sunita Deshmukh',
    email: 's.deshmukh@schoolsmarthub.edu',
    department: 'Mathematics',
    designation: 'Head of Department & Senior Faculty',
    phone: '+91 98201 11223',
    active: true,
    joinedDate: '2018-07-15',
    assignedClasses: ['Grade 10-A', 'Grade 12-Sci'],
  },
  {
    id: 'tch-02',
    name: 'Dr. Vikramaditya Sen',
    email: 'v.sen@schoolsmarthub.edu',
    department: 'Physics',
    designation: 'Senior Faculty - Advanced Physics',
    phone: '+91 98201 22334',
    active: true,
    joinedDate: '2019-04-10',
    assignedClasses: ['Grade 11-Sci', 'Grade 12-Sci'],
  },
  {
    id: 'tch-03',
    name: 'Mrs. Rebecca Fernandez',
    email: 'r.fernandez@schoolsmarthub.edu',
    department: 'English Literature',
    designation: 'Department Coordinator & Senior Faculty',
    phone: '+91 98201 33445',
    active: true,
    joinedDate: '2017-06-01',
    assignedClasses: ['Grade 9-A', 'Grade 10-A', 'Grade 11-Com'],
  },
  {
    id: 'tch-04',
    name: 'Mr. Arvind Kejriwal Murthy',
    email: 'a.murthy@schoolsmarthub.edu',
    department: 'Chemistry',
    designation: 'Laboratory Supervisor & Faculty',
    phone: '+91 98201 44556',
    active: true,
    joinedDate: '2020-08-20',
    assignedClasses: ['Grade 10-A', 'Grade 11-Sci'],
  },
  {
    id: 'tch-05',
    name: 'Ms. Ananya Roy',
    email: 'a.roy@schoolsmarthub.edu',
    department: 'Computer Science',
    designation: 'Lead STEM Instructor & AI Lab Mentor',
    phone: '+91 98201 55667',
    active: true,
    joinedDate: '2021-03-12',
    assignedClasses: ['Grade 9-A', 'Grade 10-A', 'Grade 12-Sci'],
  },
  {
    id: 'tch-06',
    name: 'Mr. Pradeep Narang',
    email: 'p.narang@schoolsmarthub.edu',
    department: 'Social Sciences',
    designation: 'Faculty - History & Civics',
    phone: '+91 98201 66778',
    active: true,
    joinedDate: '2016-09-05',
    assignedClasses: ['Grade 9-A', 'Grade 10-A'],
  },
  {
    id: 'tch-07',
    name: 'Mrs. Deepa Krishnan',
    email: 'd.krishnan@schoolsmarthub.edu',
    department: 'Biology',
    designation: 'Life Sciences Faculty',
    phone: '+91 98201 77889',
    active: true,
    joinedDate: '2019-11-18',
    assignedClasses: ['Grade 10-A', 'Grade 12-Sci'],
  },
  {
    id: 'tch-08',
    name: 'Mr. Sandeep Gill',
    email: 's.gill@schoolsmarthub.edu',
    department: 'Physical Education',
    designation: 'Sports Director & Athletics Coach',
    phone: '+91 98201 88990',
    active: true,
    joinedDate: '2015-02-14',
    assignedClasses: ['All Grades'],
  },
  {
    id: 'tch-09',
    name: 'Mrs. Malini Bannerjee',
    email: 'm.bannerjee@schoolsmarthub.edu',
    department: 'Economics',
    designation: 'Faculty - Commerce & Accountancy',
    phone: '+91 98201 99001',
    active: false,
    joinedDate: '2022-01-10',
    assignedClasses: ['Grade 11-Com', 'Grade 12-Com'],
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Pre-Board Examination Schedule & Invigilation Duties Finalized',
    message: 'All secondary and senior secondary teachers are requested to collect their assigned examination invigilation roster from the Academic Dean office by 3:00 PM today. Ensure strict adherence to CBSE protocol.',
    priority: 'Urgent',
    targetAudience: 'All Faculty',
    published: true,
    sendEmailNotification: true,
    createdAt: '2026-10-05T08:30:00.000Z',
    author: 'Dr. Rajeshwar Sharma, Principal',
    tags: ['Examinations', 'Duties', 'Urgent'],
  },
  {
    id: 'ann-02',
    title: 'Inter-School Annual Science & Tech Exhibition 2026',
    message: 'The Annual STEM showcase is slated for Friday, October 24th. STEM and CS faculty are invited to review student project proposals in Room 302 during zero period on Wednesday.',
    priority: 'Important',
    targetAudience: 'All Faculty',
    published: true,
    sendEmailNotification: true,
    createdAt: '2026-10-04T10:15:00.000Z',
    author: 'Dr. Rajeshwar Sharma, Principal',
    tags: ['STEM', 'Exhibition'],
  },
  {
    id: 'ann-03',
    title: 'Parent-Teacher Council Conference (PTM) Timing Update',
    message: 'The upcoming quarterly PTM will convene on Saturday from 8:30 AM to 1:30 PM. All class educators are requested to have grade books, student attendance registers, and constructive feedback dossiers prepared.',
    priority: 'Important',
    targetAudience: 'All Faculty',
    published: true,
    sendEmailNotification: true,
    createdAt: '2026-10-02T14:00:00.000Z',
    author: 'Principal Secretariat',
    tags: ['PTM', 'Academics'],
  },
  {
    id: 'ann-04',
    title: 'Campus Winter Uniform Transition Guidelines',
    message: 'Students and staff may begin wearing formal navy winter blazers starting Monday, 13th October. Please inform students in morning homeroom roll calls.',
    priority: 'Normal',
    targetAudience: 'All Staff',
    published: true,
    sendEmailNotification: false,
    createdAt: '2026-09-28T09:00:00.000Z',
    author: 'Administration Office',
    tags: ['Uniform', 'Policy'],
  },
];

const INITIAL_CIRCULARS: Circular[] = [
  {
    id: 'circ-01',
    refNo: 'CIR/ACAD/2026/042',
    title: 'Mandatory Implementation of Digital Lesson Logs on Institutional Cloud',
    date: '2026-10-03',
    category: 'Academic',
    summary: 'Directing all department leads and educators to synchronize weekly lesson schemes on the academic portal.',
    content: `It is hereby notified to all teaching faculty members that beginning Term 2, lesson plans and curriculum progress tracking must be updated digitally on the institutional portal by each Friday, 5:00 PM.\n\nKey Directives:\n1. Unit tests and weekly assessments must align with prescribed learning outcomes.\n2. Homework assignments must be logged to avoid clustering heavy submissions on single weekdays.\n3. Department coordinators will review submissions every Monday morning.\n\nYour active dedication to maintaining academic rigor and structured documentation is appreciated.`,
    signedBy: 'Dr. Rajeshwar Sharma, Principal',
    fileName: 'CIR_ACAD_2026_042_Digital_Lesson_Logs.pdf',
    published: true,
    createdAt: '2026-10-03T11:00:00.000Z',
  },
  {
    id: 'circ-02',
    refNo: 'CIR/ADM/2026/018',
    title: 'Campus Safety, Fire Drill Protocol & Emergency Evacuation Plan',
    date: '2026-09-25',
    category: 'Administrative',
    summary: 'Standard operating procedures for quarterly safety evacuation drill scheduled on October 12.',
    content: `A mandatory fire and emergency evacuation drill will be conducted for the entire senior and junior campus wings on October 12, 2026 at 11:15 AM.\n\nFaculty responsibilities:\n- Floor in-charges must check classrooms and washrooms.\n- Class teachers must escort students to designated muster point on the main football field.\n- Attendance headcount must be reported to the Safety Officer within 4 minutes.`,
    signedBy: 'Dr. Rajeshwar Sharma, Principal',
    fileName: 'CIR_ADM_2026_018_Campus_Safety.pdf',
    published: true,
    createdAt: '2026-09-25T08:30:00.000Z',
  },
  {
    id: 'circ-03',
    refNo: 'CIR/EXAM/2026/009',
    title: 'Guidelines for Mid-Term Assessment Grading & Report Card Generation',
    date: '2026-09-15',
    category: 'Examination',
    summary: 'Timeline for mark entry, moderation committee review, and parent dispatch.',
    content: `Faculty members are reminded that the final deadline for grade submission for Mid-Term evaluations is October 10. Marks entry portals will automatically lock at midnight. Please coordinate with the IT department for any verification queries.`,
    signedBy: 'Controller of Examinations & Principal',
    fileName: 'CIR_EXAM_2026_009_Grading_SOP.pdf',
    published: true,
    createdAt: '2026-09-15T12:00:00.000Z',
  },
];

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-01',
    title: 'Annual Inter-House Debate Championship 2026',
    description: 'Premier debating tournament featuring propositions on Ethics of Artificial Intelligence and Climate Action. All faculty judges are invited.',
    eventDate: '2026-10-15',
    startTime: '09:30 AM',
    endTime: '01:00 PM',
    location: 'Main Auditorium (Sir C.V. Raman Hall)',
    category: 'Cultural',
    organizer: 'English Literary Society & Senior Faculty',
  },
  {
    id: 'evt-02',
    title: 'Pre-Board Examination Commences (Classes 10 & 12)',
    description: 'First sitting of simulated board examinations. Morning reporting time for invigilators: 08:00 AM sharp in Examination Control Cell.',
    eventDate: '2026-10-20',
    startTime: '08:30 AM',
    endTime: '12:00 PM',
    location: 'Examination Wing Blocks A & B',
    category: 'Exam',
    organizer: 'Examination Board Committee',
  },
  {
    id: 'evt-03',
    title: 'Annual Athletics Meet & Sports Day Opening Ceremony',
    description: 'Track and field heats, march past by house contingents, and faculty 100m exhibition sprint.',
    eventDate: '2026-11-06',
    startTime: '08:00 AM',
    endTime: '03:30 PM',
    location: 'Sports Ground & Athletics Stadium',
    category: 'Sports',
    organizer: 'Department of Physical Education',
  },
  {
    id: 'evt-04',
    title: 'Parent-Teacher Council Conference (PTM)',
    description: 'Term 1 comprehensive progress reviews and parent consultation sessions.',
    eventDate: '2026-10-11',
    startTime: '08:30 AM',
    endTime: '01:30 PM',
    location: 'Senior Wing Classrooms',
    category: 'Meeting',
    organizer: 'Academic Coordination Cell',
  },
];

const INITIAL_TIMETABLE: TimetableEntry[] = [
  // Monday
  { id: 'tt-01', day: 'Monday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Mathematics', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
  { id: 'tt-02', day: 'Monday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Physics', teacherName: 'Dr. Vikramaditya Sen', room: 'Physics Lab 1' },
  { id: 'tt-03', day: 'Monday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'English Lit', teacherName: 'Mrs. Rebecca Fernandez', room: 'Room 204' },
  { id: 'tt-04', day: 'Monday', period: 4, timeSlot: '11:00 AM - 11:45 AM', gradeClass: 'Grade 10-A', subject: 'Chemistry', teacherName: 'Mr. Arvind Kejriwal Murthy', room: 'Chem Lab' },
  { id: 'tt-05', day: 'Monday', period: 5, timeSlot: '12:15 PM - 01:00 PM', gradeClass: 'Grade 10-A', subject: 'Computer Science', teacherName: 'Ms. Ananya Roy', room: 'Computer Lab 2' },
  { id: 'tt-06', day: 'Monday', period: 6, timeSlot: '01:00 PM - 01:45 PM', gradeClass: 'Grade 10-A', subject: 'Social Science', teacherName: 'Mr. Pradeep Narang', room: 'Room 204' },
  { id: 'tt-07', day: 'Monday', period: 7, timeSlot: '01:45 PM - 02:30 PM', gradeClass: 'Grade 10-A', subject: 'Physical Education', teacherName: 'Mr. Sandeep Gill', room: 'Ground' },

  // Tuesday
  { id: 'tt-08', day: 'Tuesday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Physics', teacherName: 'Dr. Vikramaditya Sen', room: 'Physics Lab 1' },
  { id: 'tt-09', day: 'Tuesday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Mathematics', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
  { id: 'tt-10', day: 'Tuesday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'Biology', teacherName: 'Mrs. Deepa Krishnan', room: 'Bio Lab' },
  { id: 'tt-11', day: 'Tuesday', period: 4, timeSlot: '11:00 AM - 11:45 AM', gradeClass: 'Grade 10-A', subject: 'English Lit', teacherName: 'Mrs. Rebecca Fernandez', room: 'Room 204' },
  { id: 'tt-12', day: 'Tuesday', period: 5, timeSlot: '12:15 PM - 01:00 PM', gradeClass: 'Grade 10-A', subject: 'Social Science', teacherName: 'Mr. Pradeep Narang', room: 'Room 204' },
  { id: 'tt-13', day: 'Tuesday', period: 6, timeSlot: '01:00 PM - 01:45 PM', gradeClass: 'Grade 10-A', subject: 'Computer Science', teacherName: 'Ms. Ananya Roy', room: 'Computer Lab 2' },

  // Wednesday
  { id: 'tt-14', day: 'Wednesday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Chemistry', teacherName: 'Mr. Arvind Kejriwal Murthy', room: 'Chem Lab' },
  { id: 'tt-15', day: 'Wednesday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Mathematics', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
  { id: 'tt-16', day: 'Wednesday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'Physics', teacherName: 'Dr. Vikramaditya Sen', room: 'Physics Lab 1' },
  { id: 'tt-17', day: 'Wednesday', period: 4, timeSlot: '11:00 AM - 11:45 AM', gradeClass: 'Grade 10-A', subject: 'Social Science', teacherName: 'Mr. Pradeep Narang', room: 'Room 204' },
  { id: 'tt-18', day: 'Wednesday', period: 5, timeSlot: '12:15 PM - 01:00 PM', gradeClass: 'Grade 10-A', subject: 'English Lit', teacherName: 'Mrs. Rebecca Fernandez', room: 'Room 204' },

  // Thursday
  { id: 'tt-19', day: 'Thursday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Biology', teacherName: 'Mrs. Deepa Krishnan', room: 'Bio Lab' },
  { id: 'tt-20', day: 'Thursday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Mathematics', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
  { id: 'tt-21', day: 'Thursday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'English Lit', teacherName: 'Mrs. Rebecca Fernandez', room: 'Room 204' },
  { id: 'tt-22', day: 'Thursday', period: 4, timeSlot: '11:00 AM - 11:45 AM', gradeClass: 'Grade 10-A', subject: 'Chemistry', teacherName: 'Mr. Arvind Kejriwal Murthy', room: 'Chem Lab' },
  { id: 'tt-23', day: 'Thursday', period: 5, timeSlot: '12:15 PM - 01:00 PM', gradeClass: 'Grade 10-A', subject: 'Computer Science', teacherName: 'Ms. Ananya Roy', room: 'Computer Lab 2' },

  // Friday
  { id: 'tt-24', day: 'Friday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Mathematics', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
  { id: 'tt-25', day: 'Friday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Physics', teacherName: 'Dr. Vikramaditya Sen', room: 'Physics Lab 1' },
  { id: 'tt-26', day: 'Friday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'Social Science', teacherName: 'Mr. Pradeep Narang', room: 'Room 204' },
  { id: 'tt-27', day: 'Friday', period: 4, timeSlot: '11:00 AM - 11:45 AM', gradeClass: 'Grade 10-A', subject: 'English Lit', teacherName: 'Mrs. Rebecca Fernandez', room: 'Room 204' },
  { id: 'tt-28', day: 'Friday', period: 5, timeSlot: '12:15 PM - 01:00 PM', gradeClass: 'Grade 10-A', subject: 'Library / Reading', teacherName: 'Mrs. Rebecca Fernandez', room: 'Central Library' },

  // Saturday
  { id: 'tt-29', day: 'Saturday', period: 1, timeSlot: '08:30 AM - 09:15 AM', gradeClass: 'Grade 10-A', subject: 'Club Activities / STEM', teacherName: 'Ms. Ananya Roy', room: 'Maker Space' },
  { id: 'tt-30', day: 'Saturday', period: 2, timeSlot: '09:15 AM - 10:00 AM', gradeClass: 'Grade 10-A', subject: 'Physical Education', teacherName: 'Mr. Sandeep Gill', room: 'Ground' },
  { id: 'tt-31', day: 'Saturday', period: 3, timeSlot: '10:15 AM - 11:00 AM', gradeClass: 'Grade 10-A', subject: 'Remedial Math Clinic', teacherName: 'Mrs. Sunita Deshmukh', room: 'Room 204' },
];

const INITIAL_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'log-01',
    recipientEmail: 's.deshmukh@schoolsmarthub.edu',
    recipientName: 'Mrs. Sunita Deshmukh',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:12.000Z',
  },
  {
    id: 'log-02',
    recipientEmail: 'v.sen@schoolsmarthub.edu',
    recipientName: 'Dr. Vikramaditya Sen',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:13.000Z',
  },
  {
    id: 'log-03',
    recipientEmail: 'r.fernandez@schoolsmarthub.edu',
    recipientName: 'Mrs. Rebecca Fernandez',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:13.000Z',
  },
  {
    id: 'log-04',
    recipientEmail: 'a.murthy@schoolsmarthub.edu',
    recipientName: 'Mr. Arvind Kejriwal Murthy',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:14.000Z',
  },
  {
    id: 'log-05',
    recipientEmail: 'a.roy@schoolsmarthub.edu',
    recipientName: 'Ms. Ananya Roy',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:14.000Z',
  },
  {
    id: 'log-06',
    recipientEmail: 'p.narang@schoolsmarthub.edu',
    recipientName: 'Mr. Pradeep Narang',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:15.000Z',
  },
  {
    id: 'log-07',
    recipientEmail: 'd.krishnan@schoolsmarthub.edu',
    recipientName: 'Mrs. Deepa Krishnan',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:15.000Z',
  },
  {
    id: 'log-08',
    recipientEmail: 's.gill@schoolsmarthub.edu',
    recipientName: 'Mr. Sandeep Gill',
    subject: '[URGENT] Pre-Board Examination Schedule & Invigilation Duties Finalized',
    messageType: 'announcement',
    status: 'sent',
    sentAt: '2026-10-05T08:31:16.000Z',
  },
];

// Helper to get from local storage or fallback to default
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// 1. Settings
export async function getSettings(): Promise<SchoolSettings> {
  return getStored<SchoolSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function updateSettings(settings: SchoolSettings): Promise<SchoolSettings> {
  setStored(STORAGE_KEYS.SETTINGS, settings);
  return settings;
}

// 2. Announcements
export async function getAnnouncements(isPrincipal: boolean = false): Promise<Announcement[]> {
  const all = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  if (isPrincipal) return all;
  return all.filter(a => a.published);
}

export async function saveAnnouncement(announcement: Announcement): Promise<Announcement> {
  const all = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  const index = all.findIndex(a => a.id === announcement.id);
  let updated: Announcement[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = announcement;
  } else {
    updated = [announcement, ...all];
  }
  setStored(STORAGE_KEYS.ANNOUNCEMENTS, updated);

  // If send email notification is true, simulate dispatch
  if (announcement.published && announcement.sendEmailNotification) {
    await dispatchNotificationEmail({
      title: announcement.title,
      message: announcement.message,
      type: 'announcement',
    });
  }

  return announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const all = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  setStored(STORAGE_KEYS.ANNOUNCEMENTS, all.filter(a => a.id !== id));
}

// 3. Circulars
export async function getCirculars(): Promise<Circular[]> {
  return getStored<Circular[]>(STORAGE_KEYS.CIRCULARS, INITIAL_CIRCULARS);
}

export async function saveCircular(circular: Circular): Promise<Circular> {
  const all = getStored<Circular[]>(STORAGE_KEYS.CIRCULARS, INITIAL_CIRCULARS);
  const index = all.findIndex(c => c.id === circular.id);
  let updated: Circular[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = circular;
  } else {
    updated = [circular, ...all];
  }
  setStored(STORAGE_KEYS.CIRCULARS, updated);
  return circular;
}

export async function deleteCircular(id: string): Promise<void> {
  const all = getStored<Circular[]>(STORAGE_KEYS.CIRCULARS, INITIAL_CIRCULARS);
  setStored(STORAGE_KEYS.CIRCULARS, all.filter(c => c.id !== id));
}

// 4. Events
export async function getEvents(): Promise<SchoolEvent[]> {
  const evts = getStored<SchoolEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  // Sort events chronologically
  return evts.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
}

export async function saveEvent(event: SchoolEvent): Promise<SchoolEvent> {
  const all = getStored<SchoolEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  const index = all.findIndex(e => e.id === event.id);
  let updated: SchoolEvent[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = event;
  } else {
    updated = [event, ...all];
  }
  setStored(STORAGE_KEYS.EVENTS, updated);
  return event;
}

export async function deleteEvent(id: string): Promise<void> {
  const all = getStored<SchoolEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  setStored(STORAGE_KEYS.EVENTS, all.filter(e => e.id !== id));
}

// 5. Timetable
export async function getTimetable(): Promise<TimetableEntry[]> {
  return getStored<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
}

export async function saveTimetableEntry(entry: TimetableEntry): Promise<TimetableEntry> {
  const all = getStored<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  const index = all.findIndex(t => t.id === entry.id);
  let updated: TimetableEntry[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = entry;
  } else {
    updated = [...all, entry];
  }
  setStored(STORAGE_KEYS.TIMETABLE, updated);
  return entry;
}

export async function deleteTimetableEntry(id: string): Promise<void> {
  const all = getStored<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  setStored(STORAGE_KEYS.TIMETABLE, all.filter(t => t.id !== id));
}

// 6. Teachers
export async function getTeachers(): Promise<Teacher[]> {
  return getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
}

export async function saveTeacher(teacher: Teacher): Promise<Teacher> {
  const all = getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  const index = all.findIndex(t => t.id === teacher.id);
  let updated: Teacher[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = teacher;
  } else {
    updated = [...all, teacher];
  }
  setStored(STORAGE_KEYS.TEACHERS, updated);
  return teacher;
}

export async function deleteTeacher(id: string): Promise<void> {
  const all = getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  setStored(STORAGE_KEYS.TEACHERS, all.filter(t => t.id !== id));
}

export async function toggleTeacherStatus(id: string): Promise<Teacher | null> {
  const all = getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  const teacher = all.find(t => t.id === id);
  if (!teacher) return null;
  teacher.active = !teacher.active;
  setStored(STORAGE_KEYS.TEACHERS, all);
  return teacher;
}

// 7. Email Logs
export async function getEmailLogs(): Promise<EmailLog[]> {
  const logs = getStored<EmailLog[]>(STORAGE_KEYS.EMAIL_LOGS, INITIAL_EMAIL_LOGS);
  return logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

export async function addEmailLog(log: Omit<EmailLog, 'id' | 'sentAt'>): Promise<EmailLog> {
  const logs = await getEmailLogs();
  const newLog: EmailLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString(),
  };
  setStored(STORAGE_KEYS.EMAIL_LOGS, [newLog, ...logs]);
  return newLog;
}

export async function clearEmailLogs(): Promise<void> {
  setStored(STORAGE_KEYS.EMAIL_LOGS, []);
}

// 8. Simulated Email Dispatch Service
export async function dispatchNotificationEmail(payload: {
  title: string;
  message: string;
  type: 'announcement' | 'circular' | 'event' | 'direct';
  recipients?: string[];
}): Promise<{ success: boolean; deliveredCount: number; failedCount: number }> {
  const teachers = await getTeachers();
  const targetTeachers = payload.recipients && payload.recipients.length > 0
    ? teachers.filter(t => payload.recipients!.includes(t.email))
    : teachers.filter(t => t.active !== false);

  const existingLogs = await getEmailLogs();
  const newLogs: EmailLog[] = [];
  let delivered = 0;
  let failed = 0;

  for (const teacher of targetTeachers) {
    // 98% simulated success rate
    const isSuccess = Math.random() < 0.98;
    if (isSuccess) delivered++;
    else failed++;

    newLogs.push({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipientEmail: teacher.email,
      recipientName: teacher.name,
      subject: `[${payload.type.toUpperCase()}] ${payload.title}`,
      messageType: payload.type,
      status: isSuccess ? 'sent' : 'failed',
      sentAt: new Date().toISOString(),
      errorMessage: isSuccess ? undefined : 'SMTP relay timeout / recipient mailbox full',
    });
  }

  setStored(STORAGE_KEYS.EMAIL_LOGS, [...newLogs, ...existingLogs]);
  return { success: true, deliveredCount: delivered, failedCount: failed };
}

// 9. Reset Demo Data
export async function resetToSampleData(): Promise<void> {
  setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  setStored(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  setStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  setStored(STORAGE_KEYS.CIRCULARS, INITIAL_CIRCULARS);
  setStored(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  setStored(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  setStored(STORAGE_KEYS.EMAIL_LOGS, INITIAL_EMAIL_LOGS);
}
