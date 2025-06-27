interface PermissionsDiff {
  userId: number;
  before: UserPermissions;
  after: UserPermissions;
  changedFields: (keyof UserPermissions)[];
}
