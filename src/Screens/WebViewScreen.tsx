import { DrawerScreenProps } from "@react-navigation/drawer";
import { Box, Text } from "native-base";
import React, { useRef, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { colors } from "../Helpers/Colors";

import TopMainBar from "../Components/TopMainBar";
import { useFocusEffect } from "@react-navigation/native";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export default function WebViewScreen({ route }: IProps) {
  const [visible, setVisible] = useState(false);

  const ActivityIndicatorElement = () => {
    return (
      <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  };

  const webviewRef = useRef();
  // const [url, setUrl] = useState();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (webviewRef.current) {
  //       setUrl(route?.params?.url ?? "");
  //       console.log(
  //         "🚀 ~ file: WebViewScreen.tsx ~ line 32 ~ React.useCallback ~ route?.params?.url",
  //         route?.params?.url
  //       );
  //       webviewRef.current.reload();
  //     }
  //   }, [])
  // );

  return (
    <>
      <Box safeArea backgroundColor="#fff" flex={1}>
        <TopMainBar showBack showMenu={false} />

        <WebView
          ref={webviewRef}
          source={{ uri: route?.params?.url ?? "" }}
          startInLoadingState={true}
          renderLoading={ActivityIndicatorElement}
          onLoadStart={() => setVisible(true)}
          onLoad={() => setVisible(false)}
          incognito={true}
        />
        {visible ? <ActivityIndicatorElement /> : null}
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    flex: 1,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});
