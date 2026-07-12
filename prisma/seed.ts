import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" }) });
const ROUNDS = 12;

// ─── Data pools for maximum variation ──────────────────────────────

const firstNames = [
  "Priya", "Arjun", "Ishita", "Vikram", "Ananya", "Rohit", "Sneha", "Karan", "Divya", "Ravi",
  "Maya", "Aditya", "Zara", "Neha", "Amit", "Sarah", "Kabir", "Tara", "Rohan", "Kavya",
  "Dhruv", "Anika", "Virat", "Myra", "Aarav", "Sanya", "Vivaan", "Aadhya", "Ishaan", "Anvi",
  "Yash", "Navya", "Reyansh", "Sara", "Shaurya", "Anaya", "Kabir", "Kritika", "Aryan", "Riya",
  "Shaan", "Lavanya", "Rudra", "Aanya", "Om", "Muskaan", "Parth", "Kiara", "Raghav", "Tanya",
  "Maanav", "Aarohi", "Dhruv", "Hansika", "Ishaan", "Jiya", "Krish", "Navya", "Siddharth", "Dia",
  "Tushar", "Inaya", "Harsh", "Aarna", "Naman", "Anaya", "Ayush", "Rudra", "Laksh", "Sana",
  "Vedant", "Pari", "Arnav", "Anaira", "Chirag", "Sia", "Dhairya", "Aara", "Indra", "Anvi",
  "Kunal", "Sachi", "Mohit", "Gauri", "Pranav", "Isha", "Tanay", "Rashi", "Sahil", "Bhavna",
  "Prakash", "Nandini", "Deepak", "Rohini", "Kiran", "Deepali", "Nikhil", "Swati", "Akash", "Amrita",
];

const lastNames = [
  "Sharma", "Mehta", "Reddy", "Singh", "Gupta", "Joshi", "Kapoor", "Verma", "Nair", "Deshmukh",
  "Krishnan", "Patel", "Khan", "Rao", "Fernandes", "Iyer", "Shah", "Bose", "Choudhary", "D'Souza",
  "Acharya", "Bhat", "Chopra", "Dixit", "Gandhi", "Hegde", "Jain", "Kulkarni", "Lal", "Malhotra",
  "Nayak", "Oberoi", "Panicker", "Quadri", "Rajput", "Saxena", "Thakur", "Upadhyay", "Venkatesh", "Wagh",
  "Agarwal", "Bajaj", "Chatterjee", "Das", "Eswaran", "Ghosh", "Hasan", "Ingle", "Jadhav", "Kamath",
  "Lokhande", "Mishra", "Naidu", "Oak", "Pillai", "Qureshi", "Rathore", "Sethi", "Tiwari", "Uppal",
];

const universities = [
  "IIT Bombay", "IIT Delhi", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee", "IIT Madras", "IIT Gandhinagar",
  "Delhi University", "BITS Pilani", "NUS Singapore", "NTU Singapore", "University of Cambridge", "University of Oxford",
  "Stanford University", "MIT", "Harvard University", "UC Berkeley", "NYU Stern", "Cornell University",
  "University of Toronto", "UBC", "McGill University", "University of Melbourne", "University of Sydney",
  "ANU", "ETH Zurich", "EPFL", "Imperial College London", "UCL London", "LSE",
  "King's College London", "University of Edinburgh", "University of Tokyo", "Kyoto University",
  "Seoul National University", "KAIST", "University of Hong Kong", "HKUST", "Tsinghua University", "Peking University",
  "University of Michigan", "UCLA", "University of Chicago", "Columbia University", "Yale University",
  "Princeton University", "University of Pennsylvania", "Duke University", "Northwestern University", "Johns Hopkins",
  "Carnegie Mellon", "Georgia Tech", "Purdue University", "University of Texas at Austin", "University of Wisconsin-Madison",
  "University of Illinois Urbana-Champaign", "Caltech", "IE Business School", "INSEAD", "Sciences Po",
  "University of Amsterdam", "University of Copenhagen", "University of Helsinki", "KTH Royal Institute of Technology",
  "Technical University of Munich", "University of Zurich", "University of Geneva", "University of St. Gallen",
  "Wageningen University", "KU Leuven", "Université PSL", "Sorbonne University", "University of Milan",
  "University of Bologna", "University of Barcelona", "Universidad Autónoma de Madrid", "University of Oslo",
  "University of Auckland", "University of Queensland", "Monash University", "UNSW Sydney", "University of Warwick",
  "University of Bristol", "University of Glasgow", "University of Birmingham", "University of Southampton",
  "Durham University", "University of St. Andrews", "University of Nottingham", "University of Leeds",
  "University of Sheffield", "Loughborough University", "Lancaster University", "Cardiff University",
  "Queen Mary University of London", "Royal Holloway", "SOAS London", "City University London",
  "Aalto University", "Chalmers University of Technology", "University of Gothenburg", "Stockholm University",
  "Lund University", "Uppsala University", "University of Vienna", "Vienna University of Technology",
  "University of Bern", "University of Lausanne", "University of Basel", "University of Fribourg",
];

