import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import { ArrowBackIcon, Badge, Box, Button, Center, Circle, Divider, Heading, HStack, Pressable, ScrollView, Text, useToast, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Platform, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Attachments } from '../../Components/Attachments';
import { Loading } from '../../Components/Loading';
import SolutionModal from '../../Components/SolutionModal';
import { queryClient } from '../../Configs/QueryClient';
import { TicketStatus } from '../../Enums/TicketStatus';
import { AppPermissions } from '../../Helpers/AppPermissions';
import { getTicketStatus } from '../../Helpers/GetTicketStatus';
import { LogType } from '../../Helpers/LogTypes';
import { Priorities } from '../../Helpers/Priorities';
import { QueryKeys } from '../../Helpers/QueryKeys';
import { ScreenNames } from '../../Helpers/ScreenNames';
import { useCustomToast } from '../../hooks/useCustomToast';
import { useHasPermissions } from '../../hooks/usePermissions';
import { AuthState } from '../../Redux/reducers/auth/loginReducer';
import { AcceptOrDecline, GetIncident, MarkAsEnded } from '../../Services/incidents/Incidents';

interface IProps extends NativeStackScreenProps<any, any> {
  toggleDrawer: Function;
}

export const IncidentDetailsScreen = ({ route, navigation }: IProps) => {
  const { ticketId } = route?.params?.ticketId && route.params;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [loadingEnd, setLoadingEnd] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const auth: AuthState = useSelector((state: any) => state.auth.login);
  const isTechnician = useHasPermissions([AppPermissions.tecnico]);
  const { top } = useSafeAreaInsets();
  const showToast = useCustomToast();

  const {
    isLoading,
    isError,
    data: incident,
  } = useQuery([QueryKeys.SINGLE_INCIDENT, ticketId], () => GetIncident(ticketId));

  const renderRightActions = () => (
    <>
      <Pressable
        onPress={async () => {
          navigation.navigate(ScreenNames.CHAT, { ticketId });
        }}
      >
        {/* <Feather name="edit" size={24} color="black" /> */}
        <Feather name="message-circle" size={24} color="black" />
      </Pressable>
    </>
  );

  const renderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
    />
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries([QueryKeys.SINGLE_INCIDENT]);
    setRefreshing(false);
  }, []);

  const sendTicketResponse = async (response: boolean) => {
    setLoadingResponse(true);
    try {
      const res = await AcceptOrDecline({ id: ticketId, response: response });
      if (res.result) {
        onRefresh();
        // if (!response) {
        //   navigation.goBack();
        // }
      } else {
        showToast({
          title: `Ha ocurrido un error`,
          status: 'error',
          description: res.message ?? 'Ocurrio un error inesperado',
        });
      }
      setLoadingResponse(false);
    } catch (error) {
      console.log(error);
      setLoadingResponse(false);
    }
  };

  const sendTicketEnd = async (ticketId: number) => {
    setLoadingEnd(true);
    try {
      const res = await MarkAsEnded(ticketId);
      if (res.result) {
        showToast({
          title: `Se ha marcado el ticket como completado`,
          status: 'success',
          // description: data.Message ?? 'Ocurrio un error inesperado',
        });
        navigation.navigate(ScreenNames.HOME_INCIDENTS);
      } else {
        showToast({
          title: `Ha ocurrido un error`,
          status: 'error',
          description: res.message ?? 'Ocurrio un error inesperado',
        });
      }
      setLoadingEnd(false);
    } catch (error) {
      console.log(error);
      setLoadingEnd(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Box
      h={{
        base: '100%',
        lg: 'auto',
      }}
      flex={1}
      backgroundColor="#fff"
      style={[{ paddingTop: top }]}
    >
      <TopNavigation
        alignment="center"
        title="Incidencia"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        accessoryRight={
          (incident && incident.status === TicketStatus.ASSIGNED) ||
          (incident && incident.status === TicketStatus.INPROGRESS)
            ? renderRightActions
            : null
        }
      />
      {incident && incident.subCategoryId && isTechnician && auth.employeeId == incident.assignedTo && (
        <SolutionModal
          showModal={showModal}
          closeModal={(response: boolean) => {
            if (response) {
              sendTicketEnd(incident.id);
            }
            setShowModal(!showModal);
          }}
          subCategoryId={incident?.subCategoryId}
        />
      )}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        nestedScrollEnabled={true} flex={1}
      >
        <VStack space={4} px={4}>
          <VStack alignItems="center">
            <Center>
              <Heading textAlign="center" mb="1">
                {incident?.tUuid}
              </Heading>
            </Center>
            <Center>
              {typeof incident?.status === 'number' && (
                <Badge colorScheme={getTicketStatus(incident?.status).type} rounded="lg">
                  {getTicketStatus(incident?.status).label}
                </Badge>
              )}
            </Center>
          </VStack>
          <VStack>
            <Text fontSize="sm">
              <Text fontWeight="bold">Gestión:</Text> {incident?.subCategoryName}
            </Text>
            <Text fontSize="lg">Observaciones</Text>
            <Text fontSize="md">{incident?.observations}</Text>
            {isTechnician && auth.employeeId == incident.assignedTo && incident?.status === TicketStatus.ASSIGNED && (
              <HStack justifyContent="space-between" w="50%" mt={3} alignSelf="center">
                {!loadingResponse ? (
                  <>
                    <Button
                      colorScheme="danger"
                      isLoading={loadingResponse}
                      onPress={() => {
                        sendTicketResponse(false);
                      }}
                    >
                      Rechazar
                    </Button>
                    <Button
                      colorScheme="primary"
                      isLoading={loadingResponse}
                      onPress={() => {
                        sendTicketResponse(true);
                      }}
                    >
                      Aceptar
                    </Button>
                  </>
                ) : (
                  <Loading />
                )}
              </HStack>
            )}
            {isTechnician && auth.employeeId == incident.assignedTo && incident?.status === TicketStatus.INPROGRESS && (
              <HStack justifyContent="center" w="50%" mt={3} alignSelf="center">
                {!loadingEnd ? (
                  <>
                    <Button
                      colorScheme="primary"
                      isLoading={loadingEnd}
                      onPress={() => {
                        // SaveSolution({ subcategoryId: incident?.subCategoryId, description: '' });
                        setShowModal(!showModal);
                        // sendTicketEnd(ticketId);
                      }}
                    >
                      Marcar como Resuelta
                    </Button>
                  </>
                ) : (
                  <Loading />
                )}
              </HStack>
            )}
          </VStack>
          <Divider my="2" />
          {incident?.id && incident?.status !== TicketStatus.CANCELLED && incident?.status !== TicketStatus.CLOSED && (
            <Attachments ticketId={incident?.id} prevImages={incident?.images?.map((e) => e.name)} />
          )}
          {incident?.priority && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Prioridad
              </Text>
              <Text fontSize="sm">
                {Priorities.find((x) => x.label.toLowerCase() === incident?.priority.label.toLowerCase())?.label}
              </Text>
            </VStack>
          )}
          {incident?.storeName && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Tienda
              </Text>
              <Text fontSize="sm">{incident.storeName}</Text>
            </VStack>
          )}
          {incident?.createdBy && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Informador
              </Text>
              <Text fontSize="sm">{incident.createdBy}</Text>
            </VStack>
          )}
          {incident?.assignedToName && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Asignado a
              </Text>
              <Text fontSize="sm">{incident.assignedToName.toUpperCase()}</Text>
            </VStack>
          )}

          {incident?.estimatedEndTime && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Fecha estimada de finalizacion
              </Text>
              <Text fontSize="sm">{moment(incident.estimatedEndTime).format('D MMM YY HH:mm')}</Text>
            </VStack>
          )}
          {incident?.createdAt && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Creada
              </Text>
              <Text fontSize="sm">{moment(incident.createdAt).format('D MMM YY HH:mm')}</Text>
            </VStack>
          )}
          {incident?.updatedAt && (
            <VStack>
              <Text fontSize="sm" fontWeight="bold">
                Actualizada
              </Text>
              <Text fontSize="sm">{moment(incident.updatedAt).format('D MMM YY HH:mm')}</Text>
            </VStack>
          )}

          <VStack>
            <HStack>
              <Text fontSize="sm" fontWeight="bold" mb={3}>
                Actividad
              </Text>
              {/* <Select
                minWidth="200"
                accessibilityLabel="Selecciona el Tipo de Gestión"
                placeholder="Selecciona el Tipo de Gestión"
                _selectedItem={{
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                onValueChange={(itemValue: string) => {
                  setCategory(itemValue);
                }}
              >
                {categories.map(({ name, id }) => {
                  return <Select.Item key={`category-${id}`} label={name} value={id.toString()} />;
                })}
              </Select> */}
            </HStack>
            <Box>
              <ScrollView nestedScrollEnabled={true}>
                {incident?.logTickets &&
                  incident.logTickets.map((log, i: number) => {
                    let iconToShow;
                    switch (log.type) {
                      case LogType.CREATED:
                        iconToShow = <Ionicons name="pencil-sharp" size={18} color="white" />;
                        break;
                      case LogType.STATUS:
                        iconToShow = <MaterialIcons name="compare-arrows" size={24} color="white" />;
                        break;
                      default:
                        break;
                    }
                    return (
                      <HStack space={4} key={`activity-log-${i}`} w="100%" py={1}>
                        <Circle size={39} bg="blue.500">
                          {iconToShow}
                        </Circle>
                        <VStack>
                          <HStack flexWrap="wrap" w="92%">
                            <Text fontSize="md" color="blue.600" w="100%">
                              {log.description}
                            </Text>
                          </HStack>
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: 'warmGray.50',
                            }}
                            color="coolGray.400"
                          >
                            {moment(log.createdAt).format('D MMM YY HH:mm')}
                          </Text>
                        </VStack>
                      </HStack>
                    );
                  })}
              </ScrollView>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
      {isTechnician && (
        <Pressable
          justifyContent="center"
          alignItems="center"
          backgroundColor="#3F86F7"
          h="50px"
          onPress={() => {
            navigation.navigate(ScreenNames.SOLUTION_INCIDENT, {
              subCategoryId: incident.subCategoryId,
              ticketId,
              subCategoryName: incident.subCategoryName,
            });
          }}
        >
          <Text color="#fff">Ver posibles soluciones para esta gestion</Text>
        </Pressable>
      )}
    </Box>
  );
};
