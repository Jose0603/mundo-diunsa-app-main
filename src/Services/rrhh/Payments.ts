import {Buffer} from "buffer";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {IPayroll} from "../../interfaces/rrhh/IPayroll";
import {ISelect} from "../../interfaces/rrhh/ISelect";

import API, {baseURL} from "../../Axios";

export const GetPayrollCodesByEmpCode = async () => {
  const {data} = await API.get<ISelect[]>(`/Payments/GetPayrollCodesByEmpCode`);
  return data;
};

export const GetPayrollDetailByCode = async (payrollCode: string) => {
  const {data} = await API.get<IPayroll>(
    `/Payments/GetPayrollDetailByCode?payrollCode=${payrollCode}`
  );
  return data;
};

function getFileUri(name) {
  return FileSystem.documentDirectory + `${encodeURI(name)}.pdf`;
}

export const GetPDF = async (payrollCode: string, empId: number) => {
  const {data} = await API.get<string>(
    `/Payments/GetPDF?payrollCode=${payrollCode}&empId=${empId}`
  );

  const buff = Buffer.from(data, "base64");
  const pdf = buff.toString("base64");
  const fileUri = getFileUri(payrollCode + empId);

  await FileSystem.writeAsStringAsync(fileUri, pdf, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // const { uri } = await Print.printToFileAsync({ uri: fileUri });s

  await Sharing.shareAsync(fileUri);
};

export const GetPDFWeb = async (payrollCode: string, empId: number) => {
  const {data} = await API.get<string>(
    `/Payments/GetPDF?payrollCode=${payrollCode}&empId=${empId}`
  );

  // const buff = Buffer.from(data, "base64");
  // const pdf = buff.toString("base64");
  // const fileUri = getFileUri(payrollCode + empId);

  let pdf = `data:application/pdf;base64,${data}`;
  const fileName = empId + payrollCode;

  const aElement = document.createElement("a");
  aElement.setAttribute("download", fileName);
  // const href = URL.createObjectURL(pdf);
  aElement.href = pdf;
  aElement.setAttribute("target", "_blank");
  aElement.click();

  // const downloadLink = document.createElement("a");
  // downloadLink.setAttribute("download", fileName + ".pdf");
  // downloadLink.href = pdf;
  // // downloadLink.download = fileName + ".pdf";
  // downloadLink.setAttribute("target", "_blank");
  // downloadLink.click();

  // await FileSystem.writeAsStringAsync(fileUri, pdf, {
  //   encoding: FileSystem.EncodingType.Base64,
  // });

  // const { uri } = await Print.printToFileAsync({ uri: fileUri });

  // await Sharing.shareAsync(fileUri);
};
