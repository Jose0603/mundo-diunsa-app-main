import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import { Box, FlatList, Heading, HStack, Pressable, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { Loading } from '../../../Components/Loading';
import { NoData } from '../../../Components/NoData';
import TopMainBar from '../../../Components/TopMainBar';
import { useJobOffers } from '../../../hooks/useJobOffer';
import { IJobOffer } from '../../../interfaces/rrhh/IJobOffer';
import JobOfferDetailModal from './JobOfferDetailModal';

interface IProps {
  moduleName: string;
}
interface IProps extends NativeStackScreenProps<any, any> {}

const JobOffersScreen = ({ navigation }: IProps) => {
  const { jobOffers, isLoadingJobOffers } = useJobOffers();
  const [selectedModel, setSelectedModel] = useState<IJobOffer | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  console.log('🚀 ~ file: JobOffersScreen.tsx:20 ~ JobOffersScreen ~ jobOffers:', jobOffers);

  const renderItem = ({ item }: ListRenderItemInfo<IJobOffer>) => {
    console.log(item);
    return (
      <Pressable
        onPress={() => {
          setSelectedModel(item);
          setShowModal(true);
        }}
        _pressed={{
          backgroundColor: '#eee',
        }}
      >
        <HStack justifyContent="space-between" p={2} px={3}>
          <VStack>
            <Text>{item?.cosNombre}</Text>
            <Text>{moment(item?.cosFechaSolicitud).format('DD MMM YYYY')}</Text>
          </VStack>
          <VStack>
            <Feather name="chevron-right" size={24} color="black" />
          </VStack>
        </HStack>
      </Pressable>
    );
  };

  return (
    <Box safeAreaTop flex={1} backgroundColor="#fff">
      <TopMainBar showMenu={false} />
      <Box px={5} flex={1} h="100%">
        {isLoadingJobOffers ? (
          <Loading />
        ) : (
          <FlatList
            data={jobOffers}
            renderItem={renderItem}
            ListEmptyComponent={<NoData message="No hay ofertas por el momento" />}
            ListHeaderComponent={
              <Box maxHeight={20}>
                <Heading>Ofertas de empleos</Heading>
                <Text size="xs">Aqui puedes ver y aplicar a las ofertas de empleos que tenemos para ti</Text>
              </Box>
            }
            // bg="yellow.100"
          />
        )}
        <JobOfferDetailModal model={selectedModel} showModal={showModal} setShowModal={setShowModal} />
      </Box>
    </Box>
  );
};

export default JobOffersScreen;
