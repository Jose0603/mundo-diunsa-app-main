import {
  Actionsheet,
  Box,
  Button,
  FlatList,
  View,
  Text,
  Icon,
  Input,
} from 'native-base';
import { IOption } from '../../../interfaces/shared/IOption';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { sentenceCase } from '../../../Helpers/FormatToSenteceCase';

interface IProps {
  array: IOption[];
  setFieldValue: (field: string, value: any) => void;
  field: string;
  value: any;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  place: number;
  setData?: (data: any) => void;
  setExtraData?: (data: any) => void;
}

const PlaceActionSheet = ({
  array,
  setFieldValue,
  field,
  value,
  isOpen,
  onOpen,
  onClose,
  place,
  setData,
  setExtraData,
}: IProps) => {
  const [info, setInfo] = useState<IOption[]>(array);
  const [flag, setFlag] = useState(1);
  const { bottom } = useSafeAreaInsets();

  const handleSearch = (text: String) => {
    const filteredData = array.filter((x) =>
      x.label.toLowerCase().includes(text.toLowerCase())
    );
    setFlag(0);
    setInfo(filteredData);
  };

  const renderItem = (
    item: ListRenderItemInfo<IOption>
  ): React.ReactElement => {
    return (
      <View>
        <TouchableOpacity
          key={item.item.value}
          onPress={() => {
            if (place == 1) {
              if (value != item.item.value) {
                setExtraData(1);
                setData(item.item.value);
                setFieldValue('expCoddepNac', 0);
                setFieldValue('expCodmunNac', 0);
              }

              setFieldValue(field, item.item.value);
            } else if (place == 2) {
              if (value != item.item.value) {
                setExtraData(2);
                setFieldValue('expCodmunNac', 0);
              }
              setData(+item.item.value);
              setFieldValue(field, +item.item.value);
            } else if (place == 3) {
              setData(+item.item.value);
              setFieldValue(field, +item.item.value);
            }
            onClose();
          }}
        >
          <Box
            flexDirection={'row'}
            flexWrap={'wrap'}
            justifyContent='space-between'
            alignItems='center'
            px={4}
            py={2}
            borderBottomWidth={1}
            borderBottomColor='gray.200'
            _dark={{
              borderBottomColor: 'gray.700',
            }}
          >
            <Text
              fontSize='16'
              color='gray.500'
              _dark={{
                color: 'gray.300',
              }}
            >
              {sentenceCase(item.item.label)}
            </Text>
            {item.item.value == value && (
              <Text
                fontSize='16'
                color='blue.500'
                _dark={{
                  color: 'blue.300',
                }}
              >
                Seleccionado
              </Text>
            )}
          </Box>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} size='full'>
      <Actionsheet.Content>
        <Box w='100%' px={4} justifyContent='center'>
          <Text
            fontSize='16'
            color='gray.500'
            _dark={{
              color: 'gray.300',
            }}
          >
            {place == 1
              ? 'Paises'
              : place == 2
              ? 'Departamentos'
              : 'Municipios'}
          </Text>
          <Input
            onChangeText={(e) => {
              setTimeout(() => {
                handleSearch(e);
              }, 250);
            }}
            placeholder='Buscar...'
            width='100%'
            borderRadius='full'
            my='3'
            px='1'
            fontSize='14'
            _focus={{
              backgroundColor: 'white',

              borderColor: 'gray.300',
            }}
            _hover={{
              backgroundColor: 'white',
            }}
            InputLeftElement={
              <Icon
                m='2'
                ml='3'
                size='6'
                color='gray.400'
                as={<MaterialIcons name='search' />}
              />
            }
          />
        </Box>
        <Box w='100%' h='100%' pb={bottom}>
          <FlatList
            data={flag == 1 ? array : info}
            renderItem={renderItem}
            keyExtractor={(item) => `${field}-${item.value}`}
            onEndReachedThreshold={0.5}
            h={'100%'}
            mb={'30%'}
          />
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PlaceActionSheet;
