import { useToast } from 'native-base';
import React from 'react';
import { Text, View } from 'react-native';

import { ToastAlert } from '../Components/ToastAlert';

interface Props {
  title: string;
  description?: string;
  status: 'warning' | 'success' | 'error';
}

export const useCustomToast = () => {
  const toast = useToast();

  const show = ({ title, description = '', status }: Props) => {
    toast.show({
      render: ({ id }) => (
        <ToastAlert id={id} title={title} variant={'left-accent'} description={description} status={status} />
      ),
    });
  };
  return show;
};
