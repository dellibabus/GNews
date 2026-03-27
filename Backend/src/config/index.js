import 'dotenv/config'

export const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  serverSourceName: process.env.SERVER_SOURCE_NAME || 'GNews-RSS-Bot/1.0',
  expectedClientSource: process.env.EXPECTED_CLIENT_SOURCE || 'GNews-Web',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
  feedRefreshMinutes: parseInt(process.env.FEED_REFRESH_MINUTES, 10) || 10,

  // Admin
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@GNews123',
  jwtSecret: process.env.JWT_SECRET || 'gnews-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
}
