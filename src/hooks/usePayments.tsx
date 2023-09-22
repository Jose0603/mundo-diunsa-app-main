import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ISelect } from "../interfaces/rrhh/ISelect";
import { queryClient } from "../Configs/QueryClient";
import { QueryKeys } from "../Helpers/QueryKeys";
import { AuthState } from "../Redux/reducers/auth/loginReducer";
import { GetPayrollCodesByEmpCode } from "../Services/rrhh/Payments";

export default function usePayments() {
  const dispatch = useDispatch();
  const loginstate: AuthState = useSelector((state: any) => state.auth.login);

  const RefetchQuery = async (queryKey: string) => {
    await queryClient.refetchQueries(queryKey);
  };

  return {
    Payrolls: useQuery<ISelect[], Error>(QueryKeys.PAYROLLS, () =>
      GetPayrollCodesByEmpCode()
    ),
    RefetchQuery,
  };
}
