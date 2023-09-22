import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { queryClient } from '../Configs/QueryClient';
import { QueryKeys } from '../Helpers/QueryKeys';
import { IClinicAppointment, IGroupedClinicAppointment } from '../interfaces/rrhh/IClinic';
import { setClinicAppointments } from '../Redux/reducers/clinic/clinicAppointmentsSlice';
import { RootState } from '../Redux/reducers/rootReducer';
import { GetAllPendingAppointments } from '../Services/rrhh/Clinic';
import { usePendingAppointments } from './useClinic';

export const useClinicQueue = () => {
  const dispatch = useDispatch();
  const user = useSelector((root: RootState) => root.auth.login);
  // const appointments = useSelector((root: RootState) => root.clinicAppointments.appointments);
  const { appointments, isFetchingAppointments, isLoadingAppointments } = usePendingAppointments();
  // console.log('🚀 ~ file: useClinicQueue.tsx ~ line 17 ~ useClinicQueue ~ appointments', appointments);
  const [loadingQueue, setLoadinQueue] = useState<boolean>(false);
  const [clinicName, setClinicName] = useState<string>('');
  const [myTickets, setMyTickets] = useState<IClinicAppointment[]>([]);
  const [attendingTickets, setAttendingTickets] = useState<IClinicAppointment[]>([]);
  const [currentUserQueue, setCurrentUserQueue] = useState<IGroupedClinicAppointment>();
  const [allQueues, setallQueues] = useState<IGroupedClinicAppointment[]>([]);

  // const fetchPendingAppointments = async () => {
  //   try {
  //     const data = await GetAllPendingAppointments();
  //     if (data && data.length > 0) {
  //       dispatch(setClinicAppointments(data));
  //     }
  //   } catch (error) {
  //     console.log('🚀 ~ file: FormRequestClinicScreen.tsx ~ line 40 ~ fetchPendingAppointments ~ error', error);
  //   } finally {
  //     setLoadinQueue(false);
  //   }
  // };

  useEffect(() => {
    setLoadinQueue(true);

    //  queryClient.refetchQueries([QueryKeys.CLINIC_ATTENDIND, QueryKeys.CLINIC_MY_APPOINTMENTS]);
    if (appointments && appointments.length > 0 && !isFetchingAppointments && !isLoadingAppointments) {
      const correspondingQueue = appointments?.find((x) =>
        x.appointments.map((appointment) => appointment.userId).includes(user.employeeId)
      );
      setallQueues(appointments);
      setCurrentUserQueue(correspondingQueue);
      setAttendingTickets(
        correspondingQueue?.appointments?.filter((appointment) => appointment.status === 'Atendiendo') ?? []
      );
      setMyTickets(
        correspondingQueue?.appointments?.filter((appointment) => appointment.userId === user.employeeId) ?? []
      );
      setClinicName(
        correspondingQueue?.appointments?.filter((appointment) => appointment.userId === user.employeeId)[0]
          .clinicName ?? ''
      );
    }
    // else {
    //   // fetchPendingAppointments();
    //   // invalidate queries
    //   (async () => {
    //     await queryClient.refetchQueries(QueryKeys.CLINIC_PENDING_APPOINTMENTS);
    //   })();
    // }
    setLoadinQueue(false);
  }, [appointments]);

  return {
    allQueues,
    currentUserQueue,
    loadingQueue,
    clinicName,
    attendingTickets,
    myTickets,
    isFetchingAppointments,
    isLoadingAppointments,
  };
};
