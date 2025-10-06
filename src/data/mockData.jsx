const dashboardData = [
  { id: 1, title: "Overview", value: 120, description: "Total patients today" },
  { id: 2, title: "Appointments", value: 45, description: "Today's scheduled appointments" },
  { id: 3, title: "Revenue", value: 15000, description: "Revenue generated today" },
  { id: 4, title: "New Users", value: 30, description: "New patients registered" },
  { id: 5, title: "Feedback", value: 12, description: "New feedback received" }
];

const doctorsData = [
  { id: 1, name: "Dr. Smith", specialization: "Cardiology", patients: 120, available: true },
  { id: 2, name: "Dr. Johnson", specialization: "Neurology", patients: 80, available: false },
  { id: 3, name: "Dr. Lee", specialization: "Orthopedics", patients: 60, available: true },
  { id: 4, name: "Dr. Patel", specialization: "Pediatrics", patients: 95, available: true },
  { id: 5, name: "Dr. Kumar", specialization: "Dermatology", patients: 50, available: false }
];

const campsData = [
  { id: 1, name: "Health Camp A", location: "City Center", date: "2025-10-10", attendees: 200 },
  { id: 2, name: "Health Camp B", location: "West End", date: "2025-10-15", attendees: 150 },
  { id: 3, name: "Health Camp C", location: "East Side", date: "2025-10-20", attendees: 180 },
  { id: 4, name: "Health Camp D", location: "North Point", date: "2025-10-25", attendees: 220 },
  { id: 5, name: "Health Camp E", location: "South Park", date: "2025-10-30", attendees: 170 }
];

const usersData = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Patient", registered: "2025-09-01" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Patient", registered: "2025-09-05" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Patient", registered: "2025-09-10" },
  { id: 4, name: "David", email: "david@example.com", role: "Patient", registered: "2025-09-15" },
  { id: 5, name: "Eva", email: "eva@example.com", role: "Patient", registered: "2025-09-20" }
];

const reportsData = [
  { id: 1, title: "Monthly Revenue", type: "Finance", date: "2025-09-30", status: "Completed" },
  { id: 2, title: "Patient Growth", type: "Analytics", date: "2025-09-30", status: "Completed" },
  { id: 3, title: "Doctor Performance", type: "HR", date: "2025-09-30", status: "Pending" },
  { id: 4, title: "Camp Effectiveness", type: "Analytics", date: "2025-09-30", status: "Completed" },
  { id: 5, title: "Feedback Summary", type: "Patient", date: "2025-09-30", status: "Pending" }
];

export { dashboardData, doctorsData, campsData, usersData, reportsData };