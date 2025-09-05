import { UserPermissions } from "./user-permissions.model";

export interface PermissionsDiff {
  userId: string;
  before: UserPermissions;
  after: UserPermissions;
  changedFields: (keyof UserPermissions)[];
}