const courses = [
  "B.Tech Computer Science", "B.Tech Electrical Engineering", "B.Tech Mechanical Engineering", "B.Tech Aerospace Engineering",
  "B.Tech Civil Engineering", "B.Tech Chemical Engineering", "B.Tech Biotechnology", "B.Tech Artificial Intelligence",
  "B.A. Economics", "B.A. Psychology", "B.A. Sociology", "B.A. Political Science",
  "B.A. Philosophy", "B.A. English Literature", "B.A. History", "B.A. Anthropology",
  "B.A. Philosophy, Politics & Economics", "B.Sc. Computer Science", "B.Sc. Mathematics", "B.Sc. Physics",
  "B.Sc. Chemistry", "B.Sc. Biology", "B.Sc. Environmental Science", "B.Sc. Neuroscience",
  "B.Sc. Business", "B.B.A.", "B.F.A. Fashion Design", "B.F.A. Fine Arts",
  "B.Arch Architecture", "LL.B. Law", "M.A. Law", "M.Sc. Biomedical Engineering",
  "M.Sc. Architecture", "M.Sc. Robotics", "M.Sc. Data Science", "M.Sc. Artificial Intelligence",
  "M.Sc. Finance", "M.Sc. International Relations", "M.A. International Business", "MBA",
  "B.S. Symbolic Systems", "B.S. Mechanical Engineering", "B.S. Electrical Engineering & CS",
  "B.E. Civil Engineering", "B.E. Artificial Intelligence", "B.E. Mechanical Engineering",
  "B.A. Fashion Communication", "B.Des. Product Design", "B.Des. Interaction Design", "B.Plan Urban Planning",
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Switzerland", "Singapore",
  "Japan", "South Korea", "Hong Kong", "China", "Netherlands", "Sweden", "Denmark", "Norway",
  "Finland", "France", "Spain", "Italy", "Belgium", "Austria", "Ireland", "New Zealand",
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Turkey", "Malaysia", "Thailand",
];

const qsTiers = ["top10", "top20", "top50", "top100", "top200", "unranked"] as const;

const languagePool = [
  ["English", "Hindi", "Marathi"],
  ["English", "Hindi", "Telugu"],
  ["English", "Hindi", "Tamil"],
  ["English", "Hindi", "Bengali"],
  ["English", "Hindi", "Punjabi"],
  ["English", "Hindi", "Gujarati"],
  ["English", "Hindi", "Kannada"],
  ["English", "Hindi", "Malayalam"],
  ["English", "Hindi", "Urdu"],
  ["English", "Hindi", "Marwari"],
  ["English", "Hindi", "Sindhi"],
  ["English", "Hindi", "Konkani"],
  ["English", "Hindi", "Assamese"],
  ["English", "Hindi", "Oriya"],
  ["English", "Hindi", "Nepali"],
  ["English", "Hindi", "Kashmiri"],
  ["English", "Hindi", "Sanskrit"],
  ["English", "French", "Hindi"],
  ["English", "Spanish", "Hindi"],
  ["English", "German", "Hindi"],
  ["English", "Japanese", "Hindi"],
  ["English", "Cantonese", "Hindi"],
  ["English", "Korean", "Hindi"],
  ["English", "Italian", "Hindi"],
  ["English", "Portuguese", "Hindi"],
  ["English", "Arabic", "Hindi"],
  ["English", "Russian", "Hindi"],
  ["English", "Dutch", "Hindi"],
  ["English", "Swedish", "Hindi"],
  ["English", "Danish", "Hindi"],
  ["English", "Finnish", "Hindi"],
  ["English", "Norwegian", "Hindi"],
  ["English", "Turkish", "Hindi"],
  ["English", "Thai", "Hindi"],
  ["English", "Vietnamese", "Hindi"],
  ["English", "Mandarin", "Hindi"],
];

