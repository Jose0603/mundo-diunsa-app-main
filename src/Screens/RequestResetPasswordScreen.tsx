import React, { useState } from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Icon, Spinner } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ImageStyle, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { RequestResetPassword } from '../Services/Auth';
import { ArrowBackIcon, HStack, KeyboardAvoidingView, Pressable } from 'native-base';
import { useToast } from 'native-base';
import { colors } from '../Helpers/Colors';
import { ScreenNames } from '../Helpers/ScreenNames';
import { useCustomToast } from '../hooks/useCustomToast';
import { Ionicons } from '@expo/vector-icons';

// const PersonIcon = (style: ImageStyle): any => (
//   <Icon {...style} name="person" />
// );
const PersonIcon = (style: ImageStyle): any => (
  <Ionicons name="ios-person" size={24} {...style} color={colors.primary} />
);
// const ChevronLeft = (style: ImageStyle): any => (
//   <Icon {...style} name="chevron-left-outline" />
// );
// const AlertIcon = (style: ViewStyle) => (
//   <Icon {...style} name="alert-circle-outline" />
// );
const AlertIcon = (style: ViewStyle) => (
  <Ionicons name="ios-alert-circle-outline" size={24} {...style} color={colors.primary} />
);

const RequestResetPasswordScreen = ({ navigation }: any): React.ReactElement => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const showToast = useCustomToast();
  // const toast = useToast();

  const loginSchema = Yup.object().shape({
    employeeCode: Yup.number()
      .positive('Ingresa un codigo de empleado valido')
      .typeError('Ingresa un codigo de empleado valido')
      .required('Ingresa tu codigo de empleado'),
  });

  const insets = useSafeAreaInsets();

  const styles = useStyleSheet(themedStyles);

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const ErrorText = (props: any) => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>{props.error}</Text>
      </View>
    );
  };

  const navigate = (screen: string) => {
    navigation && navigation.navigate(screen);
  };

  const handleSubmit = async (employeeCode: number, callback: any) => {
    setisLoading(true);
    try {
      const res = await RequestResetPassword(employeeCode);
      if (res.result) {
        showToast({
          title: 'Código enviado',
          status: 'success',
          description: res.message,
        });
      } else {
        showToast({
          title: 'Código no enviado',
          status: 'warning',
          description: res.message,
        });
      }
      callback();
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Ocurrio un error',
        status: 'warning',
        description: 'Ocurrio un error al realizar la solicitud de cambio de contraseña',
      });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ paddingTop: insets.top }]}
      flex={1}
      _web={{
        paddingX: '96',
      }}
      bg="#ffffff"
    >
      <View style={styles.headerContainer}>
        {/* <Text category="h1" status="control">
          Hello
        </Text> */}
        <Image
          style={{ width: 250, height: 200 }}
          resizeMode={'contain'}
          source={require('../../assets/logo_app.png')}
        />
        {/* <Avatar source={require('../../assets/logo_app_white.png')} size="giant" /> */}
        {/* <Text style={styles.signInLabel} category="h5" status="control">
          ¡Bienvenido de nuevo!
        </Text> */}
      </View>
      <Formik
        initialValues={{ employeeCode: null }}
        validationSchema={loginSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values.employeeCode, resetForm);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched }) => (
          <Layout style={styles.formContainer} level="1">
            <Input
              placeholder="Código de empleado"
              accessoryRight={<PersonIcon />}
              size="large"
              value={values?.employeeCode?.toString()}
              onBlur={handleBlur('employeeCode')}
              onChangeText={handleChange('employeeCode')}
              disabled={isLoading}
              caption={
                errors.employeeCode && touched.employeeCode ? <ErrorText error={errors.employeeCode} /> : undefined
              }
              status={errors.employeeCode && touched.employeeCode ? 'danger' : 'primary'}
            />
            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                color: colors.primary,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}
              onPress={() => navigate(ScreenNames.RESET_PASSWORD)}
            >
              Ya tengo mi codigo de acceso
            </Text>
            <Button
              style={styles.signInButton}
              size="giant"
              onPress={() => handleSubmit()}
              disabled={isLoading}
              accessoryLeft={isLoading ? LoadingIndicator : undefined}
            >
              {isLoading ? 'Solicitando cambio de contraseña' : 'Solicitar cambio de contraseña'}
            </Button>

            <HStack mt={10} alignItems="center" justifyContent="center">
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                bg="#eee"
                p={5}
                borderRadius="lg"
              >
                <HStack alignItems="center" justifyContent="center">
                  <ArrowBackIcon size="sm" />
                  <Text>Regresar</Text>
                </HStack>
              </Pressable>
            </HStack>
          </Layout>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {},
  signInButton: {
    margin: 16,
    backgroundColor: colors.primary,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F9BB3',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RequestResetPasswordScreen;
