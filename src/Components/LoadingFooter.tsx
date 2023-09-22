import { View, Text } from 'react-native';
import React from 'react';
import { Box } from 'native-base';
import { Loading } from './Loading';

interface IProps {
  isLoading: boolean;
  message?: string;
}

const LoadingFooter = ({ isLoading, message }: IProps) => {
  return <Box py={3}>{isLoading ? <Loading message={message} /> : null}</Box>;
};

export default LoadingFooter;
