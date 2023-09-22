import {DrawerScreenProps} from "@react-navigation/drawer";
import {Icon, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  Divider,
  FlatList,
  HStack,
  PresenceTransition,
  ScrollView,
  Select,
  Text,
  View,
  VStack,
} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import {Platform, RefreshControl, VirtualizedList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {IPayroll} from "../../../interfaces/rrhh/IPayroll";

import {Loading} from "../../../Components/Loading";
import {NoData} from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import {ISelect} from "../../../interfaces/rrhh/ISelect";
import {
  GetPayrollCodesByEmpCode,
  GetPayrollDetailByCode,
  GetPDF,
  GetPDFWeb,
} from "../../../Services/rrhh/Payments";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const ReceiptOfPaymentScreen = ({navigation}: IProps) => {
  const [payrolls, setPayrolls] = useState<ISelect[]>(null);
  const [payrollActive, setPayrollActive] = useState<string>(null);
  const [details, setDetails] = useState<IPayroll>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;
  const RefreshIcon = (props: any) => (
    <Icon {...props} name="refresh-outline" />
  );

  const renderRightActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={RefreshIcon} onPress={() => fetchPayrolls()} />
    </Box>
  );
  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={MenuIcon}
        onPress={() => navigation.toggleDrawer()}
      />
    </Box>
  );

  useEffect(() => {
    fetchPayrolls();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (payrollActive) {
      fetchPayrollDetail();
    }
  }, [payrollActive]);

  const fetchPayrolls = async () => {
    setPayrollActive(null);
    setDetails(undefined);
    setIsLoading(true);
    setPayrolls(undefined);
    var data = await GetPayrollCodesByEmpCode();
    setPayrolls(data);
    setIsLoading(false);
  };

  const fetchPayrollDetail = async () => {
    setDetails(undefined);
    var data = await GetPayrollDetailByCode(payrollActive);
    setDetails(data);
    setRefreshing(false);
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    setDetails(null);
    fetchPayrollDetail();
  }, []);

  const fetchPDF = async () => {
    setIsLoadingPDF(true);
    if (Platform.OS !== "web") {
      await GetPDF(payrollActive, details.empId);
    } else {
      await GetPDFWeb(payrollActive, details.empId);
    }
    setIsLoadingPDF(false);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <HStack
        paddingY={3}
        px={5}
        // space={3}
        justifyContent="space-between"
        borderColor="#eee"
        borderWidth={1}
        // w="100%"
        h={"full"}
        backgroundColor={index % 2 && "#f6f8fa"}
      >
        {/* <VStack w="45%"> */}
        <Text
          _dark={{
            color: "warmGray.50",
          }}
          color="coolGray.800"
          bold
          fontSize={15}
        >
          {item.visDescripcion}
        </Text>
        {/* </VStack> */}
        {/* <VStack w="50%" style={{ marginEnd: 0 }} alignItems="flex-end"> */}
        <Text
          fontSize={15}
          style={item.visNetValor > 0 ? {color: "green"} : {color: "red"}}
        >
          L. {item.visNetValor.toFixed(2)}
        </Text>
        {/* </VStack> */}
      </HStack>
    );
  };

  return (
    <Box backgroundColor="#fff" h={"full"} w={"full"}>
      {/* <TopNavigation
        alignment="center"
        title="Consulta de Recibos de Pago"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      <Box mx={20} my={5} flex={1}>
        <Text fontSize={"md"} marginTop={5}>
          Consulta de Recibos de Pago
        </Text>
        <HStack>
          {payrolls && (
            <Select
              w={350}
              fontSize={16}
              accessibilityLabel="Selecciona la Planilla"
              placeholder="Selecciona la Planilla"
              _selectedItem={{
                endIcon: <CheckIcon size={5} />,
              }}
              selectedValue={payrollActive}
              mt="1"
              onValueChange={async (itemValue: string) => {
                setPayrollActive(itemValue);
              }}
            >
              {payrolls.map(({text, value}) => {
                return (
                  <Select.Item
                    key={`category-${value}`}
                    label={text}
                    value={value}
                  />
                );
              })}
            </Select>
          )}
        </HStack>
        {details && (
          <Box
            w={"2/3"}
            // rounded="lg"
            // marginBottom={10}
            // marginX="2"
            marginTop={5}
            // borderWidth="2"
            // padding={2}
            maxHeight="65%"
            // backgroundColor="#eee"
            // overflow="hidden"
            // borderColor="coolGray.200"
            // _dark={{
            //   borderColor: "coolGray.600",
            //   backgroundColor: "gray.700",
            // }}
            // _web={{
            //   shadow: 2,
            //   borderWidth: 0,
            //   marginX: "48",
            // }}

            // _light={{
            //   backgroundColor: "#fff",
            // }}
          >
            <Box key={5000}>
              <HStack mb={3} justifyContent="space-between">
                <View
                // p={3}
                // borderWidth={1}
                // borderColor={"#D9D9D9"}
                // shadow={2}
                // borderRadius={"md"}
                // w={"50%"}
                >
                  <Text fontSize={"lg"} bold alignContent="center">
                    Periodo {details.period}
                  </Text>
                </View>
                <Button
                  isLoading={isLoadingPDF}
                  // marginTop={5}
                  onPress={() => fetchPDF()}
                >
                  Descargar PDF
                </Button>
              </HStack>
              <HStack
                space={4}
                justifyContent="space-between"
                borderColor="#eee"
                borderWidth={1}
                padding={1}
                px={5}
                roundedTop={5}
              >
                {/* <VStack w="70%"> */}
                <Text
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="coolGray.800"
                  bold
                  fontSize={"lg"}
                >
                  CONCEPTO
                </Text>
                {/* </VStack> */}
                {/* <VStack w="30%" px="2"> */}
                <Text fontSize={"lg"} bold>
                  MONTO
                </Text>
                {/* </VStack> */}
              </HStack>
            </Box>
            <FlatList
              // ListHeaderComponent={}
              data={details.detail}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.2}
              ListEmptyComponent={<NoData />}
              ListFooterComponent={
                <Box key={6000}>
                  <HStack
                    // marginTop={15}
                    // space={3}
                    justifyContent="space-between"
                    borderColor="#eee"
                    borderWidth={1}
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
            />
          </Box>
        )}
        {isLoading && (
          <PresenceTransition
            visible={true}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 250,
              },
            }}
          >
            <Box justifyContent="center" alignItems="center" h="50px">
              <Loading message="Cargando..." />
            </Box>
          </PresenceTransition>
        )}
      </Box>
    </Box>
  );
};

export default ReceiptOfPaymentScreen;
