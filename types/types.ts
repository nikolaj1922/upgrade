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

export type PayloadType = "total" | "card" | "cash" | "kaspi" | "signIn";

export type DataType =
  | "visits"
  | "salesMen"
  | "salary"
  | "paint"
  | "general"
  | "archive"
  | "employees";

export type SubFrom = "visits" | "salesMen" | "paint" | "general";

export interface IVisit {
  id: string;
  paintId: string;
  employee: string;
  visitType: string;
  price: number;
  payloadType: PayloadType;
  timestamp: string;
  paintValue: number;
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
  id: string;
}

export interface ICashboxSlice {
  generalShiftTotal: number;
  visitsTotal: number;
  visitsCash: number;
  visitsCard: number;
  visitsKaspi: number;
  salesMenTotal: number;
  salesMenCash: number;
  salesMenCard: number;
  salesMenKaspi: number;
  paintTotal: number;
  paintCash: number;
  paintCard: number;
  paintKaspi: number;
  employeeSalaryPaint: {
    id: string;
    employee: string;
    value: number;
  }[];
}

export interface ISalary {
  employee: string;
  revenue: number;
  paint: number;
}

export interface IPaint {
  id: string;
  payloadType: PayloadType;
  employee: string;
  title: string;
  price: number;
  timestamp: string;
  type: string;
}

export interface IGeneral {
  id: string;
  title: string;
  price: number;
  timestamp: string;
}

export interface IArchiveData {
  admin: string;
  generalShift: IGeneral[];
  paint: IPaint[];
  paintStartSum: number;
  salesMStartSum: number;
  shiftGeneralStartSum: number;
  paintEndSum: number;
  salesMEndSum: number;
  shiftGeneralEndSum: number;
  salesMen: ISale[];
  timestamp: string;
  visits: IVisit[];
}
