import { Box, Modal } from 'native-base';
import React from 'react';
import { Loading } from './Loading';

interface IProps {
  showLoadingModal: boolean;
  setShowLoadingModal: (showLoadingModal: boolean) => void;
}

const LoadingModal = ({ showLoadingModal, setShowLoadingModal }: IProps) => {
  return (
    <Modal
      isOpen={showLoadingModal}
      // onClose={() => {
      //   setShowLoadingModal(false);
      // }}
      _web={{
        paddingX: '64',
      }}
    >
      <Modal.Content width="95%" maxWidth="95%" justifyContent="center" alignItems="center">
        <Modal.Body justifyContent="center" alignItems="center">
          <Box h="100%" justifyContent="center" alignItems="center">
            <Loading message="Cargando Detalle..." />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default LoadingModal;
