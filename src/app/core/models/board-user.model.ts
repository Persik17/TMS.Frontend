interface BoardUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  permissions: UserPermissions;
}
