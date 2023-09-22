import API from '../../Axios';
import { IResponseModel } from '../../interfaces/IResponseModel';

export const Assignees = async (subCategoryId: number, locationId: number) => {
  const { data } = await API.get<IResponseModel>(
    `/User/usersBySubcategory?subCategoryId=${subCategoryId}&locationId=${locationId}`
  );
  return data;
};
