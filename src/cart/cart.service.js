"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
var common_1 = require("@nestjs/common");
var supabase_client_1 = require("../db/supabase.client");
var CartService = /** @class */ (function () {
    function CartService() {
    }
    CartService.prototype.addToCart = function (id, quantity, req) {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        console.log(req.session.cart);
        var existingItem = req.session.cart.find(function (item) { return item.id === id; });
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            req.session.cart.push({ id: id, quantity: quantity });
        }
        return { message: 'Item added to cart', cart: req.session.cart, layout: false };
    };
    CartService.prototype.getCart = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var cart, ids, _a, drugs, error, drugMap, detailedCart, regSum, bhisSum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cart = req.session.cart || [];
                        // Validate cart structure
                        if (!Array.isArray(cart) || cart.some(function (item) { return !item.id || !item.quantity; })) {
                            console.error('Invalid cart structure');
                            return [2 /*return*/, { cart: [], regSum: 0, bhisSum: 0 }];
                        }
                        if (cart.length === 0) {
                            return [2 /*return*/, { cart: [], regSum: 0, bhisSum: 0 }];
                        }
                        ids = cart.map(function (item) { return item.id; });
                        // Handle empty IDs array
                        if (ids.length === 0) {
                            return [2 /*return*/, { cart: [], regSum: 0, bhisSum: 0 }];
                        }
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('drugs')
                                .select('id, name, regPrice, bhisPrice')
                                .in('id', ids)];
                    case 1:
                        _a = _b.sent(), drugs = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching drugs', error);
                            return [2 /*return*/, { cart: [], regSum: 0, bhisSum: 0 }];
                        }
                        // Check if drugs is null or undefined
                        if (!drugs || !Array.isArray(drugs)) {
                            console.error('No drugs found or invalid response from Supabase');
                            return [2 /*return*/, { cart: [], regSum: 0, bhisSum: 0 }];
                        }
                        drugMap = new Map(drugs.map(function (d) { return [d.id, d]; }));
                        detailedCart = cart
                            .map(function (item) {
                            var drug = drugMap.get(item.id);
                            if (!drug) {
                                console.warn("Drug with ID ".concat(item.id, " not found in database"));
                                return null;
                            }
                            return {
                                id: item.id,
                                name: drug.name,
                                regPrice: Number(drug.regPrice),
                                bhisPrice: Number(drug.bhisPrice),
                                quantity: item.quantity,
                                regTotal: item.quantity * Number(drug.regPrice),
                                bhisTotal: item.quantity * Number(drug.bhisPrice),
                            };
                        })
                            .filter(function (item) { return item !== null; });
                        regSum = detailedCart.reduce(function (sum, item) { return sum + item.regTotal; }, 0);
                        bhisSum = detailedCart.reduce(function (sum, item) { return sum + item.bhisTotal; }, 0);
                        return [2 /*return*/, {
                                cart: detailedCart,
                                regSum: regSum,
                                bhisSum: bhisSum,
                            }];
                }
            });
        });
    };
    CartService = __decorate([
        (0, common_1.Injectable)()
    ], CartService);
    return CartService;
}());
exports.CartService = CartService;
