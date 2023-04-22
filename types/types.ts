export type FormType = "login" | "register";

export interface IShiftState {
  shiftId: string | null;
  timestamp: string | null;
}

export interface IAdmin {
  uid: string;
  name: string;
  avatarUrl?: string;
}

export interface Event<T = EventTarget> {
  target: T;
}

export interface IVisit {
  id: string;
  employee: string;
  visitType: string;
  price: number;
  payloadType: string;
  timestamp: string;
}

export interface ISale {
  id: string;
  title: string;
  price: string;
  payloadType: string;
  timestamp: string;
}

export interface IWorkShift {
  admin: string;
  sales: ISale[];
  timestamp: string;
  visits: IVisit[];
}

export interface IEmployee {
  name: string;
}
