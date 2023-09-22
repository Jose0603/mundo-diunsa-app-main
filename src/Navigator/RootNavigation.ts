import { createNavigationContainerRef, DrawerActions, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function push(...args: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  }
}
export function goBack(...args: any) {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function toggleDrawer(...args: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.toggleDrawer());
  }
}
