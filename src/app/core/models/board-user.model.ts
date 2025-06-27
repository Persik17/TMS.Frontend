import { UserPermissions } from "./user-permissions.model";

export interface BoardUser {
  id: number;
  name: string;
  email: string;
  status: string;
  permissions: UserPermissions;
}
