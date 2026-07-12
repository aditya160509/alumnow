-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'student',
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailVerifiedAt" DATETIME,
    "googleOauthId" TEXT
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "currentGrade" TEXT NOT NULL DEFAULT 'AS',
    "school" TEXT NOT NULL DEFAULT 'JBCN International School Borivali',
    CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlumniProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "universityName" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "graduationYearJbcn" INTEGER NOT NULL,
    "currentStudyLevel" TEXT NOT NULL DEFAULT 'undergraduate',
    "qsRankingTier" TEXT NOT NULL DEFAULT 'unranked',
    "bio" TEXT,
    "languages" TEXT NOT NULL DEFAULT '[]',
    "linkedinUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "avgResponseTimeHours" REAL,
    "isVerifiedJbcnAlumnus" BOOLEAN NOT NULL DEFAULT false,
    "ratingAvg" REAL,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AlumniProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlumniAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumniId" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "specificDate" DATETIME,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "AlumniAvailability_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "AlumniProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionTypeOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumniId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pricePaise" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 1,
    "descriptionOneLiner" TEXT,
    CONSTRAINT "SessionTypeOffering_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "AlumniProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "sessionTypeOfferingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "scheduledStartAt" DATETIME NOT NULL,
    "scheduledEndAt" DATETIME NOT NULL,
    "meetLink" TEXT,
    "groupSessionId" TEXT,
    "reminder24hSentAt" DATETIME,
    "reminder1hSentAt" DATETIME,
    "reviewPromptSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "AlumniProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_sessionTypeOfferingId_fkey" FOREIGN KEY ("sessionTypeOfferingId") REFERENCES "SessionTypeOffering" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_groupSessionId_fkey" FOREIGN KEY ("groupSessionId") REFERENCES "GroupSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroupSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumniId" TEXT NOT NULL,
    "sessionTypeOfferingId" TEXT NOT NULL,
    "scheduledStartAt" DATETIME NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 6,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    CONSTRAINT "GroupSession_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "AlumniProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GroupSession_sessionTypeOfferingId_fkey" FOREIGN KEY ("sessionTypeOfferingId") REFERENCES "SessionTypeOffering" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "upiTransactionRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'awaiting_ref',
    "verifiedByAdminId" TEXT,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_verifiedByAdminId_fkey" FOREIGN KEY ("verifiedByAdminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "reviewerType" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alumnusId" TEXT,
    CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_alumnusId_fkey" FOREIGN KEY ("alumnusId") REFERENCES "AlumniProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedAlumni" (
    "studentId" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("studentId", "alumniId"),
    CONSTRAINT "SavedAlumni_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedAlumni_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "AlumniProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlatformStat" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedByAdminId" TEXT
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "permissions" TEXT NOT NULL DEFAULT 'all',
    CONSTRAINT "AdminUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'logged',
    CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleOauthId_key" ON "User"("googleOauthId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_userId_key" ON "AlumniProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

