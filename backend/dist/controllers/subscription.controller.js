"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlans = exports.listPlanTypes = exports.listProviders = exports.listSubcategories = exports.listCategories = exports.recalculateScore = exports.getScore = exports.remove = exports.update = exports.getById = exports.create = exports.list = void 0;
const SubService = __importStar(require("../services/subscription.service"));
const response_1 = require("../utils/response");
const list = async (req, res, next) => {
    try {
        const result = await SubService.listSubscriptions(req.user.id, req.query);
        (0, response_1.sendPaginated)(res, result.items, result.total, result.page, result.pageSize);
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
const create = async (req, res, next) => {
    try {
        (0, response_1.sendCreated)(res, await SubService.createSubscription(req.user.id, req.body));
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
const getById = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.getSubscription(req.params.id, req.user.id));
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
const update = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.updateSubscription(req.params.id, req.user.id, req.body), { message: 'Updated' });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await SubService.deleteSubscription(req.params.id, req.user.id);
        (0, response_1.sendSuccess)(res, null, { message: 'Subscription deleted' });
    }
    catch (e) {
        next(e);
    }
};
exports.remove = remove;
const getScore = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.getSubscriptionScore(req.params.id, req.user.id));
    }
    catch (e) {
        next(e);
    }
};
exports.getScore = getScore;
const recalculateScore = async (req, res, next) => {
    try {
        const { ValueScoringService } = await Promise.resolve().then(() => __importStar(require('../services/valueScoring.service')));
        const score = await ValueScoringService.calculateAndStore(req.params.id);
        (0, response_1.sendSuccess)(res, score, { message: 'Score recalculated' });
    }
    catch (e) {
        next(e);
    }
};
exports.recalculateScore = recalculateScore;
// Taxonomy endpoints
const listCategories = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.listCategories(req.query));
    }
    catch (e) {
        next(e);
    }
};
exports.listCategories = listCategories;
const listSubcategories = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.listSubcategories(req.params.categoryId, req.query));
    }
    catch (e) {
        next(e);
    }
};
exports.listSubcategories = listSubcategories;
const listProviders = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.listProviders(req.params.subcategoryId, req.query));
    }
    catch (e) {
        next(e);
    }
};
exports.listProviders = listProviders;
const listPlanTypes = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.listPlanTypes(req.params.providerId, req.query));
    }
    catch (e) {
        next(e);
    }
};
exports.listPlanTypes = listPlanTypes;
const listPlans = async (req, res, next) => {
    try {
        (0, response_1.sendSuccess)(res, await SubService.listPlans(req.params.planTypeId, req.query));
    }
    catch (e) {
        next(e);
    }
};
exports.listPlans = listPlans;
//# sourceMappingURL=subscription.controller.js.map