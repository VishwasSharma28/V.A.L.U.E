"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding V.A.L.U.E database with complete subscription taxonomy...');
    // ── User ────────────────────────────────────────────────
    const passwordHash = await bcryptjs_1.default.hash('Demo@1234', 12);
    const user = await prisma.user.upsert({
        where: { email: 'vishwas@value.app' },
        update: {},
        create: {
            name: 'Vishwas Sharma',
            email: 'vishwas@value.app',
            passwordHash,
            emailVerified: true,
            provider: 'EMAIL',
            settings: {
                create: {
                    currency: 'INR',
                    billingReminders: true,
                    wasteAlerts: true,
                    weeklyDigest: true,
                    blockchainAlerts: true,
                },
            },
        },
    });
    console.log(`✅ User: ${user.email}`);
    // ── Seed Taxonomy ────────────────────────────────────────
    await seedSubscriptionTaxonomy();
    console.log('✅ Subscription taxonomy seeded');
    // ── User Subscriptions ───────────────────────────────────
    await seedUserSubscriptions(user.id);
    console.log('✅ User subscriptions seeded');
    // ── Value Scores ─────────────────────────────────────────
    await seedValueScores(user.id);
    console.log('✅ Value scores seeded');
    // ── Usage Logs ───────────────────────────────────────────
    await seedUsageLogs(user.id);
    console.log('✅ Usage logs seeded');
    // ── Recommendations ──────────────────────────────────────
    await seedRecommendations(user.id);
    console.log('✅ Recommendations seeded');
    // ── Ledger Records ───────────────────────────────────────
    await seedLedgerRecords(user.id);
    console.log('✅ Ledger records seeded');
    // ── Notifications ────────────────────────────────────────
    await seedNotifications(user.id);
    console.log('✅ Notifications seeded');
    // ── Analytics Snapshot ───────────────────────────────────
    await seedAnalyticsSnapshot(user.id);
    console.log('✅ Analytics snapshot seeded');
    console.log('\n🎉 Seed complete!');
    console.log(`📧 Login: vishwas@value.app`);
    console.log(`🔑 Password: Demo@1234`);
}
async function seedSubscriptionTaxonomy() {
    // Categories
    const categories = [
        { name: 'Mobile plans', description: 'Mobile telecom services', icon: '📱', color: '#FF6B6B', order: 1 },
        { name: 'Home broadband', description: 'Internet connectivity services', icon: '🏠', color: '#4ECDC4', order: 2 },
        { name: 'DTH / cable TV', description: 'Television broadcasting services', icon: '📺', color: '#45B7D1', order: 3 },
        { name: 'Global SVOD', description: 'Global streaming video on demand', icon: '🌍', color: '#96CEB4', order: 4 },
        { name: 'India OTT', description: 'Indian over-the-top streaming', icon: '🇮🇳', color: '#FFEAA7', order: 5 },
        { name: 'Consumer AI plans', description: 'AI tools for consumers', icon: '🤖', color: '#DDA0DD', order: 6 },
        { name: 'Cloud computing', description: 'Cloud infrastructure and services', icon: '☁️', color: '#98D8C8', order: 7 },
        { name: 'Productivity tools', description: 'Work and productivity software', icon: '💼', color: '#F7DC6F', order: 8 },
        { name: 'Gaming subscriptions', description: 'Gaming platforms and passes', icon: '🎮', color: '#BB8FCE', order: 9 },
        { name: 'Health & fitness', description: 'Health, fitness, and wellness services', icon: '🏃', color: '#85C1E9', order: 10 },
    ];
    const createdCategories = [];
    for (const cat of categories) {
        const category = await prisma.subscriptionCategory.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        createdCategories.push(category);
    }
    // Subcategories
    const subcategories = [
        // Mobile plans
        { categoryName: 'Mobile plans', name: 'Mobile prepaid', description: 'Prepaid mobile plans', order: 1 },
        { categoryName: 'Mobile plans', name: 'Mobile postpaid', description: 'Postpaid mobile plans', order: 2 },
        { categoryName: 'Mobile plans', name: 'Family prepaid plans', description: 'Family sharing plans', order: 3 },
        { categoryName: 'Mobile plans', name: 'International roaming', description: 'Roaming add-ons', order: 4 },
        // Home broadband
        { categoryName: 'Home broadband', name: 'Fiber broadband', description: 'FTTH fiber internet', order: 1 },
        { categoryName: 'Home broadband', name: 'Cable broadband', description: 'Cable internet services', order: 2 },
        { categoryName: 'Home broadband', name: 'Fixed wireless', description: '5G home internet', order: 3 },
        // DTH / cable TV
        { categoryName: 'DTH / cable TV', name: 'DTH satellite TV', description: 'Direct-to-home satellite', order: 1 },
        { categoryName: 'DTH / cable TV', name: 'Cable TV', description: 'Cable television services', order: 2 },
        // Global SVOD
        { categoryName: 'Global SVOD', name: 'Premium streaming', description: 'Major streaming platforms', order: 1 },
        { categoryName: 'Global SVOD', name: 'Sports streaming', description: 'Sports-focused streaming', order: 2 },
        // India OTT
        { categoryName: 'India OTT', name: 'Regional OTT', description: 'Indian streaming services', order: 1 },
        // Consumer AI plans
        { categoryName: 'Consumer AI plans', name: 'AI chatbots', description: 'Conversational AI services', order: 1 },
        { categoryName: 'Consumer AI plans', name: 'AI image generation', description: 'AI art and image tools', order: 2 },
        // Cloud computing
        { categoryName: 'Cloud computing', name: 'IaaS', description: 'Infrastructure as a Service', order: 1 },
        { categoryName: 'Cloud computing', name: 'Serverless', description: 'Serverless computing platforms', order: 2 },
        { categoryName: 'Cloud computing', name: 'Storage', description: 'Cloud storage services', order: 3 },
        // Productivity tools
        { categoryName: 'Productivity tools', name: 'Project management', description: 'Task and project tools', order: 1 },
        { categoryName: 'Productivity tools', name: 'Communication', description: 'Team communication platforms', order: 2 },
        // Gaming subscriptions
        { categoryName: 'Gaming subscriptions', name: 'Console passes', description: 'Gaming platform subscriptions', order: 1 },
        { categoryName: 'Gaming subscriptions', name: 'Cloud gaming', description: 'Cloud gaming services', order: 2 },
        // Health & fitness
        { categoryName: 'Health & fitness', name: 'Gym memberships', description: 'Fitness center memberships', order: 1 },
        { categoryName: 'Health & fitness', name: 'Digital fitness', description: 'Online fitness platforms', order: 2 },
    ];
    const createdSubcategories = [];
    for (const sub of subcategories) {
        const category = createdCategories.find(c => c.name === sub.categoryName);
        if (!category)
            continue;
        const existingSubcategory = await prisma.subscriptionSubcategory.findFirst({
            where: { name: sub.name, categoryId: category.id },
        });
        const subcategory = existingSubcategory ?? await prisma.subscriptionSubcategory.create({
            data: {
                categoryId: category.id,
                name: sub.name,
                description: sub.description,
                order: sub.order,
            },
        });
        createdSubcategories.push(subcategory);
    }
    // Providers
    const providers = [
        // Mobile
        { subcategoryName: 'Mobile prepaid', name: 'Airtel', region: 'INDIA', businessType: 'B2C', tags: ['telecom', 'mobile'] },
        { subcategoryName: 'Mobile prepaid', name: 'Jio', region: 'INDIA', businessType: 'B2C', tags: ['telecom', 'mobile'] },
        { subcategoryName: 'Mobile prepaid', name: 'Vi', region: 'INDIA', businessType: 'B2C', tags: ['telecom', 'mobile'] },
        // Broadband
        { subcategoryName: 'Fiber broadband', name: 'Airtel', region: 'INDIA', businessType: 'B2C', tags: ['internet', 'broadband'] },
        { subcategoryName: 'Fiber broadband', name: 'Jio', region: 'INDIA', businessType: 'B2C', tags: ['internet', 'broadband'] },
        { subcategoryName: 'Fiber broadband', name: 'ACT Fibernet', region: 'INDIA', businessType: 'B2C', tags: ['internet', 'broadband'] },
        // OTT Global
        { subcategoryName: 'Premium streaming', name: 'Netflix', region: 'GLOBAL', businessType: 'B2C', tags: ['streaming', 'entertainment'] },
        { subcategoryName: 'Premium streaming', name: 'Amazon Prime Video', region: 'GLOBAL', businessType: 'B2C', tags: ['streaming', 'entertainment'] },
        { subcategoryName: 'Premium streaming', name: 'Disney+', region: 'GLOBAL', businessType: 'B2C', tags: ['streaming', 'entertainment'] },
        // OTT India
        { subcategoryName: 'Regional OTT', name: 'JioHotstar', region: 'INDIA', businessType: 'B2C', tags: ['streaming', 'indian', 'sports'] },
        { subcategoryName: 'Regional OTT', name: 'Zee5', region: 'INDIA', businessType: 'B2C', tags: ['streaming', 'indian'] },
        { subcategoryName: 'Regional OTT', name: 'SonyLiv', region: 'INDIA', businessType: 'B2C', tags: ['streaming', 'indian'] },
        // AI
        { subcategoryName: 'AI chatbots', name: 'ChatGPT', region: 'GLOBAL', businessType: 'B2C', tags: ['ai', 'productivity'] },
        { subcategoryName: 'AI chatbots', name: 'Claude', region: 'GLOBAL', businessType: 'B2C', tags: ['ai', 'productivity'] },
        // Cloud
        { subcategoryName: 'IaaS', name: 'AWS', region: 'GLOBAL', businessType: 'BOTH', tags: ['cloud', 'infrastructure'] },
        { subcategoryName: 'IaaS', name: 'Google Cloud', region: 'GLOBAL', businessType: 'BOTH', tags: ['cloud', 'infrastructure'] },
        { subcategoryName: 'Serverless', name: 'Vercel', region: 'GLOBAL', businessType: 'BOTH', tags: ['cloud', 'serverless'] },
        // Productivity
        { subcategoryName: 'Project management', name: 'Notion', region: 'GLOBAL', businessType: 'B2C', tags: ['productivity', 'notes'] },
        { subcategoryName: 'Project management', name: 'Asana', region: 'GLOBAL', businessType: 'B2C', tags: ['productivity', 'tasks'] },
        { subcategoryName: 'Communication', name: 'Slack', region: 'GLOBAL', businessType: 'BOTH', tags: ['communication', 'team'] },
        // Gaming
        { subcategoryName: 'Console passes', name: 'Xbox Game Pass', region: 'GLOBAL', businessType: 'B2C', tags: ['gaming', 'microsoft'] },
        { subcategoryName: 'Console passes', name: 'PlayStation Plus', region: 'GLOBAL', businessType: 'B2C', tags: ['gaming', 'sony'] },
        { subcategoryName: 'Cloud gaming', name: 'GeForce Now', region: 'GLOBAL', businessType: 'B2C', tags: ['gaming', 'cloud'] },
        // Health
        { subcategoryName: 'Gym memberships', name: 'Cult.fit', region: 'INDIA', businessType: 'B2C', tags: ['fitness', 'gym'] },
        { subcategoryName: 'Digital fitness', name: 'Peloton', region: 'GLOBAL', businessType: 'B2C', tags: ['fitness', 'digital'] },
    ];
    const createdProviders = [];
    for (const prov of providers) {
        const subcategory = createdSubcategories.find(s => s.name === prov.subcategoryName);
        if (!subcategory)
            continue;
        const existingProvider = await prisma.subscriptionProvider.findFirst({
            where: { name: prov.name, subcategoryId: subcategory.id },
        });
        const provider = existingProvider ?? await prisma.subscriptionProvider.create({
            data: {
                subcategoryId: subcategory.id,
                name: prov.name,
                region: prov.region,
                businessType: prov.businessType,
                tags: prov.tags,
            },
        });
        createdProviders.push(provider);
    }
    // Plan Types
    const planTypes = [
        { providerName: 'Airtel', name: 'Prepaid', order: 1 },
        { providerName: 'Airtel', name: 'Postpaid', order: 2 },
        { providerName: 'Jio', name: 'Prepaid', order: 1 },
        { providerName: 'Netflix', name: 'Basic', order: 1 },
        { providerName: 'Netflix', name: 'Standard', order: 2 },
        { providerName: 'Netflix', name: 'Premium', order: 3 },
        { providerName: 'ChatGPT', name: 'Plus', order: 1 },
        { providerName: 'ChatGPT', name: 'Pro', order: 2 },
        { providerName: 'AWS', name: 'EC2', order: 1 },
        { providerName: 'Notion', name: 'Personal', order: 1 },
        { providerName: 'Notion', name: 'Team', order: 2 },
        { providerName: 'Xbox Game Pass', name: 'Core', order: 1 },
        { providerName: 'Xbox Game Pass', name: 'Ultimate', order: 2 },
    ];
    const createdPlanTypes = [];
    for (const pt of planTypes) {
        const provider = createdProviders.find(p => p.name === pt.providerName);
        if (!provider)
            continue;
        const existingPlanType = await prisma.subscriptionPlanType.findFirst({
            where: { name: pt.name, providerId: provider.id },
        });
        const planType = existingPlanType ?? await prisma.subscriptionPlanType.create({
            data: {
                providerId: provider.id,
                name: pt.name,
                order: pt.order,
            },
        });
        createdPlanTypes.push(planType);
    }
    // Plans
    const plans = [
        // Airtel Prepaid
        { planTypeName: 'Prepaid', name: '₹299 Prepaid Pack', monthlyCost: 299, billingCycle: 'MONTHLY', features: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'], tags: ['prepaid', 'data', 'calls'] },
        { planTypeName: 'Prepaid', name: '₹889 Family Pack', monthlyCost: 889, billingCycle: 'MONTHLY', features: ['3GB/day', 'Unlimited calls', 'Family sharing', 'Hotstar included'], tags: ['prepaid', 'family', 'ott'] },
        // Netflix
        { planTypeName: 'Basic', name: 'Netflix Basic', monthlyCost: 199, billingCycle: 'MONTHLY', features: ['SD streaming', '1 device'], tags: ['streaming', 'basic'] },
        { planTypeName: 'Standard', name: 'Netflix Standard', monthlyCost: 499, billingCycle: 'MONTHLY', features: ['HD streaming', '2 devices'], tags: ['streaming', 'hd'] },
        { planTypeName: 'Premium', name: 'Netflix Premium', monthlyCost: 649, billingCycle: 'MONTHLY', features: ['4K streaming', '4 devices'], tags: ['streaming', '4k'] },
        // ChatGPT
        { planTypeName: 'Plus', name: 'ChatGPT Plus', monthlyCost: 1650, billingCycle: 'MONTHLY', features: ['GPT-4 access', 'Priority support'], tags: ['ai', 'gpt4'] },
        // AWS
        { planTypeName: 'EC2', name: 'AWS EC2 t3.micro', monthlyCost: 850, billingCycle: 'MONTHLY', features: ['1 vCPU', '1GB RAM', 'Linux'], tags: ['cloud', 'compute'] },
        // Notion
        { planTypeName: 'Personal', name: 'Notion Personal', monthlyCost: 0, billingCycle: 'MONTHLY', features: ['Unlimited blocks', '5GB file uploads'], tags: ['productivity', 'free'] },
        { planTypeName: 'Team', name: 'Notion Team', monthlyCost: 320, billingCycle: 'MONTHLY', features: ['Unlimited team members', '10GB storage'], tags: ['productivity', 'team'] },
        // Xbox
        { planTypeName: 'Ultimate', name: 'Xbox Game Pass Ultimate', monthlyCost: 699, billingCycle: 'MONTHLY', features: ['100+ games', 'EA Play included', 'Cloud gaming'], tags: ['gaming', 'ultimate'] },
    ];
    for (const plan of plans) {
        const planType = createdPlanTypes.find(pt => pt.name === plan.planTypeName);
        if (!planType)
            continue;
        const existingPlan = await prisma.subscriptionPlan.findFirst({
            where: { name: plan.name, planTypeId: planType.id },
        });
        if (!existingPlan) {
            await prisma.subscriptionPlan.create({
                data: {
                    planTypeId: planType.id,
                    name: plan.name,
                    monthlyCost: plan.monthlyCost,
                    billingCycle: plan.billingCycle,
                    features: plan.features,
                    tags: plan.tags,
                },
            });
        }
    }
}
async function seedUserSubscriptions(userId) {
    // Get some plans to create user subscriptions
    const plans = await prisma.subscriptionPlan.findMany({
        take: 8,
        include: {
            planType: {
                include: {
                    provider: {
                        include: {
                            subcategory: {
                                include: {
                                    category: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const userSubs = [];
    for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        const sub = await prisma.userSubscription.create({
            data: {
                userId,
                planId: plan.id,
                usageFrequency: ['DAILY', 'WEEKLY', 'MONTHLY', 'RARELY'][i % 4],
                lastUsed: daysAgo(i * 2),
                autoRenew: i !== 4, // Make one not auto-renew
                nextBillingDate: daysFromNow(Math.floor(Math.random() * 28) + 2),
                notes: i === 0 ? 'Primary mobile plan' : undefined,
            },
        });
        userSubs.push(sub);
    }
    return userSubs;
}
async function seedValueScores(userId) {
    const userSubs = await prisma.userSubscription.findMany({
        where: { userId },
        include: { plan: true }
    });
    const scoreMap = {
        'Netflix Premium': { eff: 88, waste: 12, cpu: 2.1, usage: 80 },
        'ChatGPT Plus': { eff: 82, waste: 18, cpu: 8.5, usage: 80 },
        'AWS EC2 t3.micro': { eff: 34, waste: 66, cpu: 42.0, usage: 25 },
        'Notion Team': { eff: 91, waste: 9, cpu: 1.2, usage: 100 },
        'Xbox Game Pass Ultimate': { eff: 79, waste: 21, cpu: 3.8, usage: 80 },
    };
    for (const sub of userSubs) {
        const m = scoreMap[sub.plan.name] ?? { eff: 70, waste: 30, cpu: 5, usage: 70 };
        await prisma.valueScore.create({
            data: {
                userSubscriptionId: sub.id,
                efficiencyScore: m.eff,
                wastePercentage: m.waste,
                costPerUse: m.cpu,
                usageScore: m.usage,
                recommendationScore: m.eff,
                overallScore: m.eff,
            },
        });
    }
}
async function seedUsageLogs(userId) {
    const userSubs = await prisma.userSubscription.findMany({
        where: { userId },
        include: { plan: true }
    });
    const usagePairs = [
        { name: 'Netflix Premium', hours: 2.5, features: ['Video streaming', '4K HDR'] },
        { name: 'ChatGPT Plus', hours: 0.8, features: ['AI chat', 'Code generation'] },
        { name: 'Notion Team', hours: 1.5, features: ['Notes', 'Database'] },
        { name: 'Xbox Game Pass Ultimate', hours: 3.2, features: ['Gaming', 'Multiplayer'] },
    ];
    for (const pair of usagePairs) {
        const sub = userSubs.find(s => s.plan.name === pair.name);
        if (!sub)
            continue;
        for (let i = 0; i < 5; i++) {
            await prisma.usageLog.create({
                data: {
                    userId,
                    userSubscriptionId: sub.id,
                    sessionDate: daysAgo(i * 2),
                    durationHours: pair.hours + (Math.random() - 0.5) * 0.5,
                    featuresUsed: pair.features,
                },
            });
        }
    }
}
async function seedRecommendations(userId) {
    const userSubs = await prisma.userSubscription.findMany({
        where: { userId },
        include: { plan: true }
    });
    const awsSub = userSubs.find(s => s.plan.name.includes('AWS'));
    const netflixSub = userSubs.find(s => s.plan.name.includes('Netflix'));
    const recs = [
        { userSubscriptionId: awsSub?.id, type: 'CANCEL', title: 'AWS EC2 instance idle 78% of time', description: 'Your AWS instance shows very low utilisation. Consider switching to on-demand or serverless.', savingAmount: 2200, impactScore: 88 },
        { userSubscriptionId: netflixSub?.id, type: 'DOWNGRADE', title: 'Switch Netflix Premium to Standard', description: 'You primarily watch on mobile. The Standard plan saves ₹150/mo with no quality loss.', savingAmount: 150, impactScore: 92 },
        { type: 'OVERLAP_DETECTED', title: 'Multiple streaming services detected', description: 'Netflix + Prime Video overlap. Consider consolidating to save costs.', savingAmount: 438, impactScore: 79 },
        { type: 'COST_OPTIMIZATION', title: 'Notion annual plan saves 20%', description: 'Switch to annual billing and save ₹768/year on your Notion subscription.', savingAmount: 64, impactScore: 70 },
        { type: 'COMPLEMENTARY', title: 'Add Spotify for better value', description: 'Your Netflix subscription could be complemented with Spotify for ₹119/mo.', savingAmount: 0, impactScore: 65 },
    ];
    for (const r of recs) {
        await prisma.recommendation.create({
            data: { userId, expiresAt: daysFromNow(7), ...r },
        });
    }
}
async function seedLedgerRecords(userId) {
    const userSubs = await prisma.userSubscription.findMany({
        where: { userId },
        take: 5,
        include: { plan: true }
    });
    const blocks = ['284991042', '284991018', '284880001', '284500992', '284100033'];
    for (let i = 0; i < userSubs.length; i++) {
        const sub = userSubs[i];
        const txHash = crypto_1.default.createHash('sha256')
            .update(`${sub.id}:${sub.plan.monthlyCost}:${Date.now() + i}`)
            .digest('hex');
        await prisma.ledgerRecord.create({
            data: {
                userId,
                userSubscriptionId: sub.id,
                txHash,
                blockNumber: blocks[i],
                network: 'solana-devnet',
                status: 'CONFIRMED',
                amount: sub.plan.monthlyCost,
                description: `Monthly billing — ${sub.plan.name}`,
                confirmedAt: daysAgo(i * 3),
                metadata: { source: 'local', verified: true },
            },
        });
    }
}
async function seedNotifications(userId) {
    await prisma.notification.createMany({
        data: [
            { userId, type: 'WASTE_ALERT', title: 'AWS EC2 is idle', body: 'Your AWS instance hasn\'t been used in 45 days.', isRead: false },
            { userId, type: 'RECOMMENDATION', title: 'New recommendation ready', body: 'Switch Netflix to Standard Plan and save ₹150/mo.', isRead: false },
            { userId, type: 'BILLING_REMINDER', title: 'ChatGPT Plus renews soon', body: 'Your ChatGPT Plus subscription renews in 3 days.', isRead: true },
            { userId, type: 'BLOCKCHAIN_CONFIRMED', title: 'Transaction confirmed', body: 'Netflix billing hash confirmed on Solana devnet.', isRead: true },
        ],
    });
}
async function seedAnalyticsSnapshot(userId) {
    await prisma.analyticsSnapshot.upsert({
        where: { userId_period_granularity: { userId, period: '2026-05', granularity: 'monthly' } },
        create: {
            userId,
            period: '2026-05',
            granularity: 'monthly',
            totalSpend: 7265,
            totalWaste: 2179.5,
            wastePercent: 29.9,
            avgScore: 75.3,
            categoryBreakdown: [
                { name: 'Mobile plans', value: 1188 },
                { name: 'Global SVOD', value: 649 },
                { name: 'Consumer AI plans', value: 1650 },
                { name: 'Cloud computing', value: 850 },
                { name: 'Productivity tools', value: 320 },
                { name: 'Gaming subscriptions', value: 699 },
            ],
            topWastedService: 'AWS EC2 t3.micro',
            recoveredValue: 0,
        },
        update: {},
    });
}
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}
function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map