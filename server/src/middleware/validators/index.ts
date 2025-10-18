import { loginValidation } from "@/middleware/validators/auth/login.validator"
import { registerValidation } from "@/middleware/validators/auth/register.validator"
import { oauthValidation } from "@/middleware/validators/auth/oauth.validator"

export default {
  registerValidation,
  loginValidation,
  oauthValidation
}