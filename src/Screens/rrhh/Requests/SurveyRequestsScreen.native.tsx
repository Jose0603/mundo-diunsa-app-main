import {AntDesign, Feather} from "@expo/vector-icons";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {Icon, ListItem} from "@ui-kitten/components";
import {Box, FlatList, Text} from "native-base";
import React, {useCallback, useState} from "react";
import {StyleSheet} from "react-native";
import {NoData} from "../../../Components/NoData";

import TopMainBar from "../../../Components/TopMainBar";
import {queryClient} from "../../../Configs/QueryClient";
import {QueryKeys} from "../../../Helpers/QueryKeys";
import {ScreenNames} from "../../../Helpers/ScreenNames";
import useIncidents from "../../../hooks/useIncidents";
import {useClimometroInfo} from "../../../hooks/usePregunta";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const SurveyRequestsScreen = ({navigation}: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const {climometroInfo, isLoadingClimometroInfo} = useClimometroInfo();
  const {
    Surveys: {data: surveys},
  } = useIncidents();

  const renderItem = (info) => (
    <ListItem
      title={info.item.title}
      // accessoryLeft={<Icon name="file-outline" />}
      accessoryLeft={<Feather name="file" size={24} />}
      // accessoryRight={<Icon name="arrow-ios-forward-outline" />}
      accessoryRight={<AntDesign name="right" size={16} />}
      description={info.item.description}
      onPress={() => {
        if (info.item.isEncuesta && info.item.description != "Climometro")
          navigation.navigate("encuestas", {
            tipoEncuesta: info.item.id,
          });
        else if (
          info.item.isEncuesta &&
          info.item.description == "Climometro"
        ) {
          navigation.navigate("climometro", {
            data: climometroInfo,
            correlativo: "",
          });
        } else {
          navigation.navigate(ScreenNames.WEBVIEWSCREEN, {url: info.item.link});
        }
      }}
    ></ListItem>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      queryClient.refetchQueries([QueryKeys.SURVEYS]);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (!surveys)
    return (
      <Box safeArea backgroundColor="#fff" height="100%">
        <TopMainBar showBack showMenu={false} />
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text>No hay encuestas disponibles</Text>
          <Text>Arrastra hacia abajo para refrescar</Text>
        </Box>
      </Box>
    );

  return (
    <Box safeArea backgroundColor="#fff" height="100%">
      <TopMainBar showBack showMenu={false} />
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={surveys}
        renderItem={renderItem}
        ListEmptyComponent={
          <NoData message="No hay evaluaciones por el momento" />
        }
      />
      {/* {showModal && (
        <SurveyQuestionClimometroModal
          showModal={showModal}
          setShowModal={setShowModal}
          navigation={navigation}
        />
      )} */}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: "green",
  },
  item: {
    marginVertical: 4,
  },
});
