import React, {useState} from "react";
import {Actionsheet, Box, Text, HStack, Select, CheckIcon} from "native-base";
import {Icon} from "@ui-kitten/components";
import {usePeriodo} from "../hooks/usePregunta";

interface IProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setselectedStatus: any;
  setSearch: any;
  search: boolean;
  shouldShowStatus?: boolean;
  showName?: boolean;
}

export const ActionSheetRequestsPeriodo = ({
  onOpen,
  onClose,
  isOpen,
  setselectedStatus,
  setSearch,
  search,
  shouldShowStatus = true,
  showName = false,
}: IProps) => {
  const {periodos, isLoadingPeriodos} = usePeriodo();

  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
  const RefreshIcon = (props: any) => (
    <Icon {...props} name="refresh-outline" />
  );

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          <Box w="100%" px={4} py={5} justifyContent="center">
            <HStack>
              {showName && (
                <Text
                  bold
                  fontSize="16"
                  color="gray.700"
                  _dark={{
                    color: "gray.300",
                  }}
                >
                  Filtrar Periodos
                </Text>
              )}
            </HStack>
            {shouldShowStatus && periodos && periodos.length > 0 && (
              <Box my={4}>
                <Text
                  fontSize="14"
                  color="gray.500"
                  _dark={{
                    color: "gray.300",
                  }}
                >
                  Periodo
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
                  {periodos &&
                    periodos.length > 0 &&
                    periodos.map((x) => {
                      return (
                        <Select.Item
                          key={`status-${x.id}`}
                          label={x.mes}
                          value={x.id.toString()}
                        />
                      );
                    })}
                </Select>
              </Box>
            )}
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
