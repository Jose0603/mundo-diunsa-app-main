import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  Box,
  Button,
  CheckIcon,
  FlatList,
  HStack,
  Icon as NbIcon,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import {Platform, StyleSheet, useWindowDimensions} from "react-native";
import {Loading} from "../../../Components/Loading";
import {NoData} from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import {usePeriodo, useReporteClimometro} from "../../../hooks/usePregunta";
import React, {useState} from "react";
import moment from "moment";
import {Row, Table} from "react-native-table-component";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}
export const ReporteClimometroScreen = ({navigation}: IProps) => {
  const {periodos, isLoadingPeriodos} = usePeriodo();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("-1");
  const {reporteClimometro, isLoadingReporteClimometro} = useReporteClimometro(
    +selectedPeriod
  );

  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      <TopMainBar />

      <Box
        _web={{
          paddingX: "10%",
        }}
        flex={1}
      >
        <Text fontSize={18} bold>
          Reporte Climometro
        </Text>
        <HStack w="100%" alignItems="center">
          <Box w="30%">
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
                // selectedValue={selectedPeriod}
                mt={1}
                onValueChange={(itemValue: string) => {
                  setSelectedPeriod(itemValue);
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
          </Box>
        </HStack>
        {isLoadingPeriodos ? (
          <Loading message="Cargando reporte..." />
        ) : (
          <>
            {reporteClimometro &&
            reporteClimometro != null &&
            reporteClimometro != undefined ? (
              <>
                <ScrollView horizontal={true}>
                  <VStack>
                    <Table borderStyle={{borderColor: "transparent"}}>
                      <Row
                        data={[
                          <Text color={"#0077CD"}>Unidad</Text>,
                          <Text color={"#0077CD"}>Fichas Entregadas</Text>,
                          <Text color={"#0077CD"}>Si</Text>,
                          <Text color={"#0077CD"}>No</Text>,
                          <Text color={"#0077CD"}>Fichas Llenadas</Text>,
                          <Text color={"#0077CD"}>Eficiencia</Text>,
                          <Text color={"#0077CD"}>Clima Laboral</Text>,
                        ]}
                        widthArr={[200, 200, 200, 200, 200, 200, 200]}
                        fontColor={"#ECECEC"}
                        style={styles.head}
                      />
                      <Row
                        data={[
                          <Text color={"#0077CD"}>
                            {reporteClimometro.unidad}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.fichasDelivered}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.yesAnswer}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.noAnswer}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.fichasCompleted}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.efficiency}
                          </Text>,
                          <Text color={"#0077CD"}>
                            {reporteClimometro.workingEnvironment}
                          </Text>,
                        ]}
                        widthArr={[200, 200, 200, 200, 200, 200, 200]}
                        fontColor={"#ECECEC"}
                        style={[
                          {
                            marginTop: 5,
                            borderRadiusTopLeft: 5,
                            borderRadiusTopRight: 5,
                            borderWidth: 1,
                            borderColor: "#ECECEC",
                          },
                          styles.row,
                        ]}
                      />
                    </Table>
                  </VStack>
                </ScrollView>
              </>
            ) : (
              <NoData message="No hay datos para mostrar" />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff"},
  head: {
    height: 40,
    // backgroundColor: "#ECECEC",
    padding: 5,
    borderRadius: 5,
    shadow: 4,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  wrapper: {flexDirection: "row"},
  title: {flex: 1, backgroundColor: "#f6f8fa"},
  row: {
    height: 28,
    // margin: 5,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  text: {textAlign: "center"},
});
