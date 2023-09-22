import { IOption } from './shared/IOption';

export interface SubCategory {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: number;
  name: string;
  categoryId: number;
  estimatedEndTime: number;
  category?: Category;
  tickets: IIncident[];
  workGroups: null[];
}

export interface WorkGroupUserNavigation {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: number;
  name: string;
  subCategoryId: number;
  subCategory: SubCategory;
  users: null[];
}

export interface UploadedByNavigation {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  username: string;
  employeeCode: string;
  workGroupUser: number;
  workGroupUserNavigation: WorkGroupUserNavigation;
}

export interface IImage {
  id: number;
  mimeType: string;
  name: string;
  uploadedBy: string;
}

export interface File {
  id: number;
  name: string;
  mimeType: string;
  uploadedBy: string;
  uploadedByNavigation: UploadedByNavigation;
  ticketFiles: null[];
}

export interface TicketFile {
  id: number;
  ticketId: number;
  fileId: number;
  file: File;
  ticket: IIncident;
}

export interface IIncident {
  createdBy: string;
  updatedBy: string;
  id: number;
  endDate: string;
  subCategoryId: number;
  subCategoryName: string;
  storeId: number;
  storeName: string;
  assignedToName: string;
  observations: string;
  priority: IOption;
  status: number;
  assignedTo: string;
  logTickets: LogTicket[];
  ticketFiles?: TicketFile[];
  estimatedEndTime?: string;
  createdAt?: string;
  updatedAt?: string;
  tUuid?: string;
  images?: IImage[];
}

export interface Area {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: number;
  name: string;
  categories: Category[];
}

export interface Category {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: number;
  name: string;
  areaName: string;
  areaId: number;
  subCategories: SubCategory[];
}

export interface LogTicket {
  id: number;
  description: string;
  type: string;
  ticketId: number;
  userId: string;
  createdAt: string;
}

export interface PagedData<T> {
  pageInfo: PageInfo;
  rows: T[];
}

export interface PageInfo {
  count: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface ISavingIncident {
  observations: string;
  priority: number;
  subCategoryId: number;
  storeId: number;
  status: number;
  files: any[];
}

export interface IResponseTicket {
  id: number;
  response: boolean;
}

export interface ITicketSummary {
  total: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  finished: number;
}

export interface ISavingSolution {
  id?: number;
  description: string;
  subcategoryId: number;
}

export interface ISolution {
  id: number;
  description: string;
  subcategoryId: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReminder {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  ExpiracyDate: string;
  PublishDate: string;
}

export interface ISurvey {
  id: number;
  title: string;
  description: string;
  link: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}