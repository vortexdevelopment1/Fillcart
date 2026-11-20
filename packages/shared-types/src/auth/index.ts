export type AccountType =
  | "CUSTOMER"
  | "VENDOR_APPLICANT"
  | "RIDER_APPLICANT"
  | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "PENDING_APPROVAL";

export type OperationalAudience =
  | "customer-backend"
  | "vendor-backend"
  | "rider-backend"
  | "admin-backend";

export type ApplicantAudience =
  | "vendor-onboarding"
  | "rider-onboarding";

export type TokenAudience = OperationalAudience | ApplicantAudience;

export interface UserAccessTokenClaims {
  sub: string;
  iss: string;
  aud: TokenAudience;
  iat: number;
  nbf: number;
  exp: number;
  jti: string;
  token_use: "access";
  session_id: string;
  account_type: AccountType;
  account_status: UserStatus;
  role?: string;
  permissions?: string[];
}

export interface ServiceAssertionClaims {
  iss: string;
  sub: string;
  aud: "central-auth";
  iat: number;
  nbf: number;
  exp: number;
  jti: string;
}

export interface JwkPublicKey {
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  kid: string;
  use?: string;
  alg?: string;
}

export interface JwksResponse {
  keys: JwkPublicKey[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LiveSessionVerificationResponse {
  valid: boolean;
  authorized?: boolean;
  userId?: string;
  sessionId?: string;
  accountType?: AccountType;
  status?: UserStatus;
  role?: string;
  permissions?: string[];
  reason?: string;
}
