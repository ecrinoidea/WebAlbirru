-- Albirru Junior - schema TiDB Cloud
-- Jalankan pada database yang dipilih di TIDB_DATABASE.
-- TiDB kompatibel dengan sintaks MySQL di bawah ini.

CREATE TABLE IF NOT EXISTS app_state (
  state_key VARCHAR(64) PRIMARY KEY,
  state_json JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tentors (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(200) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(150) NOT NULL,
  avatar_seed VARCHAR(100) NOT NULL,
  subjects JSON NOT NULL,
  rate_per_session DECIMAL(12,2) NOT NULL DEFAULT 70000,
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tentors_name (name)
);

CREATE TABLE IF NOT EXISTS study_groups (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  grade_level VARCHAR(100) NOT NULL,
  tentor_id VARCHAR(64) NOT NULL,
  tentor_name VARCHAR(150) NOT NULL,
  max_capacity TINYINT UNSIGNED NOT NULL DEFAULT 6,
  schedule_day VARCHAR(20) NOT NULL,
  session_slot VARCHAR(20) NOT NULL,
  room VARCHAR(150) NOT NULL,
  curriculum_progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
  completed_topics_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total_topics_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  current_subject VARCHAR(150) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_groups_tentor FOREIGN KEY (tentor_id) REFERENCES tentors(id),
  INDEX idx_groups_tentor (tentor_id),
  INDEX idx_groups_schedule (schedule_day, session_slot)
);

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(64) PRIMARY KEY,
  group_id VARCHAR(64) NOT NULL,
  name VARCHAR(150) NOT NULL,
  school_grade VARCHAR(150) NOT NULL,
  parent_name VARCHAR(150) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  joined_date DATE NOT NULL,
  avatar_seed VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_group FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  INDEX idx_students_group (group_id),
  INDEX idx_students_name (name)
);

CREATE TABLE IF NOT EXISTS tentor_availabilities (
  tentor_id VARCHAR(64) NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  session_slot VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  assigned_group_id VARCHAR(64),
  assigned_group_name VARCHAR(150),
  room VARCHAR(150),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (tentor_id, day_of_week, session_slot),
  CONSTRAINT fk_availability_tentor FOREIGN KEY (tentor_id) REFERENCES tentors(id) ON DELETE CASCADE,
  CONSTRAINT fk_availability_group FOREIGN KEY (assigned_group_id) REFERENCES study_groups(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS teaching_reports (
  id VARCHAR(64) PRIMARY KEY,
  tentor_id VARCHAR(64) NOT NULL,
  group_id VARCHAR(64) NOT NULL,
  report_date DATE NOT NULL,
  session_slot VARCHAR(20) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  topic_chapter VARCHAR(255) NOT NULL,
  class_photo_url VARCHAR(1000) NOT NULL,
  photo_caption VARCHAR(500),
  general_notes TEXT NOT NULL,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) NOT NULL DEFAULT 'Menunggu Verifikasi',
  reviewed_by VARCHAR(150),
  reviewed_at DATETIME,
  revision_note VARCHAR(1000),
  session_fee DECIMAL(12,2) NOT NULL DEFAULT 70000,
  CONSTRAINT fk_reports_tentor FOREIGN KEY (tentor_id) REFERENCES tentors(id),
  CONSTRAINT fk_reports_group FOREIGN KEY (group_id) REFERENCES study_groups(id),
  INDEX idx_reports_status (status),
  INDEX idx_reports_tentor_date (tentor_id, report_date),
  INDEX idx_reports_group_date (group_id, report_date)
);

CREATE TABLE IF NOT EXISTS report_attendance (
  report_id VARCHAR(64) NOT NULL,
  student_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  attendance_status VARCHAR(20) NOT NULL,
  note VARCHAR(1000),
  score VARCHAR(50),
  PRIMARY KEY (report_id, student_id),
  CONSTRAINT fk_attendance_report FOREIGN KEY (report_id) REFERENCES teaching_reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id),
  INDEX idx_attendance_student (student_id)
);

CREATE TABLE IF NOT EXISTS spp_invoices (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  group_id VARCHAR(64) NOT NULL,
  month_label VARCHAR(30) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Belum Bayar',
  payment_method VARCHAR(30),
  paid_at DATETIME,
  invoice_number VARCHAR(64) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoices_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_invoices_group FOREIGN KEY (group_id) REFERENCES study_groups(id),
  INDEX idx_invoices_status (status),
  INDEX idx_invoices_student_month (student_id, month_label)
);

CREATE TABLE IF NOT EXISTS tentor_honor_summaries (
  tentor_id VARCHAR(64) PRIMARY KEY,
  verified_sessions_count INT UNSIGNED NOT NULL DEFAULT 0,
  pending_sessions_count INT UNSIGNED NOT NULL DEFAULT 0,
  rate_per_session DECIMAL(12,2) NOT NULL DEFAULT 70000,
  total_ready_to_transfer DECIMAL(12,2) NOT NULL DEFAULT 0,
  transfer_status VARCHAR(30) NOT NULL DEFAULT 'Siap Ditransfer',
  last_transfer_date DATE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_honor_tentor FOREIGN KEY (tentor_id) REFERENCES tentors(id) ON DELETE CASCADE
);

-- Seed state kosong agar endpoint JSON lama langsung dapat dipakai.
INSERT INTO app_state (state_key, state_json)
VALUES ('albirru', JSON_OBJECT())
ON DUPLICATE KEY UPDATE state_key = state_key;

-- Verifikasi tabel setelah migrasi:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = DATABASE() AND table_name IN
-- ('app_state','tentors','study_groups','students','tentor_availabilities',
--  'teaching_reports','report_attendance','spp_invoices','tentor_honor_summaries');
