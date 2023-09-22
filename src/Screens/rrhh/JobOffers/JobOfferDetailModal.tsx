import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import moment from 'moment';
import { Box, Button, Divider, Modal, ScrollView, Text, VStack } from 'native-base';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import { useMutation } from 'react-query';

import { Loading } from '../../../Components/Loading';
import { colors } from '../../../Helpers/Colors';
import { useCustomToast } from '../../../hooks/useCustomToast';
import { IJobOffer } from '../../../interfaces/rrhh/IJobOffer';
import { ApplyToJobOffer } from '../../../Services/rrhh/JobOffer';
import { CustomImageRenderer } from '../News/articles';

export interface IProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  model: IJobOffer;
}

const JobOfferDetailModal = ({ showModal, model, setShowModal }: IProps) => {
  const showToast = useCustomToast();
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  const renderers = {
    iframe: IframeRenderer,
    img: CustomImageRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
    iframe: {
      scalesPageToFit: true,
    },
  };

  const mutation = useMutation(
    (cosCodigo: number) => {
      return ApplyToJobOffer(cosCodigo);
    },
    {
      onError: () => {
        showToast({
          title: 'Hubo un error',
          status: 'error',
          description: 'Ocurrio un error inesperado',
        });
      },
      onSettled: (data) => {
        console.log('RESULTADO', data.data);
        if (data.result) {
          showToast({
            title: data.message ?? `Se ha enviado tu aplicación`,
            status: 'success',
          });
          setShowModal(false);
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: data.message ?? 'Ocurrio un error inesperado',
          });
        }
      },
    }
  );

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        if (!mutation.isLoading) setShowModal(false);
      }}
      avoidKeyboard
      // _web={{
      //   paddingX: '48',
      // }}
      size={isWeb ? 'lg' : 'full'}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header alignItems="center">
          <Text
            bold
            color={'warmGray.600'}
            _dark={{
              color: 'warmGray.200',
            }}
            fontSize="lg"
          >
            Oferta de empleo
          </Text>
          <Text
            color={'blue.600'}
            _dark={{
              color: 'warmGray.200',
            }}
            fontSize="md"
          >
            {model?.cosNombre}
          </Text>
          <Text
            color={'blue.600'}
            _dark={{
              color: 'warmGray.200',
            }}
            fontSize="xs"
          >
            {moment(model?.cosFechaSolicitud).format('DD MMM YYYY')}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <ScrollView>
            <Box flexDir={isWeb ? 'row' : 'column'} mx={3}>
              <VStack w={isWeb ? '50%' : '100%'} my={2}>
                <Text color={'warmGray.400'} fontSize="md">
                  Plaza
                </Text>
                <Text color={'warmGray.800'} fontSize="md">
                  {model?.cosNombrePlaza}
                </Text>
              </VStack>
              {/* <VStack w={isWeb ? '50%' : '100%'} my={2}>
                <Text color={'warmGray.400'} fontSize="md">
                  Tipo de Contrato
                </Text>
                <Text color={'warmGray.800'} fontSize="md">
                  {model?.cosCodtco}
                </Text>
              </VStack> */}
            </Box>
            <Box flexDir={isWeb ? 'row' : 'column'} mx={3}>
              <VStack w={isWeb ? '50%' : '100%'} my={2}>
                <Text color={'warmGray.400'} fontSize="md">
                  Inicio de contratacion
                </Text>
                <Text color={'warmGray.800'} fontSize="md">
                  {moment(model?.cosFechaIniContratacion).format('DD MMM YYYY')}
                </Text>
              </VStack>
            </Box>
            <Divider />
            <Text color={'warmGray.800'} bold fontSize={isWeb ? 'sm' : 'lg'} mt={2}>
              Detalle de oferta
            </Text>
            <Box
              backgroundColor="#fff"
              // style={Platform.OS === "web" ? styles.newWeb : styles.newMobile}
            >
              <RenderHtml
                renderers={renderers}
                contentWidth={Platform.OS === 'web' ? (width * 75) / 100 : width}
                WebView={WebView}
                // tagsStyles={tagsStyles}
                source={{
                  html: model?.cosTextoOportunidad,
                }}
                tagsStyles={{
                  img: {
                    width: '60%',
                    height: 'auto',
                  },
                }}
                customHTMLElementModels={customHTMLElementModels}
                renderersProps={renderersProps}
              />
            </Box>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer justifyContent="center">
          {mutation.isLoading ? (
            <Loading message="Aplicando..." />
          ) : (
            <Button
              bg={colors.secondary}
              _pressed={{
                bgColor: colors.secondary,
              }}
              onPress={() => {
                mutation.mutateAsync(model.cosCodigo);
              }}
            >
              Aplicar a oferta
            </Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default JobOfferDetailModal;
