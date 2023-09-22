export interface IParams {
  Page?: number;
  Limit?: number;
}

export interface IIncidentParams extends IParams {
  Status?: number;
  SubCategory?: number;
}

export interface ITimeParams {
  StartDate?: string;
  EndDate?: string;
}

export interface IRequestParams extends IParams, ITimeParams {
  Status?: string;
  Category?: string;
  SearchParam?: string;
}

export interface IGeneralParams extends IParams, ITimeParams {}