const bios = [
  (_name: string, uni: string, course: string) =>
    `I'm a ${course} graduate from ${uni}. I mentor students navigating college applications, sharing what I wish I'd known. Let me help you find the right path.`,
  (name: string, uni: string) =>
    `${name} here — ${uni} alum. I've mentored 30+ students through the admissions process. From essays to interviews, I can help you put your best foot forward.`,
  (name: string) =>
    `Hi, I'm ${name}! I love connecting with students who are curious about the world. Whether it's career advice, study tips, or just figuring things out — I'm here for you.`,
  (_name: string, _uni: string, course: string) =>
    `${course} grad from a top university. My journey taught me that the right guidance changes everything. I offer practical, honest advice to help you make informed decisions about your future.`,
  (_name: string, uni: string) =>
    `${uni} alumni and mentor. I believe every student deserves access to real perspectives from people who've been there. Ask me anything about applications, scholarships, or student life.`,
  (name: string) =>
    `Hi! I'm ${name}. Studying abroad was transformative for me. Now I want to help other students navigate the same journey with more clarity and less stress.`,
  (_name: string, uni: string, course: string) =>
    `${course} at ${uni} was a game-changer for me. I guide students through subject selection, application strategy, and building a compelling profile for competitive programs worldwide.`,
  (name: string) =>
    `I'm ${name}, a passionate mentor dedicated to helping students discover their potential. Let's talk about your goals and how to achieve them — no question is too small!`,
  (_name: string, uni: string) =>
    `${uni} grad here. I remember how overwhelming the process felt. Now I break it down into manageable steps for students like you. Let's start that conversation.`,
  (name: string, uni: string) =>
    `${name}. ${uni} alumnus. I've been in your shoes and know exactly what you're going through. My sessions are casual, informative, and tailored to what you actually need.`,
  (_name: string, uni: string) =>
    `As a ${uni} graduate, I bring firsthand experience of studying at a world-class institution. I help students craft standout applications and navigate cultural transitions.`,
  (name: string) =>
    `Hey! I'm ${name}. I believe mentorship should feel like a conversation with a friend who happens to have great advice. Let's chat about your plans and dreams!`,
  (name: string, uni: string) =>
    `${name} — ${uni} alumni. I specialize in helping students who feel lost or unsure about their next steps. Together we can build a clear roadmap for your academic future.`,
  (_name: string, uni: string) =>
    `${uni} graduate passionate about paying it forward. I offer personalized guidance on everything from course selection to scholarship essays. Your success story starts here.`,
  (name: string) =>
    `I'm ${name}, and I love mentoring because someone once did it for me. Let me help you navigate the confusing world of college applications, career choices, and life decisions.`,
  (_name: string, uni: string) =>
    `${uni} alum with experience across multiple industries. I bring a broad perspective to mentoring — whether you're into business, tech, or the arts, I can help you think strategically.`,
  (name: string) =>
    `Hi, I'm ${name}! I've helped dozens of students get into their dream universities. My approach is practical, encouraging, and focused on what makes you unique as an applicant.`,
  (_name: string, uni: string) =>
    `${uni} graduate and professional mentor. I combine academic advice with real career insights so you can make choices that set you up for long-term success.`,
  (name: string) =>
    `${name} here! My own journey had plenty of twists and turns. I share those stories — and the lessons I learned — to help you navigate your path with more confidence.`,
  (_name: string, uni: string) =>
    `${uni} alumnus. I offer brutally honest, supportive advice. No sugar-coating, just real talk about what it takes to get into top universities and thrive once you're there.`,
];

// ─── Session pricing varied per alumnus ──────────────────────────────

const priceSets = (seed: number) => ({
  call_30: 14900 + ((seed * 137 + 5000) % 45100),
  call_45: 24900 + ((seed * 251 + 8000) % 40100),
  call_60: 34900 + ((seed * 373 + 12000) % 45100),
  group_40: 69900 + ((seed * 499 + 20000) % 80100),
});

const sessionDescriptions = [
  "Quick chat — perfect for specific questions",
  "Rapid-fire Q&A on applications",
  "30 min of focused guidance",
  "Standard session — explore topics in depth",
  "In-depth conversation about your future",
  "Deep dive — comprehensive guidance",
  "Extended session for thorough mentoring",
  "Full hour of personalized advice",
  "Comprehensive strategy session",
  "Group session — learn with peers",
  "Collaborative workshop (max 6 students)",
  "Group discussion on university applications",
];

