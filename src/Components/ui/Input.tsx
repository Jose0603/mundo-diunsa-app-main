import { Box, HStack, IInputProps, Input as NBInput, PresenceTransition, Text } from 'native-base';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

interface ICustomInput extends IInputProps {
  maxLength?: number;
  showMissing?: boolean;
  name: string;
}

export default function Input({ name, defaultValue, maxLength = 0, showMissing = true, value, ...rest }: ICustomInput) {
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
        w={{
          base: '100%',
        }}
        borderWidth={1}
        py={3}
        // _focus={{
        //   backgroundColor: '#FFFFFF',
        //   borderColor: '#6364FD',
        // }}
        onChangeText={(e) => {
          field.onChange(e.trimStart());
        }}
        onBlur={field.onBlur}
        value={field.value?.toString()}
        backgroundColor="#FFFFFF"
        maxLength={maxLength > 0 ? maxLength : undefined}
        {...rest}
      />

      {showMissing && (
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
          <HStack justifyContent="flex-end" position="absolute" right={0} bottom={-20}>
            <Text color="coolGray.400" fontSize="xs" alignItems="flex-end">
              {field.value.length ?? 0} / {maxValue}
            </Text>
          </HStack>
        </PresenceTransition>
      )}
    </Box>
  );
}
