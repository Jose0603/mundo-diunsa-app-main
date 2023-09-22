import { FormikErrors } from "formik";
import {
  FormControl,
  PresenceTransition,
  WarningOutlineIcon,
} from "native-base";
import React from "react";
interface IProps {
  message: string | undefined | Date | string[] | FormikErrors<Date>;
}
export function FormErrorMessage({ message }: IProps) {
  return (
    <PresenceTransition
      visible={Boolean(message)}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 150,
        },
      }}
    >
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {message}
      </FormControl.ErrorMessage>
    </PresenceTransition>
  );
}
