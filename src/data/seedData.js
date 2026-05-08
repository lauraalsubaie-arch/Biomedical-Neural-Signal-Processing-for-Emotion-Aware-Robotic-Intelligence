export const seedDoctors = [
  { id: "D-001", name: "Dr. Hoda Elsayed", email: "hoda@calmy.health", password: "doctor123", role: "Doctor", specialization: "Neurology", license: "SCFHS-N-22018", phone: "+966 55 111 2233", bio: "Neurologist focused on sleep-linked neural signal changes and wearable EEG review.", avatar: "HE", rating: 4.9, availability: ["2026-05-06T10:00", "2026-05-07T13:30", "2026-05-09T09:30"] },
  { id: "D-002", name: "Dr. Mohammed Bahloul", email: "mohammed@calmy.health", password: "doctor123", role: "Doctor", specialization: "Sleep Medicine", license: "SCFHS-S-18091", phone: "+966 55 222 3344", bio: "Sleep medicine consultant specializing in REM-related disorders and clinical sleep pattern review.", avatar: "MB", rating: 4.8, availability: ["2026-05-06T14:00", "2026-05-08T11:00", "2026-05-10T16:30"] },
  { id: "D-003", name: "Dr. Lina Saleh", email: "lina@calmy.health", password: "doctor123", role: "Doctor", specialization: "Cardiology", license: "SCFHS-C-19272", phone: "+966 55 333 4455", bio: "Cardiologist reviewing PPG, heart-rate variability, and stress-related cardiac response.", avatar: "LS", rating: 4.7, availability: ["2026-05-06T12:00", "2026-05-08T15:00", "2026-05-11T10:00"] }
];

export const seedPatients = [
  { id: "P-0451", name: "Ali Al-Sabah", email: "ali@calmy.health", password: "patient123", role: "Patient", age: 38, dob: "1988-03-12", gender: "Male", maritalStatus: "Married", phone: "+966 50 111 2222", emergencyContact: "Noura Al-Sabah · +966 50 999 3333", address: "Riyadh, Saudi Arabia", bio: "Tracking sleep paralysis episodes and stress patterns.", bloodType: "O+", allergies: "None reported", medications: "Magnesium supplement", doctorId: "D-002", risk: "High", eegAvg: 5200, ppgAvg: 2100, heartRate: 82, sleepScore: 71, consentSigned: true, avatar: "AS" },
  { id: "P-0332", name: "Sara Mansour", email: "sara@calmy.health", password: "patient123", role: "Patient", age: 25, dob: "2001-11-02", gender: "Female", maritalStatus: "Single", phone: "+966 50 222 3333", emergencyContact: "Maha Mansour · +966 50 888 2222", address: "Jeddah, Saudi Arabia", bio: "Monitoring anxiety-related sleep disruption.", bloodType: "A+", allergies: "Penicillin", medications: "None", doctorId: "D-002", risk: "Moderate", eegAvg: 3800, ppgAvg: 1900, heartRate: 76, sleepScore: 82, consentSigned: true, avatar: "SM" },
  { id: "P-0219", name: "Khalid Rahman", email: "khalid@calmy.health", password: "patient123", role: "Patient", age: 44, dob: "1982-09-16", gender: "Male", maritalStatus: "Married", phone: "+966 50 333 4444", emergencyContact: "Hanan Rahman · +966 50 777 1111", address: "Dammam, Saudi Arabia", bio: "Stable long-term monitoring.", bloodType: "B+", allergies: "Dust", medications: "Vitamin D", doctorId: "D-001", risk: "Stable", eegAvg: 2900, ppgAvg: 1650, heartRate: 68, sleepScore: 90, consentSigned: true, avatar: "KR" }
];

