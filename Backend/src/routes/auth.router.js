import express from "express";
import { forgotPassword, login, register, resetPassword, verifyEmail } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const auth_router = express.Router()

auth_router.post(
    '/register',
    register
)

auth_router.post(
    '/login',
    login,
)

auth_router.get(
    '/verify-email/:verify_email_token',
    verifyEmail
)

auth_router.post(
    '/forgot-password',
    forgotPassword
)

auth_router.post(
    '/reset-password',
    resetPassword
)

export default auth_router