import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"
import mailer_transporter from "../config/mailer.config.js"
import user_repository from "../repositories/user.repository.js"
import ServerError from "../utils/error.util.js"
import { generateHash } from "../utils/bcrypt.util.js"

const RESET_TOKEN_EXPIRATION = "1h"
const MIN_PASSWORD_LENGTH = 8

/* 
Solicitar el restablecimiento de contraseña.
Si el email no existe (o el usuario está desactivado) no se envía el mail,
pero el controller responde igual para no revelar qué emails están registrados.
*/
export async function requestPasswordReset(email) {
    if (!email || typeof email !== "string") {
        throw new ServerError("Email is required", 400)
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new ServerError("Email is incorrect", 400)
    }

    const user = await user_repository.getByEmail(email)

    if (!user || !user.activo) {
        return { email_sent: false }
    }

    const reset_token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            // Nos permite diferenciar este token de un token de sesión
            purpose: "password_reset"
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        {
            expiresIn: RESET_TOKEN_EXPIRATION
        }
    )

    const frontend_url = ENVIRONMENT.URL_FRONTEND.replace(/\/$/, "")
    const reset_link = `${frontend_url}/reset-password?reset_token=${encodeURIComponent(reset_token)}`

    try {
        await mailer_transporter.sendMail(
            {
                to: user.email,
                from: ENVIRONMENT.GMAIL_USER,
                subject: "Restablecé tu contraseña",
                html: `
                <body>
                <h1>Restablecé tu contraseña</h1>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                <a href="${reset_link}">Click aquí para crear una nueva contraseña</a>
                <p>Este enlace expira en 1 hora. Si no solicitaste este cambio, ignorá este correo.</p>
                </body>
                `
            }
        )
    } catch (error) {
        // No propagamos el error para no revelar si el email existe
        console.error("[requestPasswordReset] Error enviando el mail:", error)
        return { email_sent: false }
    }

    return { email_sent: true }
}

/* 
Restablecer la contraseña usando el token que llegó por mail.
*/
export async function resetPassword(reset_token, new_password) {
    if (!reset_token || typeof reset_token !== "string") {
        throw new ServerError("Reset token is required", 400)
    }

    if (!new_password || typeof new_password !== "string") {
        throw new ServerError("Password is required", 400)
    }

    if (new_password.length < MIN_PASSWORD_LENGTH) {
        throw new ServerError(
            `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
            400
        )
    }

    let token_payload

    try {
        token_payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY)
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ServerError("El enlace de restablecimiento expiró", 400)
        }

        if (
            error instanceof jwt.JsonWebTokenError
            ||
            error instanceof jwt.NotBeforeError
        ) {
            throw new ServerError("Token de restablecimiento inválido", 400)
        }

        throw error
    }

    // El token debe haberse creado específicamente para resetear la contraseña
    if (token_payload.purpose !== "password_reset") {
        throw new ServerError("Token de restablecimiento inválido", 400)
    }

    const user = await user_repository.getById(token_payload.id)

    if (!user || user.email !== token_payload.email) {
        throw new ServerError("Token de restablecimiento inválido", 400)
    }

    if (!user.activo) {
        throw new ServerError(
            "Usuario desactivado de la plataforma, contactate con soporte si consideras que esto es un error",
            403
        )
    }

    const password_hash = await generateHash(new_password)

    await user_repository.updatePasswordById(user._id, password_hash)

    return { user_id: user._id }
}
