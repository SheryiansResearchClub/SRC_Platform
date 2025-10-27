import { discordUserClient, discordTokenClient, getDiscordAuthorizationUrl } from "@/integrations/discord/oauth.client"
import { passport, configurePassport } from "@/integrations/google/oauth.client"

export default {
  discordUserClient,
  discordTokenClient,
  getDiscordAuthorizationUrl,
  passport,
  configurePassport
}