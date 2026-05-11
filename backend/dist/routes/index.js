"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_routes_1 = __importDefault(require("./auth.routes"));
const subscription_routes_1 = __importDefault(require("./subscription.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const ledger_routes_1 = __importDefault(require("./ledger.routes"));
const recommendation_routes_1 = __importDefault(require("./recommendation.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const sharedPlan_routes_1 = __importDefault(require("./sharedPlan.routes"));
const settings_routes_1 = __importDefault(require("./settings.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const usage_routes_1 = __importDefault(require("./usage.routes"));
const API = '/api/v1';
function registerRoutes(app) {
    app.use(`${API}/auth`, auth_routes_1.default);
    app.use(`${API}/subscriptions`, subscription_routes_1.default);
    app.use(`${API}/analytics`, analytics_routes_1.default);
    app.use(`${API}/dashboard`, dashboard_routes_1.default);
    app.use(`${API}/ledger`, ledger_routes_1.default);
    app.use(`${API}/recommendations`, recommendation_routes_1.default);
    app.use(`${API}/notifications`, notification_routes_1.default);
    app.use(`${API}/shared-plans`, sharedPlan_routes_1.default);
    app.use(`${API}/settings`, settings_routes_1.default);
    app.use(`${API}/uploads`, upload_routes_1.default);
    app.use(`${API}/usage`, usage_routes_1.default);
}
//# sourceMappingURL=index.js.map