export type IUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  roles: [{ id: string; name: string; createdAt: number }];
  type: string;
  idStore?: number;
  createdAt: number;
  createdBy: number;
  allowDelete: boolean;
  allowUpdate: boolean;
  isManager?: boolean;
  storeName: string;
}

export enum UserType {
  CUSTOMER,
  ADMIN,
  OTHER,
}

export interface IUpdatePass {
  oldPass: string;
  newPass: string;
}

export interface IGrantedPermisson {
  product?: string[];
  category?: string[];
  staff?: string[];
  role?: string[];
  order?: string[];
  store?: string[];
}
