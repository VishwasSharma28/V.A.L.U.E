-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'LIFETIME', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "UsageFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'RARELY', 'NEVER');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('DOWNGRADE', 'CANCEL', 'UPGRADE', 'CONSOLIDATE', 'UNUSED_BENEFIT', 'OVERLAP_DETECTED', 'COST_OPTIMIZATION', 'COMPLEMENTARY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BILLING_REMINDER', 'WASTE_ALERT', 'RECOMMENDATION', 'BLOCKCHAIN_CONFIRMED', 'USAGE_REPORT', 'SCORE_UPDATE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LedgerStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "SharedPlanRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('GLOBAL', 'INDIA', 'US', 'EU', 'ASIA', 'OTHER');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('B2C', 'B2B', 'BOTH');

-- CreateTable
CREATE TABLE "SubscriptionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionSubcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionProvider" (
    "id" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "region" "Region" NOT NULL DEFAULT 'GLOBAL',
    "businessType" "BusinessType" NOT NULL DEFAULT 'B2C',
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlanType" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlanType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "planTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyCost" DOUBLE PRECISION NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "features" TEXT[],
    "tags" TEXT[],
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatar" TEXT,
    "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "providerId" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "verifyToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "usageFrequency" "UsageFrequency" NOT NULL DEFAULT 'MONTHLY',
    "lastUsed" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "nextBillingDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueScore" (
    "id" TEXT NOT NULL,
    "userSubscriptionId" TEXT NOT NULL,
    "efficiencyScore" DOUBLE PRECISION NOT NULL,
    "wastePercentage" DOUBLE PRECISION NOT NULL,
    "costPerUse" DOUBLE PRECISION NOT NULL,
    "usageScore" DOUBLE PRECISION NOT NULL,
    "recommendationScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValueScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userSubscriptionId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "featuresUsed" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userSubscriptionId" TEXT,
    "type" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "savingAmount" DOUBLE PRECISION,
    "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userSubscriptionId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" TEXT,
    "network" TEXT NOT NULL DEFAULT 'solana-devnet',
    "status" "LedgerStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedPlan" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "maxMembers" INTEGER NOT NULL DEFAULT 5,
    "inviteCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedMember" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SharedPlanRole" NOT NULL DEFAULT 'MEMBER',
    "monthlyShare" DOUBLE PRECISION NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userSubscriptionId" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "granularity" TEXT NOT NULL,
    "totalSpend" DOUBLE PRECISION NOT NULL,
    "totalWaste" DOUBLE PRECISION NOT NULL,
    "wastePercent" DOUBLE PRECISION NOT NULL,
    "avgScore" DOUBLE PRECISION NOT NULL,
    "categoryBreakdown" JSONB NOT NULL,
    "topWastedService" TEXT,
    "recoveredValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "billingReminders" BOOLEAN NOT NULL DEFAULT true,
    "wasteAlerts" BOOLEAN NOT NULL DEFAULT true,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "blockchainAlerts" BOOLEAN NOT NULL DEFAULT true,
    "privacy" JSONB,
    "connectedAccounts" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionCategory_name_key" ON "SubscriptionCategory"("name");

-- CreateIndex
CREATE INDEX "SubscriptionCategory_order_idx" ON "SubscriptionCategory"("order");

-- CreateIndex
CREATE INDEX "SubscriptionCategory_isActive_idx" ON "SubscriptionCategory"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionSubcategory_categoryId_idx" ON "SubscriptionSubcategory"("categoryId");

-- CreateIndex
CREATE INDEX "SubscriptionSubcategory_order_idx" ON "SubscriptionSubcategory"("order");

-- CreateIndex
CREATE INDEX "SubscriptionSubcategory_isActive_idx" ON "SubscriptionSubcategory"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionProvider_subcategoryId_idx" ON "SubscriptionProvider"("subcategoryId");

-- CreateIndex
CREATE INDEX "SubscriptionProvider_region_idx" ON "SubscriptionProvider"("region");

-- CreateIndex
CREATE INDEX "SubscriptionProvider_businessType_idx" ON "SubscriptionProvider"("businessType");

-- CreateIndex
CREATE INDEX "SubscriptionProvider_isActive_idx" ON "SubscriptionProvider"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPlanType_providerId_idx" ON "SubscriptionPlanType"("providerId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanType_order_idx" ON "SubscriptionPlanType"("order");

-- CreateIndex
CREATE INDEX "SubscriptionPlanType_isActive_idx" ON "SubscriptionPlanType"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_planTypeId_idx" ON "SubscriptionPlan"("planTypeId");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_monthlyCost_idx" ON "SubscriptionPlan"("monthlyCost");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isPopular_idx" ON "SubscriptionPlan"("isPopular");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isActive_idx" ON "SubscriptionPlan"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_provider_providerId_idx" ON "User"("provider", "providerId");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_idx" ON "UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_planId_idx" ON "UserSubscription"("planId");

-- CreateIndex
CREATE INDEX "UserSubscription_isActive_idx" ON "UserSubscription"("isActive");

-- CreateIndex
CREATE INDEX "ValueScore_userSubscriptionId_idx" ON "ValueScore"("userSubscriptionId");

-- CreateIndex
CREATE INDEX "ValueScore_computedAt_idx" ON "ValueScore"("computedAt");

-- CreateIndex
CREATE INDEX "UsageLog_userId_idx" ON "UsageLog"("userId");

-- CreateIndex
CREATE INDEX "UsageLog_userSubscriptionId_idx" ON "UsageLog"("userSubscriptionId");

-- CreateIndex
CREATE INDEX "UsageLog_sessionDate_idx" ON "UsageLog"("sessionDate");

-- CreateIndex
CREATE INDEX "Recommendation_userId_idx" ON "Recommendation"("userId");

-- CreateIndex
CREATE INDEX "Recommendation_isRead_idx" ON "Recommendation"("isRead");

-- CreateIndex
CREATE INDEX "Recommendation_isDismissed_idx" ON "Recommendation"("isDismissed");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerRecord_txHash_key" ON "LedgerRecord"("txHash");

-- CreateIndex
CREATE INDEX "LedgerRecord_userId_idx" ON "LedgerRecord"("userId");

-- CreateIndex
CREATE INDEX "LedgerRecord_txHash_idx" ON "LedgerRecord"("txHash");

-- CreateIndex
CREATE INDEX "LedgerRecord_status_idx" ON "LedgerRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SharedPlan_inviteCode_key" ON "SharedPlan"("inviteCode");

-- CreateIndex
CREATE INDEX "SharedPlan_ownerId_idx" ON "SharedPlan"("ownerId");

-- CreateIndex
CREATE INDEX "SharedPlan_inviteCode_idx" ON "SharedPlan"("inviteCode");

-- CreateIndex
CREATE INDEX "SharedMember_planId_idx" ON "SharedMember"("planId");

-- CreateIndex
CREATE INDEX "SharedMember_userId_idx" ON "SharedMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedMember_planId_userId_key" ON "SharedMember"("planId", "userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "UploadedFile_userId_idx" ON "UploadedFile"("userId");

-- CreateIndex
CREATE INDEX "UploadedFile_userSubscriptionId_idx" ON "UploadedFile"("userSubscriptionId");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_userId_idx" ON "AnalyticsSnapshot"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_granularity_idx" ON "AnalyticsSnapshot"("granularity");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSnapshot_userId_period_granularity_key" ON "AnalyticsSnapshot"("userId", "period", "granularity");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "SubscriptionSubcategory" ADD CONSTRAINT "SubscriptionSubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SubscriptionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionProvider" ADD CONSTRAINT "SubscriptionProvider_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubscriptionSubcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanType" ADD CONSTRAINT "SubscriptionPlanType_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SubscriptionProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlan" ADD CONSTRAINT "SubscriptionPlan_planTypeId_fkey" FOREIGN KEY ("planTypeId") REFERENCES "SubscriptionPlanType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueScore" ADD CONSTRAINT "ValueScore_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerRecord" ADD CONSTRAINT "LedgerRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerRecord" ADD CONSTRAINT "LedgerRecord_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPlan" ADD CONSTRAINT "SharedPlan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMember" ADD CONSTRAINT "SharedMember_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SharedPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMember" ADD CONSTRAINT "SharedMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
