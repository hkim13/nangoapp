export interface UserSession {
  id: string;
  userId: string;
  sessionId: string;
  lastActive: Date;
  expiresAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NangoConnection {
  connectionId: string;
  sessionId: string;
  providerConfigKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
