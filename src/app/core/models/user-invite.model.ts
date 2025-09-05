export interface UserInviteDto {
  fullName: string;
  email: string;
  roles: string[];
  language?: string;
  customMessage?: string;
}
