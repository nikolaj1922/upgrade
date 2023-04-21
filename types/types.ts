export type FormType = "login" | "register";

export interface IAdmin {
  uid: string;
  name: string;
  avatarUrl?: string;
}

export interface Event<T = EventTarget> {
  target: T;
}

export interface IVisits {
  id: string;
  employee: string;
  visitType: string;
  price: number;
  payloadType: string;
  timestamp: string;
}

export interface IWorkShift {
  admin: string;
  sales: [];
  timestamp: string;
  visits: IVisits[];
}

export interface IEmployee {
  name: string;
}
