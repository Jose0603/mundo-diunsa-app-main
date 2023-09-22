import {AntDesign, Fontisto} from "@expo/vector-icons";
import {FlatList, Icon, View, Text, Modal} from "native-base";
import React, {FC, ReactElement, useRef, useState} from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {NotificationsModal} from "../Screens/NotificationsModal";
import {ScreenNames} from "../Helpers/ScreenNames";
import * as RootNavigation from "../Navigator/RootNavigation";
import {useHasPermissions} from "../hooks/usePermissions";
import {AppPermissions} from "../Helpers/AppPermissions";
import {useIsBoss} from "../hooks/useExpediente";

interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

interface Props {
  label: string;
  data: any;
  position: IPosition;
  content: number;
}

const Dropdown: FC<Props> = ({label, data, position, content}) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const isAuthorizer = useHasPermissions([
    AppPermissions.aprobar_solicitudes,
    AppPermissions.aprobar_asistencia,
    AppPermissions.aprobar_constancia,
    AppPermissions.aprobar_constancia_CBA,
    AppPermissions.aprobar_constancia_TGU,
    AppPermissions.aprobar_acciones_personal,
    AppPermissions.aprobar_planillas,
    AppPermissions.aprobar_vacaciones,
  ]);
  //   const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };
  const {isBoss, isLoadingIsBoss} = useIsBoss();
  const openDropdown = (): void => {
    DropdownButton.current.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number
      ) => {
        setDropdownTop(py + h);
      }
    );
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    // setSelected(item);
    setVisible(false);
    console.log("item", item);
    RootNavigation.navigate(ScreenNames.RRHH, {
      screen: ScreenNames.HOME_NEWS,
      params: {
        screen: ScreenNames.NEWS_LIST,
        params: {
          categoryId: item.id,
          categoryName: item.name,
        },
      },
    });
  };

  const onHeaderItemPress = (item: any): void => {
    // setSelected(item);
    setVisible(false);
    console.log("item", item);
    RootNavigation.navigate(ScreenNames.RRHH, {
      screen: item.screen,
    });
  };

  const solicitud = [
    {name: "Mis Solicitudes", screen: ScreenNames.LIST_REQUESTS, canShow: true},
    {
      name: "Solicitudes Por Aprobar",
      screen: ScreenNames.LIST_PENDING_APPROVAL_REQUESTS,
      canShow: isAuthorizer,
    },
    {name: "Nueva Solicitud", screen: ScreenNames.HOME_REQUESTS, canShow: true},
  ];

  const consultas = [
    {
      name: "Recibos de Pago",
      screen: ScreenNames.RECEIPT_OF_PAYMENT,
      canShow: true,
    },
    {
      name: "Saldo de Vacaciones",
      screen: ScreenNames.VACATION_BALANCE,
      canShow: true,
    },
    {
      name: "Tiempo Compensatorio",
      screen: ScreenNames.COMPENSATORY_TIME_BALANCE,
      canShow: true,
    },
    {name: "Control de Asistencia", screen: ScreenNames.MARKS, canShow: true},
  ];
  const evaluaciones = [
    {name: "Encuestas", screen: ScreenNames.SURVEY, canShow: true},
    {
      name: "Reporte Climometro",
      screen: ScreenNames.REPORTECLIMOMETRO,
      canShow: isBoss,
    },
  ];

  const renderItem = ({item}: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text bold fontSize="xs">
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const renderHeaderItem = ({item}: any): ReactElement<any, any> =>
    item.canShow && (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onHeaderItemPress(item)}
      >
        <Text bold fontSize="xs">
          {item.name}
        </Text>
      </TouchableOpacity>
    );

  const renderDropdown = (): ReactElement<any, any> => {
    const dimensions = useWindowDimensions();
    return (
      <Modal
        // h={200}
        useRNModal
        position={"absolute"}
        left={
          content != 4
            ? position?.left
            : position?.left - (position?.width + position?.width * 0.5)
        }
        // right={content == 4 ? 0 : null}
        isOpen={visible}
        onClose={() => setVisible(false)}
        mt={4}
        _backdrop={{
          _dark: {
            bg: "transparent",
          },
          bg: "transparent",
        }}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View
            w={content == 4 ? "sm" : "2xs"}
            style={[styles.dropdown, {top: dropdownTop}]}
          >
            {content == 1 ? (
              <FlatList
                data={solicitud}
                contentContainerStyle={{marginVertical: 10}}
                renderItem={renderHeaderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : content == 2 ? (
              <FlatList
                data={consultas}
                contentContainerStyle={{marginVertical: 10}}
                renderItem={renderHeaderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : content == 3 ? (
              <FlatList
                data={data}
                contentContainerStyle={{marginVertical: 10}}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : content == 4 ? (
              <View mx={3} flex={1}>
                <NotificationsModal setVisible={setVisible} />
              </View>
            ) : content == 5 ? (
              <FlatList
                data={evaluaciones}
                contentContainerStyle={{marginVertical: 10}}
                renderItem={renderHeaderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      {content != 4 && <Text style={styles.buttonText}>{label}</Text>}
      {content == 4 && <Fontisto name="bell" size={26} color="black" />}
      {/* <Icon style={styles.icon} type="font-awesome" name="chevron-down" /> */}
      {content != 4 && <Icon as={AntDesign} mt={1} size={5} name="right" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 50,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  dropdown: {
    maxHeight: "80%",
    borderColor: "#000",
    // alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    // width: "15%",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  item: {
    paddingLeft: 20,
    paddingVertical: 10,
    // borderBottomWidth: 0.5,
  },
});

export default Dropdown;
