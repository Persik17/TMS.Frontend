import { UserPermissions } from "./user-permissions.model";

export interface PermissionsDiff {
  userId: number;
  before: UserPermissions;
  after: UserPermissions;
  changedFields: (keyof UserPermissions)[];
}
