import {View, Text} from "react-native";
import React from "react";
import {Box, TextArea} from "native-base";
import {SaveComment} from "../Services/rrhh/News";
import {useCustomToast} from "../hooks/useCustomToast";

const NewsComment = ({newsComments, setNewsComments}) => {
  const showToast = useCustomToast();
  const sendComment = async () => {
    setSendingComment(true);
    try {
      const res = await SaveComment({
        description: inputComment,
        newsId: news.id,
      });
      const newComments = [...newsComments];
      setNewsComments([res.data, ...newComments]);
      setShowComment(false);
      setInputComment("");
    } catch (error) {
      showToast({
        title: "Hubo un error",
        status: "error",
        description: "Error al enviar el comentario",
      });
      console.error(error);
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <Box mx={7} mb={5}>
      <Text style={styles.commentInputLabel}>Comentarios</Text>
      <TextArea
        h={150}
        mb={4}
        placeholder="Escribe tu comentario"
        w={{
          base: "100%",
          md: "25%",
        }}
        value={inputComment}
        editable={!sendingComment}
        onChangeText={setInputComment}
      />
      <Button
        style={styles.reactionButton}
        appearance="fill"
        status="info"
        onPress={sendComment}
        disabled={sendingComment}
        accessoryLeft={sendingComment ? LoadingIndicator : MessageCircleIcon}
      >
        {sendingComment ? "Enviando comentario" : "Enviar comentario"}
      </Button>
    </Box>
  );
};

export default NewsComment;
