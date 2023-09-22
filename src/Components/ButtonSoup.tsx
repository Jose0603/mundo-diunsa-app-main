import {Button, FlatList, View} from "native-base";
import {IOption} from "../interfaces/shared/IOption";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import React, {useState} from "react";

interface IProps {
  array: IOption[];
  setfieldValue: (field: string, value: any) => void;
  field: string;
  value: any;
  creator?: boolean;
  isnew?: boolean;
  sizeCols?: number;
}

const ButtonSoup = ({
  array,
  setfieldValue,
  field,
  value,
  creator,
  isnew,
  sizeCols,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const renderItem = (
    item: ListRenderItemInfo<IOption>
  ): React.ReactElement => {
    var itemValue =
      typeof item.item.value == "boolean"
        ? item.item.value
        : item.item.value.trim();
    var initVal = typeof value == "boolean" ? value : value.trim();
    return (
      <View flexDirection={"row"} flexWrap={"wrap"}>
        <Button
          key={itemValue}
          variant="outline"
          onPress={() => {
            setfieldValue(field, itemValue);
          }}
          size="md"
          // color={"gray.500"}
          _disabled={{
            backgroundColor: "gray.100",
          }}
          mr={3}
          mb={3}
          borderColor={itemValue == initVal ? "#0077CD" : "gray.300"}
          bg={itemValue == initVal ? "#F2F8FC" : "transparent"}
          // style={item.item.value == value ? styles.selected : styles.unselected}
          _text={{
            color: itemValue == initVal ? "#0077CD" : "gray.500", //605D60 || 777377
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
    //   // columnWrapperStyle={{ justifyContent: "space-between" }}
    //   contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    //   numColumns={Math.ceil(array.length / (sizeCols ? sizeCols : 2))}
    //   showsVerticalScrollIndicator={false}
    //   showsHorizontalScrollIndicator={false}
    //   data={array}
    //   renderItem={renderItem}
    //   keyExtractor={(item) =>
    //     `${field}-${
    //       typeof item.value == "boolean" ? item.value : item.value.trim()
    //     }`
    //   }
    //   onEndReachedThreshold={0.5}
    // />
    <View flexDirection={"row"} flexWrap={"wrap"}>
      {array.map((item) => {
        var itemValue =
          typeof item.value == "boolean" ? item.value : item.value.trim();
        var initVal = typeof value == "boolean" ? value : value.trim();
        return (
          <Button
            key={itemValue}
            variant="outline"
            onPress={() => {
              setLoading(true);
              setfieldValue(field, itemValue);
              setLoading(false);
            }}
            size="md"
            // color={"gray.500"}
            _disabled={{
              backgroundColor: "gray.100",
            }}
            mr={3}
            mb={3}
            borderColor={itemValue == initVal ? "#0077CD" : "gray.300"}
            bg={itemValue == initVal ? "#F2F8FC" : "transparent"}
            // style={item.item.value == value ? styles.selected : styles.unselected}
            _text={{
              color: itemValue == initVal ? "#0077CD" : "gray.500", //605D60 || 777377
              fontWeight: "medium",
            }}
            isDisabled={loading || isnew ? false : creator ? false : true}
          >
            {item.label}
          </Button>
        );
      })}
    </View>
  );
};

export default ButtonSoup;
