import React, { useEffect, useState } from 'react';
import { Button, Actionsheet, Box, Text, FormControl, HStack, VStack, Pressable, Select, CheckIcon } from 'native-base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import moment from 'moment';
import { GetAllNewsCategories } from '../Services/rrhh/News';
import { INewsCategory } from '../interfaces/rrhh/INews';
import { Loading } from './Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/reducers/rootReducer';
import { setNewsCategoryList } from '../Redux/reducers/news/categoriesSlice';

interface IProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setStartDate: any;
  setEndDate: any;
  selectedCategory: string;
  setSelectedCategory: any;
  setSearch: any;
  search: boolean;
}

export const ActionSheetNews = ({
  onOpen,
  onClose,
  isOpen,
  setSelectedCategory,
  selectedCategory = '-1',
  setSearch,
  setStartDate,
  setEndDate,
  search,
}: IProps) => {
  const [horaDesdeShow, setHoraDesdeShow] = useState<Boolean>(false);
  const [horaHastaShow, setHoraHastaShow] = useState<Boolean>(false);
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());
  //   const [categories, setCategories] = useState<INewsCategory[]>([]);
  const [isLoading, setIsLoaging] = useState(false);
  const dispatch = useDispatch();
  const categories: INewsCategory[] = useSelector((state: RootState) => state.newsCategory.newsCategories);

  const shouldFetchCategories = categories.length === 0;

  useEffect(() => {
    setIsLoaging(true);
    (async () => {
      try {
        const res = await GetAllNewsCategories();

        if (res && res.length > 0) {
          dispatch(
            setNewsCategoryList([
              {
                id: -1,
                name: 'Todas',
                createdAt: '',
                updatedAt: '',
                createdBy: '',
                updatedBy: '',
                newsCategories: [],
              },
              ...res,
            ])
          );
        }
      } catch (error) {
      } finally {
        setIsLoaging(false);
      }
    })();
  }, [shouldFetchCategories]);

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          <Box w="100%" px={4} py={5} justifyContent="center">
            <HStack>
              <Text
                bold
                fontSize="16"
                color="gray.700"
                _dark={{
                  color: 'gray.300',
                }}
              >
                Filtrar Noticias
              </Text>
            </HStack>
            <Box my={4}>
              {isLoading ? (
                <Loading message="Cargando categorias..." />
              ) : categories && categories.length > 0 ? (
                <>
                  <Text
                    fontSize="14"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}
                  >
                    Categoria
                  </Text>
                  <Select
                    accessibilityLabel="SELECCIONE"
                    _selectedItem={{
                      endIcon: <CheckIcon size={5} />,
                    }}
                    selectedValue={selectedCategory}
                    mt={1}
                    onValueChange={(itemValue: string) => {
                      setSelectedCategory(itemValue);
                    }}
                  >
                    {categories &&
                      categories.length > 0 &&
                      categories.map(({ id, name }, index) => {
                        return <Select.Item key={`status-${index}`} label={name} value={id.toString()} />;
                      })}
                  </Select>
                </>
              ) : (
                <></>
              )}
            </Box>
            <Box flexDirection={Platform.OS === 'android' ? 'row' : 'column'}>
              <VStack width={Platform.OS === 'android' ? '50%' : '100%'}>
                <FormControl marginY={1}>
                  <Text
                    fontSize="14"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}
                  >
                    Desde:
                  </Text>
                  {Platform.OS === 'android' ? (
                    <>
                      <Pressable
                        w="70%"
                        onPress={() => setHoraDesdeShow(true)}
                        borderColor="#eee"
                        borderWidth={1}
                        p={2}
                      >
                        <Text>{startHour && moment.utc(startHour).format('DD/MM/YYYY')}</Text>
                      </Pressable>
                      {horaDesdeShow && (
                        <RNDateTimePicker
                          value={startHour}
                          mode="date"
                          display="default"
                          timeZoneOffsetInMinutes={0}
                          onChange={(e, selectedDate) => {
                            setHoraDesdeShow(false);
                            if (selectedDate != null) {
                              setStartDate(selectedDate);
                              setStartHour(selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <RNDateTimePicker
                      value={startHour}
                      mode="date"
                      display="default"
                      timeZoneOffsetInMinutes={0}
                      onChange={(e, selectedDate) => {
                        setHoraDesdeShow(false);
                        if (selectedDate != null) {
                          setStartDate(selectedDate);
                          setStartHour(selectedDate);
                        }
                      }}
                    />
                  )}
                </FormControl>
              </VStack>
              <VStack width={Platform.OS === 'android' ? '50%' : '100%'}>
                <FormControl marginY={1}>
                  <Text
                    fontSize="14"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}
                  >
                    Hasta:
                  </Text>
                  {Platform.OS === 'android' ? (
                    <>
                      <Pressable
                        onPress={() => setHoraHastaShow(true)}
                        w="70%"
                        borderColor="#eee"
                        borderWidth={1}
                        p={2}
                      >
                        <Text>{endHour && moment.utc(endHour).format('DD/MM/YYYY')}</Text>
                      </Pressable>
                      {horaHastaShow && (
                        <RNDateTimePicker
                          value={endHour}
                          mode="date"
                          timeZoneOffsetInMinutes={0}
                          onChange={(e, selectedDate) => {
                            setHoraHastaShow(false);
                            if (selectedDate != null) {
                              setEndDate(selectedDate);
                              setEndHour(selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <RNDateTimePicker
                      value={endHour}
                      mode="date"
                      timeZoneOffsetInMinutes={0}
                      onChange={(e, selectedDate) => {
                        setHoraHastaShow(false);
                        if (selectedDate != null) {
                          setEndDate(selectedDate);
                          setEndHour(selectedDate);
                        }
                      }}
                    />
                  )}
                </FormControl>
              </VStack>
            </Box>
            <Box>
              <Button
                size="lg"
                my={3}
                onPress={() => {
                  setSearch(!search);
                  onClose();
                }}
              >
                Filtrar
              </Button>
            </Box>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
