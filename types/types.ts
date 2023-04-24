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

export type PayloadType = "total" | "card" | "cash" | "kaspi";

export interface IVisit {
  id: string;
  employee: string;
  visitType: string;
  price: number;
  payloadType: PayloadType;
  timestamp: string;
}

export interface ISale {
  id: string;
  title: string;
  price: number;
  payloadType: PayloadType;
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

export interface ICashboxSlice {
  generalTotal: number;
  generalCash: number;
  generalCard: number;
  generalKaspi: number;
  visitsTotal: number;
  visitsCash: number;
  visitsCard: number;
  visitsKaspi: number;
  salesTotal: number;
  salesCash: number;
  salesCard: number;
  salesKaspi: number;
  paintTotal: number;
}
