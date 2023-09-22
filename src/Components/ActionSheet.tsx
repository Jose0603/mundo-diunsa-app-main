import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Actionsheet, Badge, Box, Icon, Text } from 'native-base';
import React, { useState } from 'react';

import { getTicketStatus, TicketStatuses } from '../Helpers/GetTicketStatus';
import useIncidents from '../hooks/useIncidents';

interface IProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setselectedStatus: any;
  setSubCategory: any;
}

export const ActionSheet = ({ onOpen, onClose, isOpen, setselectedStatus, setSubCategory }: IProps) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const {
    Categories: { data: categories },
  } = useIncidents();

  const compareFunction = (a: any, b: any) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label < b.label) {
      return 1;
    }

    return 0;
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          {/* <Actionsheet.Item>
            <Button onPress={() => setShowDatePicker(!showDatePicker)}>Fechas</Button>
          </Actionsheet.Item> */}
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text
              fontSize="16"
              color="gray.500"
              _dark={{
                color: 'gray.300',
              }}
            >
              Filtrar por Estado
            </Text>
          </Box>

          {TicketStatuses.map((status, i: number) => {
            const ticketStatus = getTicketStatus(status.value);

            return (
              <Actionsheet.Item
                endIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="arrow-right" />}
                onPress={() => {
                  setselectedStatus(status?.value);
                  onClose();
                }}
                key={`status-${i}`}
              >
                <Badge colorScheme={ticketStatus?.type} rounded="lg">
                  {status.label}
                </Badge>
              </Actionsheet.Item>
            );
          })}
          {/* {categories && categories.map((category: Category, i: number) => {
            return (
              <Actionsheet.Item
                endIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="arrow-drop-down" />}
                onPress={() => {
                  setselectedStatus(category.value);
                  onClose();
                  console.log(category.value);
                }}
                key={`status-${i}`}
              >
                {category.label}
              </Actionsheet.Item>
            );
          })} */}
          {/* <Box>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(_: any, date: any) => {
                  // console.log(date);
                }}
              />
            )}
          </Box> */}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
