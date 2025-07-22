export interface BoardStub {
  id: string;
  name: string;
  description: string;
  companyId: string;
  headFullName: string;
  boardType: number;
  isPrivate: boolean;
  creationDate: string;
  updateDate?: string;
  deleteDate?: string;
}
