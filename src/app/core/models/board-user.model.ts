import { UserPermissions } from "./user-permissions.model";

export interface BoardUser {
  id: string;
  name: string;
  email: string;
  status: string;
  permissions: UserPermissions;
}
