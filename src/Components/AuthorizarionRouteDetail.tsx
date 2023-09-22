import { Badge, Box, Text, VStack } from 'native-base';
import React from 'react';
import { Platform } from 'react-native';

import { IRequisitionDetail } from '../interfaces/rrhh/IRequestRequisition';
import { getRequestStatus } from '../Helpers/GetRequestStatus';
import { IExtraHourDetail } from '../interfaces/rrhh/IExtraHourDetail';
import { IRecordDetail } from '../interfaces/rrhh/IRequestConstancia';
import { IFreeTimeCouponDetail } from '../interfaces/rrhh/IRequestFreetimeCupon';
import { IRequestPendingApproval } from '../interfaces/rrhh/IRequestPendingApproval';
import { IVacationDetail } from '../interfaces/rrhh/IRequestVacation';
import { ITimeNotWorkedDetail } from '../interfaces/rrhh/ITimeNotWorked';

export interface IProps {
  requestDetail:
    | IExtraHourDetail
    | IVacationDetail
    | ITimeNotWorkedDetail
    | IRecordDetail
    | IFreeTimeCouponDetail
    | IRequisitionDetail;
  selectedRequest: IRequestPendingApproval;
}

const AuthorizarionRouteDetail = ({ requestDetail, selectedRequest }: IProps) => {
  const isWeb = Platform.OS === 'web';
  return (
    <>
      <Box flexDir={isWeb ? 'row' : 'column'} mx={3}>
        <VStack w={isWeb ? '50%' : '100%'} my={2}>
          <Text color={'warmGray.400'} fontSize="md">
            Ruta de Autorizacion
          </Text>
          <Text color={'warmGray.800'} fontSize="md">
            {selectedRequest?.ainNombre}
          </Text>
        </VStack>
        <VStack w={isWeb ? '50%' : '100%'} my={2}>
          <Text color={'warmGray.400'} fontSize="md">
            Puesto Sujeto de Accion
          </Text>
          <Text color={'warmGray.800'} fontSize="md">
            {requestDetail?.employeePosition?.positionName}
          </Text>
        </VStack>
      </Box>
      <Box flexDir={isWeb ? 'row' : 'column'} mx={3}>
        <VStack w={isWeb ? '50%' : '100%'} my={2}>
          <Text color={'warmGray.400'} fontSize="md">
            Sujeto de Accion
          </Text>
          <Text color={'warmGray.800'} fontSize="md">
            {selectedRequest?.nombreSujetoAccion}
          </Text>
        </VStack>
        <VStack w={isWeb ? '50%' : '100%'} my={2}>
          <Text color={'warmGray.400'} fontSize="md">
            Estado
          </Text>
          <Badge w="30%" colorScheme={getRequestStatus(selectedRequest?.ainEstado).type} rounded="sm">
            {getRequestStatus(selectedRequest?.ainEstado).label}
          </Badge>
        </VStack>
      </Box>
    </>
  );
};

export default AuthorizarionRouteDetail;
