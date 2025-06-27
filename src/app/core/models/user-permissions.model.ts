import { AccessLevel } from './access-level.model';

export interface UserPermissions {
  tasks: AccessLevel;
  board: AccessLevel;
  members: AccessLevel;
}
