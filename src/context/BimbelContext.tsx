import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  AuthUser,
  AdminTabType,
  StudyGroup,
  TentorProfile,
  TentorAvailability,
  TeachingReport,
  SppInvoice,
  TentorHonorSummary,
  DayOfWeek,
  SessionTimeSlot,
  TentorAvailabilityStatus,
  Student,
} from '../types';
import {
  INITIAL_GROUPS,
  INITIAL_TENTORS,
  INITIAL_AVAILABILITIES,
  INITIAL_REPORTS,
  INITIAL_INVOICES,
  INITIAL_HONOR_SUMMARIES,
} from '../data/initialData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface NewTentorInput {
  name: string;
  username: string;
  password: string;
  title: string;
  phone: string;
  email: string;
  subjects: string[];
  ratePerSession: number;
  bankName?: string;
  accountNumber?: string;
}

interface BimbelContextType {
  // Auth
  currentUser: AuthUser | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (username: string, password: string, requestedRole?: UserRole) => { success: boolean; message: string };
  logout: () => void;

  selectedTentorId: string;
  setSelectedTentorId: (id: string) => void;
  currentTentor: TentorProfile;
  tentors: TentorProfile[];
  groups: StudyGroup[];
  availabilities: TentorAvailability[];
  reports: TeachingReport[];
  invoices: SppInvoice[];
  honorSummaries: TentorHonorSummary[];
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  activeAdminTab: AdminTabType;
  setActiveAdminTab: (tab: AdminTabType) => void;
  activeTentorTab: 'schedule' | 'input-report' | 'my-groups' | 'honor';
  setActiveTentorTab: (tab: 'schedule' | 'input-report' | 'my-groups' | 'honor') => void;
  
  // Handlers
  addStudentToGroup: (groupId: string, studentData: Omit<Student, 'id' | 'joinedDate'>) => boolean;
  removeStudentFromGroup: (groupId: string, studentId: string) => void;
  toggleTentorAvailability: (tentorId: string, day: DayOfWeek, sessionSlot: SessionTimeSlot, nextStatus?: TentorAvailabilityStatus) => void;
  approveReport: (reportId: string) => void;
  requestReportRevision: (reportId: string, note: string) => void;
  submitTeachingReport: (reportData: Omit<TeachingReport, 'id' | 'submittedAt' | 'status'>) => string;
  verifyInvoicePayment: (invoiceId: string) => void;
  processHonorTransfer: (tentorId: string) => void;

  // Tentor Account Management (Admin feature)
  registerTentorAccount: (data: NewTentorInput) => { success: boolean; message: string };
  updateTentorCredentials: (tentorId: string, updates: Partial<TentorProfile>) => { success: boolean; message: string };
  deleteTentorAccount: (tentorId: string) => { success: boolean; message: string };
  
  // Active photo modal
  photoModal: { url: string; caption?: string; title?: string } | null;
  openPhotoModal: (url: string, caption?: string, title?: string) => void;
  closePhotoModal: () => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: () => void;
}

const BimbelContext = createContext<BimbelContextType | undefined>(undefined);

