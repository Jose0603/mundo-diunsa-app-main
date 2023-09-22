import React from 'react';
import { Box, Text } from 'native-base';
import moment from 'moment';

interface IProps {
  date: string;
}

const CustomCalendarIcon = ({ date }) => {
  return (
    <Box>
      <Box
        borderRadius={10}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        borderColor="#B2B6CC"
        borderWidth={2}
        justifyContent="center"
        alignItems="center"
      >
        <Text color="coolGray.700">{moment(date).format('MMM')}</Text>
      </Box>
      <Box
        px={3}
        borderRadius={10}
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        borderColor="#B2B6CC"
        borderWidth={2}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="18" color="#0075C9" bold>
          {moment(date).format('DD')}
        </Text>
      </Box>
    </Box>
  );
};

export default CustomCalendarIcon;
