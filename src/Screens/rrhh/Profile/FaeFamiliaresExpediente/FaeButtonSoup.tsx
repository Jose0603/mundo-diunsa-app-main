import {Button, FlatList, View} from "native-base";
import {IOption} from "../../../../interfaces/shared/IOption";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import React from "react";
import {IFaeFamiliares} from "../../../../interfaces/rrhh/IExpExpediente";

interface IProps {
  array: IOption[];
  setfieldValue: (field: string, value: any) => void;
  field: string;
  value: any;
  creator?: boolean;
  isnew?: boolean;
  completeArray?: IFaeFamiliares;
}

const FaeButtonSoup = ({
  array,
  setfieldValue,
  field,
  value,
  creator,
  isnew,
  completeArray,
}: IProps) => {
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const renderItem = (
    item: ListRenderItemInfo<IOption>
  ): React.ReactElement => {
    return (
      <View flexDirection={"row"} flexWrap={"wrap"}>
        <Button
          key={item.item.value ? 1 : 0}
          variant="outline"
          onPress={() => {
            if (field == "faeEstudia") {
              setfieldValue(field, item.item.value);
              setfieldValue("faeBeca", false);
              setfieldValue("faeNivelEstudio", "");
              setfieldValue("faeLugarEstudio", "");
            } else if (field == "faeTrabaja") {
              setfieldValue(field, item.item.value);
              setfieldValue("faeCargo", "");
              setfieldValue("faeLugarTrabajo", "");
              setfieldValue("faeTelefonoTrabajo", "");
              setfieldValue("faeSalario", 0);
              setfieldValue("faeCodmon", "");
            } else if (field == "faeFallecido") {
              setfieldValue(field, item.item.value);
              if (item.item.value == false) {
                setfieldValue("faeFechaFallecido", yesterday);
              } else {
                setfieldValue("faeFechaFallecido", yesterday);
              }
            } else {
              setfieldValue(field, item.item.value);
            }
          }}
          size="md"
          _disabled={{
            bg: "gray.100",
          }}
          mr={3}
          mb={3}
          borderColor={item.item.value == value ? "#0077CD" : "gray.300"}
          bg={item.item.value == value ? "#F2F8FC" : "transparent"}
          // style={item.item.value == value ? styles.selected : styles.unselected}
          _text={{
            color: item.item.value == value ? "#0077CD" : "gray.500", //605D60 || 777377
            fontWeight: "medium",
          }}
          isDisabled={isnew ? false : creator ? false : true}
        >
          {item.item.label}
        </Button>
      </View>
    );
  };

  return (
    // <FlatList
    //   scrollEnabled={false}
    //   horizontal={array.length < 3 ? true : false}
    //   // contentContainerStyle={{ alignSelf: "flex-start" }}
    //   numColumns={Math.ceil(array.length / 2)}
    //   showsVerticalScrollIndicator={false}
    //   showsHorizontalScrollIndicator={false}
    //   data={array}
    //   renderItem={renderItem}
    //   keyExtractor={(item) => `${field}-${item.value ? 1 : 0}`}
    //   onEndReachedThreshold={0.5}
    // />
    <View flexDirection={"row"} flexWrap={"wrap"}>
      {array.map((item) => {
        return (
          <Button
            key={item.value ? `${item.label}-1` : `${item.label}-0`}
            variant="outline"
            onPress={() => {
              if (field == "faeEstudia") {
                setfieldValue(field, item.value);
                setfieldValue("faeBeca", false);
                setfieldValue("faeNivelEstudio", "");
                setfieldValue("faeLugarEstudio", "");
              } else if (field == "faeTrabaja") {
                setfieldValue(field, item.value);
                setfieldValue("faeCargo", "");
                setfieldValue("faeLugarTrabajo", "");
                setfieldValue("faeTelefonoTrabajo", "");
                setfieldValue("faeSalario", 0);
                setfieldValue("faeCodmon", "");
              } else if (field == "faeFallecido") {
                setfieldValue(field, item.value);
                if (item.value == false) {
                  setfieldValue("faeFechaFallecido", yesterday);
                } else {
                  setfieldValue("faeFechaFallecido", yesterday);
                }
              } else {
                setfieldValue(field, item.value);
              }
            }}
            size="md"
            _disabled={{
              bg: "gray.100",
            }}
            mr={3}
            mb={3}
            borderColor={item.value == value ? "#0077CD" : "gray.300"}
            bg={item.value == value ? "#F2F8FC" : "transparent"}
            // style={item.value == value ? styles.selected : styles.unselected}
            _text={{
              color: item.value == value ? "#0077CD" : "gray.500", //605D60 || 777377
              fontWeight: "medium",
            }}
            isDisabled={isnew ? false : creator ? false : true}
          >
            {item.label}
          </Button>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "#F2F8FC",
    borderWidth: 2,
    borderColor: "#0077CD",
    margin: 9,
    // minWidth: "26%",
  },
  unselected: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#C0C0C0",
    margin: 9,
    // minWidth: "26%",
  },
});

export default FaeButtonSoup;