export const seedSessions = [
  { id: "S-1001", patientId: "P-0451", date: "2026-05-04", startTime: "01:20", duration: "7h 12m", eeg: 5200, ppg: 2100, heartRate: 82, sleepScore: 71, risk: "High", quality: "Good", sensorStatus: "Synced", notes: "Elevated theta activity during REM-like transition." },
  { id: "S-1002", patientId: "P-0451", date: "2026-05-03", startTime: "00:48", duration: "6h 40m", eeg: 4100, ppg: 1900, heartRate: 78, sleepScore: 78, risk: "Moderate", quality: "Good", sensorStatus: "Synced", notes: "PPG variability increased before wake-up." },
  { id: "S-1003", patientId: "P-0332", date: "2026-05-04", startTime: "23:15", duration: "8h 01m", eeg: 3000, ppg: 1700, heartRate: 69, sleepScore: 88, risk: "Stable", quality: "Excellent", sensorStatus: "Synced", notes: "Stable overnight readings." },
  { id: "S-1004", patientId: "P-0332", date: "2026-05-02", startTime: "23:59", duration: "7h 34m", eeg: 3900, ppg: 1880, heartRate: 75, sleepScore: 80, risk: "Moderate", quality: "Fair", sensorStatus: "Minor packet loss", notes: "Moderate EEG activation during early sleep." },
  { id: "S-1005", patientId: "P-0219", date: "2026-05-04", startTime: "22:51", duration: "7h 49m", eeg: 2850, ppg: 1600, heartRate: 67, sleepScore: 91, risk: "Stable", quality: "Excellent", sensorStatus: "Synced", notes: "No anomalies detected." }
];

export const seedMessages = [
  { id: "M-1", threadId: "T-P0451-D002", fromId: "D-002", toId: "P-0451", createdAt: "2026-05-04T10:12:00", read: false, text: "I reviewed your latest overnight session. Please avoid caffeine tonight and keep the sensor connected before sleep." },
  { id: "M-2", threadId: "T-P0451-D002", fromId: "P-0451", toId: "D-002", createdAt: "2026-05-04T10:18:00", read: true, text: "Thank you doctor. I had one episode around 2 AM." },
  { id: "M-3", threadId: "T-P0332-D002", fromId: "P-0332", toId: "D-002", createdAt: "2026-05-03T17:00:00", read: false, text: "Can you check if my PPG pattern looks better this week?" }
];

export const seedAppointments = [
  { id: "A-1", patientId: "P-0451", doctorId: "D-002", dateTime: "2026-05-06T14:00", type: "Video Visit", reason: "Discuss high-risk overnight readings", status: "Confirmed", checkInComplete: false },
  { id: "A-2", patientId: "P-0332", doctorId: "D-002", dateTime: "2026-05-08T11:00", type: "Follow-up", reason: "Review moderate variability", status: "Pending", checkInComplete: false }
];

export const seedReports = [
  { id: "R-1", patientId: "P-0451", doctorId: "D-002", updatedAt: "2026-05-04T11:30:00", diagnosis: "Non-diagnostic monitoring summary: elevated sleep-paralysis risk markers detected.", summary: "Recent EEG and PPG fusion indicates increased physiological arousal during REM-like transition windows. This report is for monitoring and research support, not diagnosis.", recommendations: ["Repeat overnight EEG/PPG session for 3 nights.", "Avoid caffeine 6 hours before sleep.", "Schedule a follow-up if high-risk readings persist."], restrictions: "No clinical restrictions. Use device only as instructed.", doctorSignature: "Dr. Mohammed Bahloul" },
  { id: "R-2", patientId: "P-0332", doctorId: "D-002", updatedAt: "2026-05-03T13:20:00", diagnosis: "Moderate concern pattern under review.", summary: "PPG variability improved compared with previous week. EEG remains within moderate monitoring range.", recommendations: ["Continue sleep hygiene plan.", "Track stress survey nightly.", "Follow up next week."], restrictions: "None", doctorSignature: "Dr. Mohammed Bahloul" }
];

export const seedNotifications = [
  { id: "N-1", userId: "P-0451", type: "alert", title: "High-risk session detected", body: "Session S-1001 has elevated EEG and PPG markers.", createdAt: "2026-05-04T02:15:00", read: false, priority: "High" },
  { id: "N-2", userId: "P-0451", type: "appointment", title: "Appointment confirmed", body: "Your video visit with Dr. Mohammed is confirmed for May 6.", createdAt: "2026-05-04T08:00:00", read: false, priority: "Normal" },
  { id: "N-3", userId: "D-002", type: "message", title: "New patient message", body: "Sara Mansour sent a new message.", createdAt: "2026-05-03T17:00:00", read: false, priority: "Normal" },
  { id: "N-4", userId: "D-002", type: "alert", title: "Ali Al-Sabah needs review", body: "High-risk EEG/PPG fusion result is waiting for report update.", createdAt: "2026-05-04T03:02:00", read: false, priority: "High" }
];
