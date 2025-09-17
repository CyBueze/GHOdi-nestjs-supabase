"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var dotenv = require("dotenv");
dotenv.config();
var supabase_js_1 = require("@supabase/supabase-js");
var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
}
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
