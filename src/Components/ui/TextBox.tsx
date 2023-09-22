import { HStack, Text, IInputProps, TextArea as NBInput, Box, PresenceTransition } from 'native-base';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

interface ICustomInput extends IInputProps {
  maxLength?: number;
  showMissing?: boolean;
  name: string;
}

export default function TextBox({
  name,
  defaultValue,
  maxLength = 0,
  showMissing = true,
  value,
  ...rest
}: ICustomInput) {
  const maxValue = maxLength ?? 0;

  const formContext = useFormContext();

  const { field } = useController({ name, defaultValue });

  if (!formContext || !name) {
    const msg = !formContext ? 'El input debe estar dentro de un FormProvider' : 'Se debe definir el nombre del input';
    console.error(msg);
    return null;
  }

  return (
    <Box>
      <NBInput
        autoCompleteType={undefined}
        w={{
          base: '100%',
        }}
        borderWidth={1}
        py={3}
        _focus={{
          backgroundColor: '#FFFFFF',
          borderColor: '#6364FD',
        }}
        onChangeText={(e) => {
          field.onChange(e.trimStart());
        }}
        onBlur={field.onBlur}
        value={field.value}
        backgroundColor="#FFFFFF"
        {...rest}
      />
      {showMissing && field.value && field.value?.length && field.value?.length > 0 && (
        <PresenceTransition
          visible={showMissing && Boolean(field.value?.length)}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}
        >
          <HStack justifyContent="flex-end">
            <Text color="coolGray.400" fontSize="xs" alignItems="flex-end">
              {field.value?.length ?? 0} / {maxValue}
            </Text>
          </HStack>
        </PresenceTransition>
      )}
    </Box>
  );
}
