import {DrawerScreenProps} from "@react-navigation/drawer";
import {Icon, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import moment from "moment";
import {
  Box,
  Button,
  Center,
  HStack,
  ScrollView,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import {
  Platform,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import {Row, Table} from "react-native-table-component";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";

import {Loading} from "../../../Components/Loading";
import {NoData} from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import {QueryKeys} from "../../../Helpers/QueryKeys";
import {AuthState} from "../../../Redux/reducers/auth/loginReducer";
import {
  GetEnjoyedVacations,
  GetVacationPeriods,
} from "../../../Services/rrhh/Vacations";
import {usePeriodo, useReporteClimometro} from "../../../hooks/usePregunta";
import {MaterialIcons, SimpleLineIcons} from "@expo/vector-icons";
import {layout} from "native-base/lib/typescript/theme/styled-system";
import {ActionSheetRequestsPeriodo} from "../../../Components/ActionSheetRequestsPeriodo";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const ReporteClimometroScreen = ({navigation}: IProps) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {periodos, isLoadingPeriodos} = usePeriodo();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("-1");
  const [search, setSearch] = useState(false);
  const {reporteClimometro, isLoadingReporteClimometro} = useReporteClimometro(
    +selectedPeriod
  );
  const qclient = useQueryClient();
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    qclient.invalidateQueries;
    setRefreshing(false);
  }, []);
  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={<SimpleLineIcons name="menu" size={24} color="black" />}
        onPress={() => navigation.toggleDrawer()}
      />
      <Button
        onPress={() => {
          onOpen();
        }}
        disabled={isLoadingPeriodos}
        variant="ghost"
        _pressed={{bg: "coolGray.100"}}
        endIcon={
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        }
      >
        <Text color="coolGray.700" fontWeight="bold">
          Filtros
        </Text>
        <Text color="coolGray.700" fontWeight="bold">
          Periodos
        </Text>
      </Button>
    </Box>
  );

  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        // title="Listado de Solicitudes"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoadingReporteClimometro ? (
          <Loading message="Cargando reporte..." />
        ) : (
          <Box
            rounded="lg"
            marginBottom={10}
            marginX="2"
            marginTop={5}
            borderWidth="2"
            padding={2}
            maxHeight="80%"
            backgroundColor="#eee"
            overflow="hidden"
            borderColor="coolGray.200"
            _dark={{
              borderColor: "coolGray.600",
              backgroundColor: "gray.700",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
              marginX: "48",
            }}
            _light={{
              backgroundColor: "#fff",
            }}
          >
            <Box key={5000}>
              <Center margin="5">
                <Text fontSize={18} bold alignContent="center">
                  Unidad {reporteClimometro.unidad}
                </Text>
              </Center>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    Fichas Entregadas
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.fichasDelivered}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    Si
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.yesAnswer}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    No
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.noAnswer}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    Fichas Llenadas
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.fichasCompleted}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    Eficiencia
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.efficiency}%
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                <VStack w="70%">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                    fontSize={18}
                  >
                    Clima Laboral
                  </Text>
                </VStack>
                <VStack w="30%" px="2">
                  <Text fontSize={17} bold>
                    {reporteClimometro.workingEnvironment}%
                  </Text>
                </VStack>
              </HStack>
            </Box>
            {/* <FlatList
            // ListHeaderComponent={}
            data={details.detail}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={<NoData />}
            ListFooterComponent={
              <Box key={6000}>
                <HStack
                  marginTop={15}
                  space={3}
                  justifyContent="space-between"
                  borderColor="#eee"
                  // borderWidth={1}
                  padding={1}
                  px={5}
                  rounded={5}
                >
                  <VStack w="50%">
                    <Text
                      _dark={{
                        color: "warmGray.50",
                      }}
                      color="coolGray.800"
                      bold
                      fontSize={18}
                    >
                      TOTAL
                    </Text>
                  </VStack>
                  <VStack w="40%" px="2" alignItems="flex-end">
                    <Text
                      fontSize={17}
                      bold
                      style={
                        details.total > 0 ? {color: "green"} : {color: "red"}
                      }
                    >
                      L. {details.total}
                    </Text>
                  </VStack>
                </HStack>
               
              </Box>
            }
            renderItem={renderItem}
          /> */}
          </Box>
          // <FlatList
          //   data={requests}
          //   extraData={requests}
          //   onEndReached={() => {
          //     // if (incidents?.pageInfo.hasNextPage && !isPreviousData) {
          //     //   console.log('se puede buscar otra');
          //     //   setPage((prevPage) => prevPage + 1);
          //     // }
          //     if (pagedInfo.currentPage < pagedInfo.totalPages) {
          //       setPage(page + 1);
          //     }
          //   }}
          //   keyExtractor={(item) => `solicitud-${item.fluRegistro}`}
          //   onEndReachedThreshold={0.2}
          //   ListEmptyComponent={<NoData />}
          //   // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          //   refreshing={refreshing}
          //   renderItem={renderItem}
          //   onRefresh={onRefresh}
          //   ListHeaderComponent={
          //     <Box mx={3} mt={3}>
          //       <ClinicQueue />
          //     </Box>
          //   }
          // />
        )}
      </ScrollView>
      <ActionSheetRequestsPeriodo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setselectedStatus={setSelectedPeriod}
        setSearch={setSearch}
        search={search}
      />
    </Box>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff"},
  head: {height: 40, backgroundColor: "#f1f8ff", padding: 5},
  wrapper: {flexDirection: "row"},
  title: {flex: 1, backgroundColor: "#f6f8fa"},
  row: {height: 28, margin: 5, paddingTop: 5},
  text: {textAlign: "center"},
});
