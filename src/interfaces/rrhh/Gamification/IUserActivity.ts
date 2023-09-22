export interface IUserActivity {
  id: number;
  createdAt: string;
  updatedAt: string;
  points: number;
  status: boolean;
  userId: number;
  activityId: number;
  activityObject: string;
  activityFk: number;
  userCompleteName: string;
  firstName: string;
  lastName: string;
  activityName: string;
  activityCode: string;
  objectName: string;
  objectApplyMultiplier: boolean;
}
