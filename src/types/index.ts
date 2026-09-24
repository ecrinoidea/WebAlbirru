export type UserRole = 'admin' | 'tentor';

export interface AuthUser {
  role: UserRole;
  username: string;
  tentorId?: string;
  displayName: string;
}

export type AdminTabType = 'groups' | 'schedule' | 'verification' | 'finance' | 'tentors';

export type SessionTimeSlot = 'sesi-1' | 'sesi-2' | 'sesi-3';

export interface SessionConfig {
  id: SessionTimeSlot;
  name: string;
  timeRange: string;
}

export const SESSION_CONFIGS: SessionConfig[] = [
  { id: 'sesi-1', name: 'Sesi 1', timeRange: '14.00 - 15.30' },
  { id: 'sesi-2', name: 'Sesi 2', timeRange: '15.45 - 17.15' },
  { id: 'sesi-3', name: 'Sesi 3', timeRange: '18.30 - 20.00' },
];

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
  score?: string;
}

export interface Student {
  id: string;
  name: string;
  schoolGrade: string; // e.g. "Kelas 4 SD", "Kelas 5 SD"
  parentName: string;
  parentPhone: string;
  joinedDate: string;
  avatarSeed: string;
}

export interface StudyGroup {
  id: string;
  name: string; // e.g. "Kelompok Einstein", "Kelompok Al-Khawarizmi"
  gradeLevel: string; // e.g. "SD Kelas 4-5"
  tentorId: string;
  tentorName: string;
  maxCapacity: number; // Always 6
  students: Student[];
  scheduleDay: DayOfWeek;
  sessionSlot: SessionTimeSlot;
  room: string; // e.g. "Ruang Jupiter", "Ruang Mars"
  curriculumProgress: number; // 0 - 100%
  completedTopicsCount: number;
  totalTopicsCount: number;
  currentSubject: string;
}

export type TentorAvailabilityStatus = 'ready' | 'teaching' | 'off';

export interface TentorAvailability {
  tentorId: string;
  tentorName: string;
  day: DayOfWeek;
  sessionSlot: SessionTimeSlot;
  status: TentorAvailabilityStatus;
  assignedGroupId?: string;
  assignedGroupName?: string;
  room?: string;
}

export interface TentorProfile {
  id: string;
  username: string; // usn
  password: string; // pw
  name: string;
  title: string; // e.g. "S.Pd. - Matematika & Sains"
  phone: string;
  email: string;
  avatarSeed: string;
  subjects: string[];
  ratePerSession: number; // e.g. 70000
  bankName?: string;
  accountNumber?: string;
  createdAt?: string;
}

export type VerificationStatus = 'Menunggu Verifikasi' | 'Disetujui' | 'Perlu Revisi';

export interface TeachingReport {
  id: string;
  tentorId: string;
  tentorName: string;
  groupId: string;
  groupName: string;
  date: string; // "2026-09-24"
  sessionSlot: SessionTimeSlot;
  subject: string;
  topicChapter: string;
  attendance: StudentAttendance[];
  classPhotoUrl: string;
  photoCaption?: string;
  generalNotes: string;
  submittedAt: string;
  status: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  revisionNote?: string;
  sessionFee: number;
}

export type PaymentStatus = 'Lunas' | 'QRIS Terbayar' | 'Menunggu Verifikasi' | 'Belum Bayar';

export interface SppInvoice {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  month: string; // "September 2026"
  amount: number; // 350000
  status: PaymentStatus;
  paymentMethod?: 'QRIS' | 'Transfer Bank' | 'Tunai';
  paidAt?: string;
  invoiceNumber: string;
}

export interface TentorHonorSummary {
  tentorId: string;
  tentorName: string;
  accountNumber: string;
  bankName: string;
  verifiedSessionsCount: number;
  pendingSessionsCount: number;
  ratePerSession: number;
  totalReadyToTransfer: number;
  transferStatus: 'Siap Ditransfer' | 'Sudah Ditransfer' | 'Sebagian';
  lastTransferDate?: string;
}
