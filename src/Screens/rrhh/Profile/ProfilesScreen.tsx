import { Box,Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

import { ProfileData } from "./profileData";
import { SimpleLineIcons } from "@expo/vector-icons";

export const ProfilesScreen = ({ navigation }) => {
  return (
    <Box safeAreaTop backgroundColor="#F2F8FC" height="100%">
      <Box style={styles.container} justifyContent="center">
        <Text color={"#0077CD"} fontSize="2xl" fontWeight={500}>
          <SimpleLineIcons
            name="menu"
            size={24}
            color="#000"
            onPress={() => {
              navigation.toggleDrawer();
            }}
            style={{ marginRight: 10 }}
          />{" "}
          Mi Expediente
        </Text>
      </Box>
      <Box flex={1}>
        <ProfileData navigation />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
    marginLeft: "3%",
    marginTop: "4%",
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: "green",
  },
  item: {
    marginVertical: 4,
  },
});