export const BimbelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('albirru_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    if (currentUser) return currentUser.role;
    return 'admin';
  });

  const [selectedTentorId, setSelectedTentorId] = useState<string>(() => {
    if (currentUser?.role === 'tentor' && currentUser.tentorId) {
      return currentUser.tentorId;
    }
    return 'tentor-1';
  });

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTabType>('groups');
  const [activeTentorTab, setActiveTentorTab] = useState<'schedule' | 'input-report' | 'my-groups' | 'honor'>('schedule');

  // Load tentors from localStorage or defaults
  const [tentors, setTentors] = useState<TentorProfile[]>(() => {
    const saved = localStorage.getItem('albirru_tentors');
    if (saved) {
      try {
        const parsed: TentorProfile[] = JSON.parse(saved);
        return parsed.map((item) => {
          const found = INITIAL_TENTORS.find((t) => t.id === item.id);
          return {
            ...item,
            username: item.username || found?.username || item.id.replace('-', ''),
            password: item.password || found?.password || 'tentor123',
          };
        });
      } catch {
        return INITIAL_TENTORS;
      }
    }
    return INITIAL_TENTORS;
  });

  // Load other collections from localStorage or defaults
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('albirru_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [availabilities, setAvailabilities] = useState<TentorAvailability[]>(() => {
    const saved = localStorage.getItem('albirru_availabilities');
    return saved ? JSON.parse(saved) : INITIAL_AVAILABILITIES;
  });

  const [reports, setReports] = useState<TeachingReport[]>(() => {
    const saved = localStorage.getItem('albirru_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [invoices, setInvoices] = useState<SppInvoice[]>(() => {
    const saved = localStorage.getItem('albirru_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [honorSummaries, setHonorSummaries] = useState<TentorHonorSummary[]>(() => {
    const saved = localStorage.getItem('albirru_honors');
    return saved ? JSON.parse(saved) : INITIAL_HONOR_SUMMARIES;
  });

  // Modal & Toast
  const [photoModal, setPhotoModal] = useState<{ url: string; caption?: string; title?: string } | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync states to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('albirru_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('albirru_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('albirru_tentors', JSON.stringify(tentors));
  }, [tentors]);

  useEffect(() => {
    localStorage.setItem('albirru_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('albirru_availabilities', JSON.stringify(availabilities));
  }, [availabilities]);

  useEffect(() => {
    localStorage.setItem('albirru_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('albirru_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('albirru_honors', JSON.stringify(honorSummaries));
  }, [honorSummaries]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  const openPhotoModal = (url: string, caption?: string, title?: string) => {
    setPhotoModal({ url, caption, title });
  };

  const closePhotoModal = () => {
    setPhotoModal(null);
  };

  const currentTentor = tentors.find((t) => t.id === selectedTentorId) || tentors[0] || {
    id: 'tentor-default',
    username: 'tentor',
    password: 'password',
    name: 'Tentor Albirru',
    title: 'Pengajar Bimbel',
    phone: '-',
    email: '-',
    avatarSeed: 'tentor',
    subjects: ['Umum'],
    ratePerSession: 70000,
  };

  // Auth: Login & Logout
  const login = (usernameInput: string, passwordInput: string, requestedRole?: UserRole) => {
    const trimmedUsername = usernameInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!trimmedUsername || !cleanPassword) {
      return { success: false, message: 'Username dan kata sandi wajib diisi!' };
    }

    // 1. Check Admin
    if (
      (!requestedRole || requestedRole === 'admin') &&
      trimmedUsername.toLowerCase() === 'admin'
    ) {
      if (cleanPassword === 'admin123') {
        const user: AuthUser = {
          role: 'admin',
          username: 'admin',
          displayName: 'Administrator Albirru',
        };
        setCurrentUser(user);
        setRole('admin');
        showToast('Selamat datang kembali, Administrator Bimbel Albirru!', 'success');
        return { success: true, message: 'Login berhasil sebagai Admin' };
      } else {
        return { success: false, message: 'Kata sandi akun Admin tidak sesuai!' };
      }
    }

    // 2. Check Tentor
    const foundTentor = tentors.find(
      (t) => t.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (foundTentor) {
      if (foundTentor.password === cleanPassword) {
        const user: AuthUser = {
          role: 'tentor',
          username: foundTentor.username,
          tentorId: foundTentor.id,
          displayName: foundTentor.name,
        };
        setCurrentUser(user);
        setRole('tentor');
        setSelectedTentorId(foundTentor.id);
        showToast(`Selamat mengajar, ${foundTentor.name}!`, 'success');
        return { success: true, message: `Login berhasil sebagai ${foundTentor.name}` };
      } else {
        return { success: false, message: 'Kata sandi untuk akun tentor ini keliru!' };
      }
    }

    // If role requested was admin but username wasn't admin
    if (requestedRole === 'admin') {
      return { success: false, message: 'Akun admin dengan username tersebut tidak ditemukan!' };
    }

    return { success: false, message: 'Username atau kata sandi tidak terdaftar di sistem Bimbel Albirru.' };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda berhasil keluar dari sistem.', 'info');
  };

  // Admin Feature: Register New Tentor Account
  const registerTentorAccount = (data: NewTentorInput) => {
    const trimmedUsername = data.username.trim().toLowerCase();

    // Validations
    if (!trimmedUsername) {
      return { success: false, message: 'Username wajib diisi!' };
    }
    if (!data.password.trim()) {
      return { success: false, message: 'Password wajib diisi!' };
    }
    if (data.password.trim().length < 4) {
      return { success: false, message: 'Password minimal 4 karakter!' };
    }
    if (trimmedUsername === 'admin') {
      return { success: false, message: 'Username "admin" tidak dapat digunakan untuk tentor!' };
    }
    const exists = tentors.some((t) => t.username.toLowerCase() === trimmedUsername);
    if (exists) {
      return { success: false, message: `Username "${trimmedUsername}" sudah terdaftar! Pilih username lain.` };
    }

    const newId = `tentor-${Date.now()}`;
    const newTentor: TentorProfile = {
      id: newId,
      username: trimmedUsername,
      password: data.password.trim(),
      name: data.name.trim(),
      title: data.title.trim() || 'Tentor Albirru Junior',
      phone: data.phone.trim(),
      email: data.email.trim() || `${trimmedUsername}@albirru.sch.id`,
      avatarSeed: trimmedUsername,
      subjects: data.subjects.length > 0 ? data.subjects : ['Umum'],
      ratePerSession: Number(data.ratePerSession) || 70000,
      bankName: data.bankName?.trim() || 'Bank Central Asia (BCA)',
      accountNumber: data.accountNumber?.trim() || '-',
      createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    };

    setTentors((prev) => [...prev, newTentor]);

    // Create Initial Honor Summary
    const newHonorSummary: TentorHonorSummary = {
      tentorId: newId,
      tentorName: newTentor.name,
      bankName: newTentor.bankName || 'Bank Central Asia',
      accountNumber: newTentor.accountNumber || '-',
      verifiedSessionsCount: 0,
      pendingSessionsCount: 0,
      ratePerSession: newTentor.ratePerSession,
      totalReadyToTransfer: 0,
      transferStatus: 'Siap Ditransfer',
    };
    setHonorSummaries((prev) => [...prev, newHonorSummary]);

    // Create default ready availability slots for common days
    const defaultDays: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const newAvails: TentorAvailability[] = [];
    defaultDays.forEach((day) => {
      const slots: SessionTimeSlot[] = ['sesi-1', 'sesi-2', 'sesi-3'];
      slots.forEach((sessionSlot) => {
        newAvails.push({
          tentorId: newId,
          tentorName: newTentor.name,
          day,
          sessionSlot,
          status: 'ready',
        });
      });
    });
    setAvailabilities((prev) => [...prev, ...newAvails]);

    showToast(`Akun Tentor "${newTentor.name}" dengan username "${newTentor.username}" berhasil didaftarkan!`, 'success');
    return { success: true, message: 'Akun tentor berhasil dibuat' };
  };

  const updateTentorCredentials = (tentorId: string, updates: Partial<TentorProfile>) => {
    setTentors((prev) =>
      prev.map((t) => {
        if (t.id === tentorId) {
          const updated = { ...t, ...updates };
          return updated;
        }
        return t;
      })
    );

    // If name or rate updated, update in honor summary too
    if (updates.name || updates.ratePerSession || updates.bankName || updates.accountNumber) {
      setHonorSummaries((prev) =>
        prev.map((h) => {
          if (h.tentorId === tentorId) {
            return {
              ...h,
              tentorName: updates.name || h.tentorName,
              bankName: updates.bankName || h.bankName,
              accountNumber: updates.accountNumber || h.accountNumber,
              ratePerSession: updates.ratePerSession ?? h.ratePerSession,
            };
          }
          return h;
        })
      );
    }

    showToast('Data kredensial dan profil tentor berhasil diperbarui.', 'success');
    return { success: true, message: 'Tentor diperbarui' };
  };

  const deleteTentorAccount = (tentorId: string) => {
    // Check if tentor has assigned groups
    const assigned = groups.find((g) => g.tentorId === tentorId);
    if (assigned) {
      showToast(`Tidak dapat menghapus tentor karena masih mengampu kelompok "${assigned.name}". Pindahkan kelompok terlebih dahulu.`, 'warning');
      return { success: false, message: 'Tentor masih memiliki kelompok asuhan.' };
    }

    setTentors((prev) => prev.filter((t) => t.id !== tentorId));
    setAvailabilities((prev) => prev.filter((a) => a.tentorId !== tentorId));
    setHonorSummaries((prev) => prev.filter((h) => h.tentorId !== tentorId));

    showToast('Akun tentor berhasil dihapus dari sistem.', 'info');
    return { success: true, message: 'Akun tentor dihapus.' };
  };

  // Student and Group Actions
  const addStudentToGroup = (groupId: string, studentData: Omit<Student, 'id' | 'joinedDate'>): boolean => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return false;

    if (targetGroup.students.length >= targetGroup.maxCapacity) {
      showToast(`Kelompok ${targetGroup.name} sudah penuh (maksimal 6 siswa)!`, 'warning');
      return false;
    }

    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      joinedDate: '24 September 2026',
    };

    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, students: [...g.students, newStudent] } : g))
    );

    const newInvoice: SppInvoice = {
      id: `inv-${Date.now()}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      month: 'September 2026',
      amount: 350000,
      status: 'Menunggu Verifikasi',
      invoiceNumber: `INV-ALB-${Date.now().toString().slice(-6)}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    showToast(`Siswa "${newStudent.name}" berhasil didaftarkan ke ${targetGroup.name}!`, 'success');
    return true;
  };

  const removeStudentFromGroup = (groupId: string, studentId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, students: g.students.filter((s) => s.id !== studentId) }
          : g
      )
    );
    showToast('Data siswa berhasil diperbarui dari kelompok.', 'info');
  };

  const toggleTentorAvailability = (
    tentorId: string,
    day: DayOfWeek,
    sessionSlot: SessionTimeSlot,
    nextStatus?: TentorAvailabilityStatus
  ) => {
    setAvailabilities((prev) => {
      const existing = prev.find(
        (a) => a.tentorId === tentorId && a.day === day && a.sessionSlot === sessionSlot
      );

      let targetStatus: TentorAvailabilityStatus;
      if (nextStatus) {
        targetStatus = nextStatus;
      } else if (existing) {
        if (existing.status === 'ready') targetStatus = 'teaching';
        else if (existing.status === 'teaching') targetStatus = 'off';
        else targetStatus = 'ready';
      } else {
        targetStatus = 'ready';
      }

      if (existing) {
        return prev.map((item) =>
          item.tentorId === tentorId && item.day === day && item.sessionSlot === sessionSlot
            ? { ...item, status: targetStatus }
            : item
        );
      } else {
        const tentorObj = tentors.find((t) => t.id === tentorId);
        return [
          ...prev,
          {
            tentorId,
            tentorName: tentorObj?.name || 'Tentor',
            day,
            sessionSlot,
            status: targetStatus,
          },
        ];
      }
    });

    showToast('Status ketersediaan jadwal tentor diperbarui.', 'info');
  };

  const approveReport = (reportId: string) => {
    let approvedTentorId = '';
    let reportFee = 70000;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          approvedTentorId = r.tentorId;
          reportFee = r.sessionFee || 70000;
          return {
            ...r,
            status: 'Disetujui',
            reviewedBy: currentUser?.displayName || 'Admin Albirru (Pusat)',
            reviewedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            revisionNote: undefined,
          };
        }
        return r;
      })
    );

    if (approvedTentorId) {
      setHonorSummaries((prev) =>
        prev.map((h) => {
          if (h.tentorId === approvedTentorId) {
            const newCount = h.verifiedSessionsCount + 1;
            const newPending = Math.max(0, h.pendingSessionsCount - 1);
            return {
              ...h,
              verifiedSessionsCount: newCount,
              pendingSessionsCount: newPending,
              totalReadyToTransfer: h.totalReadyToTransfer + reportFee,
              transferStatus: 'Siap Ditransfer',
            };
          }
          return h;
        })
      );
    }

    showToast('Laporan mengajar disetujui & honor per sesi ditambahkan ke rekapitulasi.', 'success');
  };

  const requestReportRevision = (reportId: string, note: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'Perlu Revisi',
              revisionNote: note,
              reviewedBy: currentUser?.displayName || 'Admin Albirru (Pusat)',
              reviewedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            }
          : r
      )
    );
    showToast('Permintaan revisi berhasil dikirimkan ke tentor.', 'warning');
  };

  const submitTeachingReport = (
    reportData: Omit<TeachingReport, 'id' | 'submittedAt' | 'status'>
  ): string => {
    const reportId = `rep-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const submittedAt = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const newReport: TeachingReport = {
      ...reportData,
      id: reportId,
      submittedAt,
      status: 'Menunggu Verifikasi',
    };

    setReports((prev) => [newReport, ...prev]);

    setHonorSummaries((prev) =>
      prev.map((h) =>
        h.tentorId === reportData.tentorId
          ? { ...h, pendingSessionsCount: h.pendingSessionsCount + 1 }
          : h
      )
    );

    showToast('Laporan mengajar berhasil dikirim! Menunggu verifikasi admin.', 'success');
    return reportId;
  };

  const verifyInvoicePayment = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Lunas',
              paidAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
                new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
              paymentMethod: inv.paymentMethod || 'Transfer Bank',
            }
          : inv
      )
    );
    showToast('Pembayaran SPP berhasil diverifikasi & status diperbarui menjadi Lunas.', 'success');
  };

  const processHonorTransfer = (tentorId: string) => {
    setHonorSummaries((prev) =>
      prev.map((h) =>
        h.tentorId === tentorId
          ? {
              ...h,
              transferStatus: 'Sudah Ditransfer',
              lastTransferDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : h
      )
    );
    showToast('Transfer honorarium berhasil diproses & bukti transfer diterbitkan.', 'success');
  };

  return (
    <BimbelContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        login,
        logout,
        selectedTentorId,
        setSelectedTentorId,
        currentTentor,
        tentors,
        groups,
        availabilities,
        reports,
        invoices,
        honorSummaries,
        selectedDay,
        setSelectedDay,
        activeAdminTab,
        setActiveAdminTab,
        activeTentorTab,
        setActiveTentorTab,
        addStudentToGroup,
        removeStudentFromGroup,
        toggleTentorAvailability,
        approveReport,
        requestReportRevision,
        submitTeachingReport,
        verifyInvoicePayment,
        processHonorTransfer,
        registerTentorAccount,
        updateTentorCredentials,
        deleteTentorAccount,
        photoModal,
        openPhotoModal,
        closePhotoModal,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </BimbelContext.Provider>
  );
};

export const useBimbel = () => {
  const context = useContext(BimbelContext);
  if (!context) {
    throw new Error('useBimbel must be used within a BimbelProvider');
  }
  return context;
};
