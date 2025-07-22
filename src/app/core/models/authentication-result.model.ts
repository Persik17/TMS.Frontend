export interface AuthenticationResultViewModel {
  userId?: string;
  companyId?: string;
  success: boolean;
  token?: string;
  error?: string;
  verificationId?: string;
  expiration?: string;
}
