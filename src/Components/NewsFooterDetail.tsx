import React from 'react';
import { HStack, VStack, Text as NBText, Box } from 'native-base';
import { INews } from '../interfaces/rrhh/INews';
import CustomCalendarIcon from './CustomCalendarIcon';

interface IProps {
  news: INews;
}

const NewsFooterDetail = ({ news }: IProps) => {
  return (
    <HStack px={4} pt={3}>
      <VStack maxWidth="80%" width="80%">
        <NBText style={{ zIndex: 1 }} fontSize="14" color="#000">
          {news.title}
          <NBText color="blue.500"> Lee la noticia y gana puntos</NBText>
        </NBText>
        <HStack>
          <NBText color="coolGray.700" fontSize="12" mt={2}>
            Redaccion: {news.createdBy}
          </NBText>
          {/* <NBText color="coolGray.700" ml={2}>
       {moment(news.createdAt).format('dddd DD MMMM YYYY')}
     </NBText> */}
        </HStack>
      </VStack>
      <Box maxWidth="20%" width="20%" justifyContent="center" alignItems="center" ml={5}>
        <CustomCalendarIcon date={news.createdAt} />
      </Box>
    </HStack>
  );
};

export default NewsFooterDetail;