// ─── Availability generation ─────────────────────────────────────────

const timeSlots = [
  { start: "07:00", end: "08:00" },
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "12:00", end: "13:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
  { start: "17:00", end: "18:00" },
  { start: "18:00", end: "19:00" },
  { start: "19:00", end: "20:00" },
  { start: "20:00", end: "21:00" },
  { start: "21:00", end: "22:00" },
];

function selectSlotsForAlumnus(index: number) {
  const slots: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
  const r = index * 13 + 7;
  const daysPerAlumnus = 3 + (r % 5);
  const preferredDays: number[] = [1, 2, 3, 4, 5, 6, 0];
  const offset = r % 7;

  for (let d = 0; d < daysPerAlumnus; d++) {
    const day = preferredDays[(offset + d) % 7]!;
    const isWeekend = day === 0 || day === 6;
    const numSlots = isWeekend ? 2 + (r % 3) : 1 + (r % 4);
    const daySlotsStart = (r + d * 5) % (isWeekend ? 8 : 10);

    for (let s = 0; s < numSlots && (daySlotsStart + s) < timeSlots.length; s++) {
      const slot = timeSlots[daySlotsStart + s];
      if (slot) {
        slots.push({ dayOfWeek: day, startTime: slot.start, endTime: slot.end });
      }
    }
  }
  return slots;
}

// ─── Study level variation ──────────────────────────────────────────

const studyLevels = ["undergraduate", "postgraduate", "both"];

// ─── Main seed function ─────────────────────────────────────────────

