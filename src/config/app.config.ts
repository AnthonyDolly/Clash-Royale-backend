export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  defaultLimit: +process.env.DEFAULT_LIMIT || 10,
  clashRoyaleApiKey: process.env.CLASH_ROYALE_API_KEY,
  clashRoyaleMailApiKey: process.env.CLASH_ROYALE_MAIL_API_KEY,
  fromEmail: process.env.FROM_EMAIL,
});
