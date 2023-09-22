import { Box } from 'native-base';
import React from 'react';

import TopMainBar from '../../Components/TopMainBar';
import { UserMainContent } from './UserMainContent';

export const DashboardRRHHScreen = () => {
  return (
    <Box safeAreaTop bg="#fff" flex={1}>
      <TopMainBar />
      <UserMainContent />
    </Box>
  );
};
