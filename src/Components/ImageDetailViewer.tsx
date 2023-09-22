import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  PresenceTransition,
  Pressable,
  Text,
  useSafeArea,
  VStack,
} from "native-base";
import React from "react";
import { Modal, Platform } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { baseURL } from "../Axios";
import { Img } from "../interfaces/rrhh/INews";

interface IProps {
  visible: boolean;
  toggleVisible: () => void;
  showingImages: Img[] | string[];
  selectedImage: number;
}

const ImageDetailViewer = ({
  visible,
  toggleVisible,
  showingImages,
  selectedImage,
}: IProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <PresenceTransition
      visible={visible}
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
      <Modal visible={visible}>
        <ImageViewer
          enableSwipeDown
          onSwipeDown={() => {
            toggleVisible();
          }}
          renderHeader={(currentIndex?: number) => {
            return (
              <VStack
                bg="transparent"
                mt={Platform.OS === "ios" ? top : 0}
                justifyContent="center"
              >
                <HStack alignItems="flex-end" justifyContent="flex-end">
                  <Pressable onPress={toggleVisible}>
                    {({ isHovered, isFocused, isPressed }) => {
                      return (
                        <Box
                          bg={"transparent"}
                          pr={5}
                          style={{
                            transform: [
                              {
                                scale: isPressed ? 0.96 : 1,
                              },
                            ],
                          }}
                        >
                          <Ionicons name="ios-close" size={28} color="white" />
                        </Box>
                      );
                    }}
                  </Pressable>
                </HStack>
                <HStack justifyContent="center">
                  <Text color="#fff">{`${currentIndex + 1}/${
                    showingImages.length
                  }`}</Text>
                </HStack>
              </VStack>
            );
          }}
          renderIndicator={() => null}
          index={selectedImage}
          enablePreload
          saveToLocalByLongPress={false}
          imageUrls={showingImages.map((imageName) => {
            // console.log(
            //   `${baseURL}/images/${
            //     imageName.hasOwnProperty("name") ? imageName.name : imageName
            //   }`
            // );
            return {
              url: `${baseURL}/images/${
                imageName.hasOwnProperty("name") ? imageName.name : imageName
              }`,
            };
          })}
        />
      </Modal>
    </PresenceTransition>
  );
};

export default React.memo(ImageDetailViewer);