async function main() {
  console.log("Seeding AlumNow database with 120 varied alumni...\n");

  // Clean
  await prisma.notificationLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.groupSession.deleteMany();
  await prisma.sessionTypeOffering.deleteMany();
  await prisma.alumniAvailability.deleteMany();
  await prisma.savedAlumni.deleteMany();
  await prisma.alumniProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformStat.deleteMany();
  await prisma.platformSetting.deleteMany();

  const passwordHash = await hash("password123", ROUNDS);

  // Admin
  const admin = await prisma.user.create({
    data: { email: "admin@alumnow.com", passwordHash, role: "admin", emailVerifiedAt: new Date() },
  });
  await prisma.adminUser.create({ data: { userId: admin.id } });

  // Student
  const student = await prisma.user.create({
    data: { email: "student1@alumnow.com", passwordHash, role: "student", phone: "+919876543210", emailVerifiedAt: new Date() },
  });
  await prisma.studentProfile.create({
    data: { userId: student.id, fullName: "Aarav Patel", currentGrade: "A2" },
  });

  // Additional demo students
  const studentsExtra = [
    { email: "student2@alumnow.com", name: "Sanya Gupta", grade: "AS" },
    { email: "student3@alumnow.com", name: "Reyansh Singh", grade: "A2" },
    { email: "student4@alumnow.com", name: "Anaya Kapoor", grade: "IGCSE" },
  ];
  for (const s of studentsExtra) {
    const u = await prisma.user.create({
      data: { email: s.email, passwordHash, role: "student", emailVerifiedAt: new Date() },
    });
    await prisma.studentProfile.create({ data: { userId: u.id, fullName: s.name, currentGrade: s.grade } });
  }

  const NUM_ALUMNI = 120;
  const universitiesSet = new Set<string>();
  const countriesSet = new Set<string>();

  for (let i = 0; i < NUM_ALUMNI; i++) {
    const fn = firstNames[i % firstNames.length]!;
    const ln = lastNames[i % lastNames.length]!;
    const fullName = `${fn} ${ln}`;
    const uni = universities[i % universities.length]!;
    const course = courses[i % courses.length]!;
    const country = countries[i % countries.length]!;
    const qsTier = qsTiers[i % qsTiers.length]!;
    const gradYear = 2018 + (i % 8);
    const langIdx = i % languagePool.length;
    const lang = languagePool[langIdx]!;
    const bioIdx = i % bios.length;
    const bio = bios[bioIdx]!(fullName, uni, course);
    const studyLevel = studyLevels[i % studyLevels.length]!;
    const isVerified = i % 6 !== 5; // ~83% verified
    const hasRating = i % 8 !== 7; // ~88% have ratings
    const rating = hasRating ? +(3.2 + (i % 19) * 0.1).toFixed(1) : null;
    const ratingCount = hasRating ? Math.floor(Math.random() * 60) + 3 : 0;
    const responseTime = [0.5, 1, 2, 3, 4, 6, 8, 12, 18, 24, 36, 48][i % 12];

    const user = await prisma.user.create({
      data: {
        email: `alumni${i + 1}@alumnow.com`,
        passwordHash,
        role: "alumnus",
        emailVerifiedAt: new Date(),
      },
    });

    universitiesSet.add(uni);
    countriesSet.add(country);

    const profile = await prisma.alumniProfile.create({
      data: {
        userId: user.id,
        fullName,
        universityName: uni,
        course,
        country,
        graduationYearJbcn: gradYear,
        qsRankingTier: qsTier,
        currentStudyLevel: studyLevel === "both" ? (i % 2 === 0 ? "undergraduate" : "postgraduate") : studyLevel,
        bio,
        languages: JSON.stringify(lang),
        verificationStatus: isVerified ? "approved" : "pending",
        isVerifiedJbcnAlumnus: isVerified,
        avgResponseTimeHours: responseTime,
        ratingAvg: rating,
        ratingCount,
        isActive: i % 15 !== 14,
      },
    });

    // Availability
    const slots = selectSlotsForAlumnus(i);
    for (const slot of slots) {
      await prisma.alumniAvailability.create({
        data: {
          alumniId: profile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isRecurring: true,
        },
      });
    }

    // Session types with varied pricing
    const prices = priceSets(i);
    const types: { type: string; pricePaise: number; maxParticipants: number }[] = [
      { type: "call_30", pricePaise: prices.call_30, maxParticipants: 1 },
      { type: "call_45", pricePaise: prices.call_45, maxParticipants: 1 },
      { type: "call_60", pricePaise: prices.call_60, maxParticipants: 1 },
    ];
    // ~70% also offer group sessions
    if (i % 10 < 7) {
      types.push({ type: "group_40", pricePaise: prices.group_40, maxParticipants: 6 });
    }

    for (const session of types) {
      await prisma.sessionTypeOffering.create({
        data: {
          alumniId: profile.id,
          type: session.type,
          pricePaise: session.pricePaise,
          maxParticipants: session.maxParticipants,
          descriptionOneLiner: sessionDescriptions[(i * 3 + session.type.length) % sessionDescriptions.length]!,
        },
      });
    }
  }

  // Platform stats
  await prisma.platformStat.createMany({
    data: [
      { key: "alumni_count", value: NUM_ALUMNI },
      { key: "universities_count", value: universitiesSet.size },
      { key: "sessions_completed", value: Math.floor(Math.random() * 200) + 150 },
    ],
  });

  await prisma.platformSetting.createMany({
    data: [
      { key: "upi_id", value: "alumnow@upi" },
      { key: "upi_qr_image_url", value: "/images/upi-qr-demo.png" },
    ],
  });

  console.log(`✅ Seeded admin, 4 students, and ${NUM_ALUMNI} alumni\n`);
  console.log(`   📚 ${universitiesSet.size} unique universities across ${countriesSet.size} countries`);
  console.log(`   💰 Prices range ₹149–₹1,499 per session`);
  console.log(`   ⭐ Ratings range 3.2–5.0 (${Math.round(NUM_ALUMNI * 0.88)} alumni rated)`);
  console.log(`   ⏱ Response time varies 30min–48h`);
  console.log(`   🎓 Study levels: undergrad + postgraduate`);
  console.log(`   ✅ ${Math.round(NUM_ALUMNI * 0.83)} verified alumni`);
  console.log(`   🕐 All have unique weekly availability slots`);
  console.log(`   📖 20 unique bio styles\n`);
  console.log("   Passwords: password123");
  console.log("   Admin: admin@alumnow.com");
  console.log("   Students: student{1-4}@alumnow.com");
  console.log("   Alumni: alumni{1-120}@alumnow.com\n");

  console.log("Sample alumni:");
  const sample = await prisma.alumniProfile.findMany({ take: 5, orderBy: { createdAt: "asc" } });
  for (const a of sample) {
    const types = await prisma.sessionTypeOffering.findMany({ where: { alumniId: a.id } });
    const slots = await prisma.alumniAvailability.findMany({ where: { alumniId: a.id } });
    console.log(`   ${a.fullName} — ${a.universityName} | ⭐${a.ratingAvg ?? "N/A"} | ⏱${Math.round(a.avgResponseTimeHours ?? 0)}h | ${types.length} types | ${slots.length} slots/week`);
  }
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
