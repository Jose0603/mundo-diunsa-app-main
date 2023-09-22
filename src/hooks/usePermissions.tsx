/* eslint-disable no-restricted-syntax */
import {useState} from "react";
import {useSelector} from "react-redux";
import {AuthState} from "../Redux/reducers/auth/loginReducer";
import {RootState} from "../Redux/reducers/rootReducer";
import * as functions from "../Helpers/SearchFunctions";

// function usePermissions<T = any[]>(permissions: T) {
//   const [state] = useState(permissions ?? []);

//   const hasAll = functions.hasAll(state as any);
//   const hasAny = functions.hasAny(state as any);
//   const doesNotHaveAll = functions.doesNotHaveAll(state as any);
//   const doesNotHaveAny = functions.doesNotHaveAny(state as any);

//   return { hasAny, hasAll, doesNotHaveAny, doesNotHaveAll };
// }

// export default usePermissions;

export const useHasPermissions = (permissionNames: string | string[]) => {
  const auth: AuthState = useSelector((state: RootState) => state.auth.login);

  const {permissions} = auth;

  if (!permissions || permissions.length === 0) {
    return false;
  }
  if (!Array.isArray(permissionNames)) {
    return permissions.includes?.(permissionNames);
  } else if (Array.isArray(permissionNames)) {
    return permissions.some((permissionName) =>
      Boolean(permissionNames.includes?.(permissionName))
    );
  } else {
    return false;
  }
};
