import {Button, FormControl, TextArea} from "native-base";
import React, {useState} from "react";

export interface IProps {
  // comentario: string;
  // setComentario: (comentario: string) => void;
  canContinue: () => boolean;
  isApproving: boolean;
  Approve: (comentario: string) => void;
  Deny: (comentario: string) => void;
}

const AuthorizationComment = ({
  /*comentario, setComentario,*/ canContinue,
  isApproving,
  Approve,
  Deny,
}: IProps) => {
  const [comentario, setComentario] = useState("");

  const isDisabled = comentario.trim() === "" || isApproving;
  return (
    <>
      <FormControl isRequired>
        <FormControl.Label>Comentario:</FormControl.Label>
        <TextArea
          h={50}
          placeholder="Escribir..."
          w={{
            base: "100%",
          }}
          _focus={{
            bgColor: "#fff",
          }}
          value={comentario}
          onChangeText={(itemValue: string) => {
            setComentario(itemValue);
            // comentario = itemValue;
          }}
          autoCompleteType={undefined}
        />
      </FormControl>
      <Button.Group space={2} my={4}>
        <Button
          variant="outline"
          colorScheme={isDisabled ? "coolGray" : "blue"}
          size="lg"
          onPress={() => {
            Deny(comentario);
          }}
          disabled={isDisabled}
        >
          Denegar
        </Button>
        <Button
          variant="solid"
          colorScheme={isDisabled ? "coolGray" : "blue"}
          size="lg"
          onPress={() => {
            Approve(comentario);
          }}
          disabled={isDisabled}
        >
          Autorizar
        </Button>
      </Button.Group>
    </>
  );
};

export default AuthorizationComment;
