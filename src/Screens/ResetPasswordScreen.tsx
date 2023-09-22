import React, { ReactElement, useState } from 'react';
import { View, TouchableWithoutFeedback, Platform, ViewStyle } from 'react-native';
import {
  Button,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  // Icon,
  Spinner,
} from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ImageStyle, Image } from 'react-native';
import { ArrowBackIcon, HStack, KeyboardAvoidingView, Pressable } from 'native-base';
import { useToast } from 'native-base';
import { colors } from '../Helpers/Colors';
import { ResetPassword } from '../Services/Auth';
import { IResetPassword } from '../interfaces/IUser';
import { ScreenNames } from '../Helpers/ScreenNames';
import { useCustomToast } from '../hooks/useCustomToast';
import { Ionicons } from '@expo/vector-icons';

// const PersonIcon = (style: ImageStyle): any => (
//   <Icon {...style} name="person" />
// );
// const AlertIcon = (style: ViewStyle) => (
//   <Icon {...style} name="alert-circle-outline" />
// );

const PersonIcon = (style: ImageStyle): any => (
  <Ionicons name="ios-person" size={24} {...style} color={colors.primary} />
);
const AlertIcon = (style: ViewStyle) => (
  <Ionicons name="ios-alert-circle-outline" size={24} {...style} color={colors.primary} />
);
const ResetPasswordScreen = ({ navigation }: any): React.ReactElement => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState(false);
  const showToast = useCustomToast();
  // const toast = useToast();

  const loginSchema = Yup.object().shape({
    idHash: Yup.string().required('Ingresa tu codigo de acceso'),
    password: Yup.string().required('Ingresa tu nueva contraseña'),
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

  const renderPasswordIcon = (props: any): ReactElement => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      {/* <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} /> */}
      <Ionicons {...props} size={24} name={passwordVisible ? 'ios-eye-off' : 'ios-eye'} color={colors.primary} />
    </TouchableWithoutFeedback>
  );

  const ErrorText = (props: any) => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>{props.error}</Text>
      </View>
    );
  };

  const handleSubmit = async (idHash: string, password: string, callback: any) => {
    try {
      setisLoading(true);
      const sendingData: IResetPassword = {
        idHash,
        password,
        confirmPassword: password,
      };
      const res = await ResetPassword(sendingData);
      if (res.result) {
        showToast({
          title: 'Contraseña restablecida',
          status: 'success',
          description: res.message,
        });
        navigation.navigate(ScreenNames.LOGIN);
      } else {
        showToast({
          title: 'Ocurrio un error',
          status: 'warning',
          description: res.message,
        });
      }
      callback();
    } catch (error) {
      showToast({
        title: 'Ocurrio un error',
        status: 'warning',
        description: 'Ocurrio un error al realizar el cambio de contraseña',
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
        initialValues={{ idHash: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values.idHash, values.password, resetForm);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched }) => (
          <Layout style={styles.formContainer} level="1">
            <Input
              placeholder="Código unico de acceso"
              accessoryRight={<PersonIcon />}
              size="large"
              value={values.idHash}
              onBlur={handleBlur('idHash')}
              onChangeText={handleChange('idHash')}
              disabled={isLoading}
              caption={errors.idHash && touched.idHash ? <ErrorText error={errors.idHash} /> : undefined}
              status={errors.idHash && touched.idHash ? 'danger' : 'primary'}
            />
            <Input
              style={styles.passwordInput}
              placeholder="Nueva Contraseña"
              accessoryRight={renderPasswordIcon}
              size="large"
              secureTextEntry={!passwordVisible}
              value={values.password}
              onBlur={handleBlur('password')}
              onChangeText={handleChange('password')}
              disabled={isLoading}
              caption={errors.password && touched.password ? <ErrorText error={errors.password} /> : undefined}
              status={errors.password && touched.password ? 'danger' : 'primary'}
            />
            <Button
              style={styles.signInButton}
              size="giant"
              onPress={() => handleSubmit()}
              disabled={isLoading}
              accessoryLeft={isLoading ? LoadingIndicator : undefined}
            >
              {isLoading ? 'Restableciendo contraseña' : 'Restablecer contraseña'}
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

export default ResetPasswordScreen;
