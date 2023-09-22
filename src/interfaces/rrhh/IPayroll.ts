import { IPayrollDetail } from "./IPayrollDetail";

export interface IPayroll {
  empCode: string;
  empId: number;
  payrollCode: string;
  period: string;
  total: number;
  detail: IPayrollDetail[];
}
