import {DrawerScreenProps} from "@react-navigation/drawer";
import {Icon, ListItem} from "@ui-kitten/components";
import {Box, FlatList, Text, View, VStack} from "native-base";
import React, {useCallback, useState} from "react";
import {StyleSheet} from "react-native";
import {NoData} from "../../../Components/NoData";

import TopMainBar from "../../../Components/TopMainBar";
import {queryClient} from "../../../Configs/QueryClient";
import {QueryKeys} from "../../../Helpers/QueryKeys";
import {ScreenNames} from "../../../Helpers/ScreenNames";
import useIncidents from "../../../hooks/useIncidents";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const SurveyRequestsScreen = ({navigation}: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState(false);

  const {
    Surveys: {data: surveys},
  } = useIncidents();

  const renderItem = (info) => (
    <View w={"25%"}>
      <ListItem
        title={info.item.title}
        accessoryLeft={<Icon name="file-outline" />}
        accessoryRight={<Icon name="arrow-ios-forward-outline" />}
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
            navigation.navigate("encuestas", {
              tipoEncuesta: info.item.id,
            });
          } else {
            const aElement = document.createElement("a");
            aElement.href = info.item.link;
            aElement.setAttribute("target", "_blank");
            aElement.click();
          }
          // navigation.navigate(ScreenNames.WEBVIEWSCREEN, {
          //   url: info.item.link,
          // });
        }}
      ></ListItem>
    </View>
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

  // if (!surveys)
  //   return (
  //     <Box
  //       safeArea
  //       backgroundColor="#fff"
  //       height="100%"
  //       justifyContent={"center"}
  //     >
  //       <TopMainBar showBack showMenu={false} />
  //       <Box flex={1} justifyContent="center" alignItems="center">
  //         <Text>No hay encuestas disponibles</Text>
  //       </Box>
  //     </Box>
  //   );

  return (
    <Box safeArea backgroundColor="#fff" flex={1}>
      <TopMainBar showBack showMenu={false} />
      <Box h={"full"} w={"full"}>
        <VStack mt={5} mx={20}>
          <Text fontSize="xl" mb={5}>
            Evaluaciones
          </Text>
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
        </VStack>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
  },
  contentContainer: {
    // paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: "green",
  },
});
