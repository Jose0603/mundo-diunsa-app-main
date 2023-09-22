import { Ionicons } from '@expo/vector-icons';
import { Button, HStack, Icon, Input } from 'native-base';
import React from 'react';

interface Props {
  handleChange: (text: string) => void;
  handleSearch: () => void;
  value: string | undefined;
}

export const SearchBar = ({ handleChange, value, handleSearch }: Props) => {
  return (
    <HStack w="100%" space={5} alignSelf="center">
      {/* <Heading fontSize="lg">Cupertino</Heading> */}
      <Input
        onChangeText={handleChange}
        onKeyPress={(e) => {
          console.log('🚀 ~ file: SearchBar.tsx ~ line 19 ~ SearchBar ~ e.nativeEvent.key', e.nativeEvent.key);
          if (e.nativeEvent.key === 'Enter') {
            handleSearch();
          }
        }}
        value={value}
        returnKeyLabel="Buscar"
        returnKeyType="search"
        placeholder="Buscar"
        variant="filled"
        width="100%"
        borderRadius="10"
        py="2"
        px="2"
        InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
        InputRightElement={
          <Button variant="outlined" onPress={handleSearch}>
            Buscar
          </Button>
        }
      />
    </HStack>
  );
};
