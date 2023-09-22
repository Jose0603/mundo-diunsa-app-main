import React, { useEffect, useState } from 'react';
import {
  Button,
  Actionsheet,
  Box,
  Text,
  Center,
  FormControl,
  HStack,
  VStack,
  Pressable,
  Select,
  CheckIcon,
} from 'native-base';
import { Icon } from '@ui-kitten/components';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import moment from 'moment';
import { IRequestStatus } from '../interfaces/rrhh/IRequestStatus';
import { GetRequestStatuses } from '../Services/rrhh/Request';

interface IProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setStartDate: any;
  setEndDate: any;
  setselectedStatus: any;
  setSearch: any;
  search: boolean;
  shouldShowStatus?: boolean;
  showName?: boolean;
}

export const ActionSheetRequestsList = ({
  onOpen,
  onClose,
  isOpen,
  setselectedStatus,
  setSearch,
  setStartDate,
  setEndDate,
  search,
  shouldShowStatus = true,
  showName = false,
}: IProps) => {
  const [horaDesdeShow, setHoraDesdeShow] = useState<Boolean>(false);
  const [horaHastaShow, setHoraHastaShow] = useState<Boolean>(false);
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());
  const [statuses, setStatuses] = useState<IRequestStatus[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
  const RefreshIcon = (props: any) => <Icon {...props} name="refresh-outline" />;

  useEffect(() => {
    setIsLoadingStatuses(true);
    (async () => {
      try {
        const res = await GetRequestStatuses();
        setStatuses(res);
      } catch (error) {
      } finally {
        setIsLoadingStatuses(false);
      }
    })();
  }, []);

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          {/* <Actionsheet.Item>
            <Button onPress={() => setShowDatePicker(!showDatePicker)}>Fechas</Button>
          </Actionsheet.Item> */}
          <Box w="100%" px={4} py={5} justifyContent="center">
            <HStack>
              {showName && (
                <Text
                  bold
                  fontSize="16"
                  color="gray.700"
                  _dark={{
                    color: 'gray.300',
                  }}
                >
                  Filtrar Solicitudes
                </Text>
              )}
            </HStack>
            {shouldShowStatus && statuses && statuses.length > 0 && (
              <Box my={4}>
                <Text
                  fontSize="14"
                  color="gray.500"
                  _dark={{
                    color: 'gray.300',
                  }}
                >
                  Estado
                </Text>
                <Select
                  accessibilityLabel="SELECCIONE"
                  _selectedItem={{
                    endIcon: <CheckIcon size={5} />,
                  }}
                  // selectedValue={values.tipoConstancia}
                  mt={1}
                  onValueChange={(itemValue: string) => {
                    setselectedStatus(itemValue);
                  }}
                >
                  {statuses &&
                    statuses.length > 0 &&
                    statuses.map(({ value, text }, index) => {
                      return <Select.Item key={`status-${index}`} label={text} value={value} />;
                    })}
                </Select>
              </Box>
            )}
            <Box flexDirection={Platform.OS === 'android' ? 'row' : 'column'}>
              <VStack width={Platform.OS === 'android' ? '50%' : '100%'}>
                <FormControl marginY={1}>
                  <Text
                    fontSize="14"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}
                  >
                    Desde:
                  </Text>
                  {Platform.OS === 'android' ? (
                    <>
                      <Pressable
                        w="70%"
                        onPress={() => setHoraDesdeShow(true)}
                        borderColor="#eee"
                        borderWidth={1}
                        p={2}
                      >
                        <Text>{startHour && moment.utc(startHour).format('DD/MM/YYYY')}</Text>
                      </Pressable>
                      {horaDesdeShow && (
                        <RNDateTimePicker
                          value={startHour}
                          mode="date"
                          display="default"
                          timeZoneOffsetInMinutes={0}
                          onChange={(e, selectedDate) => {
                            setHoraDesdeShow(false);
                            if (selectedDate != null) {
                              setStartDate(selectedDate);
                              setStartHour(selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <RNDateTimePicker
                      value={startHour}
                      mode="date"
                      display="default"
                      timeZoneOffsetInMinutes={0}
                      onChange={(e, selectedDate) => {
                        setHoraDesdeShow(false);
                        if (selectedDate != null) {
                          setStartDate(selectedDate);
                          setStartHour(selectedDate);
                        }
                      }}
                    />
                  )}
                </FormControl>
              </VStack>
              <VStack width={Platform.OS === 'android' ? '50%' : '100%'}>
                <FormControl marginY={1}>
                  <Text
                    fontSize="14"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}
                  >
                    Hasta:
                  </Text>
                  {Platform.OS === 'android' ? (
                    <>
                      <Pressable
                        onPress={() => setHoraHastaShow(true)}
                        w="70%"
                        borderColor="#eee"
                        borderWidth={1}
                        p={2}
                      >
                        <Text>{endHour && moment.utc(endHour).format('DD/MM/YYYY')}</Text>
                      </Pressable>
                      {horaHastaShow && (
                        <RNDateTimePicker
                          value={endHour}
                          mode="date"
                          timeZoneOffsetInMinutes={0}
                          onChange={(e, selectedDate) => {
                            setHoraHastaShow(false);
                            if (selectedDate != null) {
                              setEndDate(selectedDate);
                              setEndHour(selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <RNDateTimePicker
                      value={endHour}
                      mode="date"
                      timeZoneOffsetInMinutes={0}
                      onChange={(e, selectedDate) => {
                        setHoraHastaShow(false);
                        if (selectedDate != null) {
                          setEndDate(selectedDate);
                          setEndHour(selectedDate);
                        }
                      }}
                    />
                  )}
                </FormControl>
              </VStack>
            </Box>
            <Box>
              <Button
                size="lg"
                my={3}
                onPress={() => {
                  setSearch(!search);
                  onClose();
                }}
              >
                Filtrar
              </Button>
            </Box>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
