import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Center,
  HStack,
  PresenceTransition,
  Pressable,
  Text,
  TextArea,
} from "native-base";
import React, { useCallback, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Loading } from "../../../../Components/Loading";

interface Props {
  showComment: boolean;
  setShowComment: (showComment: boolean) => void;
  sendComment: (
    inputString: string,
    afterSendComment: (closeCommentBox: () => void) => void
  ) => void;
  sendingComment: boolean;
  // comment: any;
  // setInputComment: any;
}
export const CommentBox = ({
  showComment,
  setShowComment,
  sendComment,
  sendingComment,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const [comment, setComment] = useState("");
  if (sendingComment) {
    return (
      <HStack
        w={Platform.OS === "web" ? (width * 75) / 100 : width}
        px={5}
        bg={"#fff"}
        h={10}
        borderTopWidth="1"
        borderColor="#ccc"
        justifyContent="center"
        alignItems="center"
      >
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
          <Loading message="Enviando comentario..." />
        </PresenceTransition>
      </HStack>
    );
  }
  return (
    <>
      {showComment && (
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
          <Center>
            <HStack
              bg={"#fff"}
              px={3}
              maxW={Platform.OS === "web" ? (width * 75) / 100 : width}
              w={Platform.OS === "web" ? (width * 75) / 100 : width}
              borderTopWidth="1"
              borderColor="#ccc"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box maxW="80%" w="80%" mt={2}>
                <Pressable
                  mr={4}
                  onPress={() => {
                    setShowComment(false);
                  }}
                  disabled={sendingComment}
                >
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <Box
                        bg={"transparent"}
                        px={0.5}
                        rounded="8"
                        style={{
                          transform: [
                            {
                              scale: isPressed ? 0.96 : 1,
                            },
                          ],
                        }}
                      >
                        <Text bold>Cancelar</Text>
                      </Box>
                    );
                  }}
                </Pressable>
                <TextArea
                  h={50}
                  mb={4}
                  placeholder="Escribe tu comentario"
                  w="100%"
                  value={comment}
                  editable={!sendingComment}
                  onChangeText={setComment}
                  backgroundColor="#fff"
                />
              </Box>
              <Pressable
                onPress={() => {
                  if (comment.trim().length > 1) {
                    sendComment(comment, (closeCommentBox: () => void) => {
                      setComment("");
                      closeCommentBox();
                    });
                  }
                }}
                disabled={sendingComment}
                h={50}
                _pressed={{ bg: "coolGray.100" }}
                rounded="full"
                px={2}
                justifyContent="center"
                alignItems="center"
                flex={1}
                maxW="15%"
                w="15%"
                mt={2}
                mr={2}
              >
                <Center>
                  <Ionicons
                    name="ios-paper-plane-outline"
                    size={16}
                    color="black"
                  />
                </Center>
              </Pressable>
            </HStack>
          </Center>
        </PresenceTransition>
      )}
    </>
  );
};
