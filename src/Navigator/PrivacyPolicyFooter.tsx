import { DrawerItem } from '@ui-kitten/components';
import { Box } from 'native-base';
import React, { ReactElement, useState } from 'react';

import TermsAndConditions from '../Components/TermsAndConditions';

export const PrivacyPolicyFooter = (props: any): ReactElement => {
  const [show, setShow] = useState(false);
  return (
    <Box>
      <DrawerItem
        title="Terminos y Condiciones"
        // accessoryLeft={() => <Feather name="home" size={16} color="black" />}
        onPress={() => {
          setShow(!show);
        }}
      />
      {show && (
        <Box alignItems="center" mx={5} mb={20}>
          <TermsAndConditions />
        </Box>
      )}
    </Box>
  );
};
