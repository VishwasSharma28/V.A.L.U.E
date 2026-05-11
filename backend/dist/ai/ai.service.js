"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIRecommendations = generateAIRecommendations;
exports.summariseSubscription = summariseSubscription;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
// ─── OpenAI Client (lazy init) ─────────────────────────────
let _openai = null;
function getClient() {
    if (!_openai) {
        if (!env_1.env.OPENAI_API_KEY)
            throw new Error('OPENAI_API_KEY not configured');
        _openai = new openai_1.default({ apiKey: env_1.env.OPENAI_API_KEY });
    }
    return _openai;
}
/**
 * Generate AI-powered recommendations using OpenAI.
 * Falls back to rule-based recommendations if API key missing.
 */
async function generateAIRecommendations(input) {
    if (!env_1.env.OPENAI_API_KEY) {
        logger_1.logger.warn('OpenAI key missing — using rule-based recommendations');
        return ruleBasedRecommendations(input);
    }
    try {
        const client = getClient();
        const prompt = buildRecommendationPrompt(input);
        const response = await client.chat.completions.create({
            model: env_1.env.OPENAI_MODEL,
            messages: [
                { role: 'system', content: 'You are a financial intelligence AI for the V.A.L.U.E platform. Analyse subscription data and return JSON recommendations.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 1500,
        });
        const text = response.choices[0].message.content ?? '{}';
        const parsed = JSON.parse(text);
        return (parsed.recommendations ?? []);
    }
    catch (err) {
        logger_1.logger.error('OpenAI error:', err);
        return ruleBasedRecommendations(input);
    }
}
function buildRecommendationPrompt(input) {
    return `
Analyse these subscriptions for the user (currency: ${input.currency}):
${JSON.stringify(input.subscriptions, null, 2)}

Total monthly spend: ${input.currency} ${input.totalMonthlySpend}
Average efficiency score: ${input.avgScore}/100

Return a JSON object with a "recommendations" array. Each recommendation must have:
- type: DOWNGRADE | CANCEL | UNUSED_BENEFIT | OVERLAP_DETECTED | COST_OPTIMIZATION
- title: short actionable title
- description: 1-2 sentence explanation
- savingAmount: estimated monthly saving in numbers
- impactScore: 0-100

Generate 4-8 high-quality, specific, actionable recommendations.
`.trim();
}
/** Rule-based fallback when no OpenAI key */
function ruleBasedRecommendations(input) {
    const recs = [];
    for (const sub of input.subscriptions) {
        if (sub.usageFrequency === 'NEVER' || sub.wastePercentage > 70) {
            recs.push({
                type: 'CANCEL',
                title: `Consider cancelling ${sub.serviceName}`,
                description: `${sub.serviceName} shows very low usage. Cancelling could save ${input.currency} ${sub.monthlyCost}/mo.`,
                savingAmount: sub.monthlyCost,
                impactScore: 85,
            });
        }
        else if (sub.usageFrequency === 'RARELY' && sub.monthlyCost > 200) {
            recs.push({
                type: 'DOWNGRADE',
                title: `Downgrade ${sub.serviceName} to a cheaper plan`,
                description: `Usage is rare but cost is high. A lower tier could save ~30%.`,
                savingAmount: sub.monthlyCost * 0.3,
                impactScore: 70,
            });
        }
        // OTT overlap detection
        const ottSubs = input.subscriptions.filter(s => s.category === 'OTT');
        if (ottSubs.length > 2) {
            recs.push({
                type: 'OVERLAP_DETECTED',
                title: `You have ${ottSubs.length} OTT subscriptions — consider consolidating`,
                description: 'Multiple streaming services often overlap. Pick your top 2 and pause the rest.',
                savingAmount: ottSubs.sort((a, b) => a.monthlyCost - b.monthlyCost)[0].monthlyCost,
                impactScore: 75,
            });
            break;
        }
    }
    return recs;
}
/** Summarise a single subscription in natural language */
async function summariseSubscription(serviceName, score, spend, currency) {
    if (!env_1.env.OPENAI_API_KEY) {
        return `${serviceName} has an efficiency score of ${score}/100 costing ${currency} ${spend}/mo.`;
    }
    try {
        const client = getClient();
        const res = await client.chat.completions.create({
            model: env_1.env.OPENAI_MODEL,
            messages: [{ role: 'user', content: `Summarise this subscription in one punchy sentence for a fintech dashboard: ${serviceName}, score ${score}/100, cost ${currency} ${spend}/mo.`
                }],
            max_tokens: 80,
        });
        return res.choices[0].message.content?.trim() ?? '';
    }
    catch {
        return `${serviceName} — score ${score}/100`;
    }
}
//# sourceMappingURL=ai.service.js.map