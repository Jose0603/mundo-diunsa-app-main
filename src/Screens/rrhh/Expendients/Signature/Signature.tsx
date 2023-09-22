import { Box, Button, Image, ScrollView, Text, useToast } from "native-base";
import React, { useRef, useState } from "react";
import { Platform } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { useDispatch } from "react-redux";

import { Loading } from "../../../../Components/Loading";
import TermsAndConditions from "../../../../Components/TermsAndConditions";
import {
  AcceptTerms,
  ResetUserData,
} from "../../../../Redux/actions/auth/loginActions";
import { SaveSignature } from "../../../../Services/User";
import { useCustomToast } from "../../../../hooks/useCustomToast";

const Sign = ({ navigation }: any) => {
  const ref = useRef<SignatureViewRef>(null);
  const dispatch = useDispatch();
  const showToast = useCustomToast();
  // const toast = useToast();
  // const [privacyPolicy, setPrivacyPolicy] = useState(null);
  // const [loadingTerms, setLoadingTerms] = useState(false);
  const [sendingSignature, setSendingSignature] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [availableContinue, setAvailableContinue] = useState(false);

  const handleSignature = async (signature) => {
    setSendingSignature(true);
    try {
      const res = await SaveSignature(signature);
      console.log(res);
      if (res.result) {
        dispatch(AcceptTerms());
        showToast({
          title: "Has aceptado los terminos y condiciones",
          status: "success",
          // description: data.Message ?? 'Ocurrio un error inesperado',
        });
      } else {
        showToast({
          title: "Hubo un error",
          status: "error",
          description: res?.message ?? "Ocurrio un error inesperado",
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Hubo un error",
        status: "error",
        description: "Ocurrio un error inesperado",
      });
    } finally {
      setSendingSignature(false);
    }
  };

  const handleEmpty = () => {
    console.log("Empty");
    showToast({
      title: "Firma vacía",
      status: "error",
      description: "Debes firmar para continuar",
    });
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  // const fetchPolicy = async () => {
  //   setLoadingTerms(true);
  //   try {
  //     const res = await GetPrivacyPolicy();
  //     console.log(res);
  //     if (res.result) {
  //       setPrivacyPolicy(res?.data?.description);
  //     }
  //   } catch (error) {
  //     showToast({
  //       title: 'Hubo un error',
  //       status: 'error',
  //       description: 'Ocurrio un error al obtener la politica de privacidad',
  //     });
  //   } finally {
  //     setLoadingTerms(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPolicy();
  // }, []);

  const CustomBtn = (props: any) => (
    <Button
      bg="#3F99F7"
      _pressed={{
        backgroundColor: "#3F99F7",
      }}
      _disabled={{
        backgroundColor: "#eee",
      }}
      onPress={() => {
        // dispatch(ResetUserData());
        setShowSignature(props.continue);
      }}
    >
      <Text color="#fff">{props.label}</Text>
    </Button>
  );

  if (Platform.OS === "web") {
    return (
      <Box flex={1} bg="#fff" alignItems="center" paddingX="96">
        <Image
          style={{ width: 250, height: 200 }}
          resizeMode={"contain"}
          alt="logo mundo diunsa"
          source={require("../../../../../assets/logo_app.png")}
        />
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Ingresa desde la aplicación móvil y al aceptar nuestros términos y
          condiciones regresa para continuar
        </Text>
        <Button
          bg="#3F99F7"
          _pressed={{
            backgroundColor: "#3F99F7",
          }}
          _disabled={{
            backgroundColor: "#eee",
          }}
          onPress={() => {
            dispatch(ResetUserData());
          }}
          mt={5}
        >
          <Text color="#fff" fontSize="lg" fontWeight="bold">
            Continuar
          </Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box flex={1} safeArea alignItems={"center"} bg="#fff" pb={10}>
      <Image
        style={{ width: 100, height: 75 }}
        resizeMode={"contain"}
        alt="logo mundo diunsa"
        source={require("../../../../../assets/logo_app.png")}
      />

      {!sendingSignature ? (
        <>
          {showSignature ? (
            <>
              <Text bold fontSize={14} textAlign="center" mx={3}>
                Escribe tu firma para aceptar los términos y condiciones
              </Text>
              <SignatureScreen
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onClear={handleClear}
                autoClear={false}
                descriptionText="Por favor, escribe tu firma para continuar"
                clearText="Limpiar"
                confirmText="Continuar"
                //   dataURL={''} base64 para volver a dibujar la firma
              />
            </>
          ) : (
            <ScrollView h="50%" px={5} mb={5}>
              <TermsAndConditions />
            </ScrollView>
          )}
          {!showSignature && !sendingSignature ? (
            <CustomBtn continue label="Continuar" />
          ) : (
            <CustomBtn continue={false} label="Regresar" />
          )}
        </>
      ) : (
        <Box>
          <Loading message="Enviando Aceptacion de Politica" />
        </Box>
      )}
    </Box>
  );
};

export default Sign;
