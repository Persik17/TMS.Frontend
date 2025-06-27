import { Task } from './task.model';

export type BoardTask = Task & { loading?: boolean };
