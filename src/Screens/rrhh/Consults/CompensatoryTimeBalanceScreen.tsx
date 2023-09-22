import { DrawerScreenProps } from "@react-navigation/drawer";
import { Icon, TopNavigationAction } from "@ui-kitten/components";
import { Box, FlatList, HStack, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { Loading } from "../../../Components/Loading";
import { NoData } from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import { QueryKeys } from "../../../Helpers/QueryKeys";
import { AuthState } from "../../../Redux/reducers/auth/loginReducer";
import { GetCompensatoryTime } from "../../../Services/rrhh/CompensatoryTime";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const CompensatoryTimeBalanceScreen = ({ navigation }: IProps) => {
  const user: AuthState = useSelector((state: any) => state.auth.login);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: periods,
  } = useQuery([QueryKeys.COMPENSATORY_TIME, user.employeeId], () =>
    GetCompensatoryTime(user.employeeId)
  );

  const renderItem = ({ item }: any) => {
    return (
      <Box mx={5} py={3}>
        <VStack w="40%">
          <HStack justifyContent="space-between" mb={1} mt={1}>
            <VStack w="60%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Año
              </Text>
            </VStack>
            <VStack w="40%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {item.anio}
              </Text>
            </VStack>
          </HStack>
          <HStack justifyContent="space-between" mb={1}>
            <VStack w="60%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Tiempo Ausencia
              </Text>
            </VStack>
            <VStack w="40%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {item.horasAusencia} h - {item.minutosAusencia} m
              </Text>
            </VStack>
          </HStack>
          <HStack justifyContent="space-between" mb={1}>
            <VStack w="60%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Tiempo Acreditado
              </Text>
            </VStack>
            <VStack w="40%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                isTruncated
              >
                {item.horasAcredita} h - {item.minutosAcredita} m
              </Text>
            </VStack>
          </HStack>
          <HStack justifyContent="space-between" mb={1}>
            <VStack w="60%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Saldo
              </Text>
            </VStack>
            <VStack w="40%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {parseFloat(item.saldoHoras).toFixed(2)}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    );
  };

  function decimalAHora(decimal: number) {
    let horas = Math.floor(decimal), // Obtenemos la parte entera
      restoHoras = Math.floor((decimal % 1) * 100), // Obtenemos la parde decimal
      decimalMinutos = (restoHoras * 60) / 100, // Obtenemos los minutos expresado en decimal
      minutos = Math.floor(decimalMinutos), // Obtenemos la parte entera
      restoMins = Math.floor((decimalMinutos % 1) * 100), // Obtenemos la parde decimal
      segundos = Math.floor((restoMins * 60) / 100); // Obtenemos los segundos expresado en entero

    // return `${('00'+horas).slice(-2)} h ${('00'+minutos).slice(-2)} m:${('00'+segundos).slice(-2)}`;
    return `${("00" + horas).slice(-2)} h ${("00" + minutos).slice(-2)} m`;
  }

  return (
    <Box safeArea backgroundColor="#fff" flex={1}>
      {/* <TopNavigation
        alignment="center"
        title="Saldo de Tiempo Compensatorio"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
      /> */}
      <TopMainBar />

      {isLoading ? (
        <Loading message="Cargando Tiempo Compensatorio..." isFlex />
      ) : (
        <FlatList
          data={periods}
          keyExtractor={(item) => `item-${item.anio}`}
          ListHeaderComponent={
            <VStack pb={4}>
              <Text
                // bold
                // color={"blue.600"}
                // _dark={{
                //   color: "warmGray.200",
                // }}
                fontSize="xl"
              >
                Tiempo Compensatorio
              </Text>
            </VStack>
          }
          ListEmptyComponent={
            <NoData message="No hay tiempo compensatorio por mostrar" />
          }
          ListFooterComponent={
            <Box mx={5} py={3}>
              <HStack w={"40%"} justifyContent="space-between" mb={1} mt={1}>
                <VStack w="60%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                  >
                    Saldo Total
                  </Text>
                </VStack>
                <VStack w="40%" alignItems="flex-start">
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                  >
                    {decimalAHora(
                      periods.reduce((acc, curr) => acc + curr.saldoHoras, 0)
                    )}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          }
          renderItem={renderItem}
          _contentContainerStyle={{
            // shadow: 4,
            backgroundColor: "#fff",
            // borderColor: "gray.200",
            // borderWidth: 2,
            // justifyContent: "center",
            // borderRadius: 5,
            marginX: 20,
            marginTop: 5,
            padding: 4,
          }}
        />
      )}
    </Box>
  );
};
export default CompensatoryTimeBalanceScreen;
