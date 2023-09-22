import React, { ReactElement, useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  ViewStyle,
} from 'react-native';
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
import { connect, useSelector, useDispatch } from 'react-redux';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { LoginService } from '../Services/Auth';
import { KeyboardAvoidingView } from 'native-base';
import { ChangeUserData } from '../Redux/actions/auth/loginActions';
import { AppPermissions } from '../Helpers/AppPermissions';
import { colors } from '../Helpers/Colors';
import { ScreenNames } from '../Helpers/ScreenNames';
import { useCustomToast } from '../hooks/useCustomToast';
import { Ionicons } from '@expo/vector-icons';

// const PersonIcon = (style: ImageStyle): any => <Icon {...style} name="person" />;
const PersonIcon = (style: ImageStyle): any => (
  <Ionicons name='ios-person' size={24} {...style} color={colors.primary} />
);
// const AlertIcon = (style: ViewStyle) => <Icon {...style} name="alert-circle-outline" />;
const AlertIcon = (style: ViewStyle) => (
  <Ionicons
    name='ios-alert-circle-outline'
    size={24}
    {...style}
    color={colors.primary}
  />
);

const LoginScreen = ({ navigation }: any): React.ReactElement => {
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const loginState = useSelector((state: any) => state.auth.login);
  const dispatch = useDispatch();
  const showToast = useCustomToast();

  const loginSchema = Yup.object().shape({
    username: Yup.string().required('Ingrese su usuario'),
    password: Yup.string().required('Ingrese su contraseña'),
  });

  const insets = useSafeAreaInsets();

  const styles = useStyleSheet(themedStyles);

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' status='basic' />
    </View>
  );

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const renderPasswordIcon = (props: any): ReactElement => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      {/* <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} /> */}
      <Ionicons
        {...props}
        size={24}
        name={passwordVisible ? 'ios-eye-off' : 'ios-eye'}
        color={colors.primary}
      />
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

  const navigate = (screen: string) => {
    navigation && navigation.navigate(screen);
  };

  const mutation = useMutation(
    (values: any) => {
      return LoginService(values);
    },
    {
      onError: (error: any) => {
        showToast({
          title: 'Hubo un error',
          status: 'error',
          description: 'Ocurrio un error inesperado',
        });
        mutation.reset();
      },
      onSettled: ({ data }: any, error: any, variables, context) => {
        console.log('RESULTADO', data.data);
        if (!data.result) {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description:
              data.message.trim().length === 0
                ? 'No tienes permisos para acceder a esta aplicacion'
                : data.message,
          });
        } else if (data.result) {
          if (
            data.data.permissions &&
            data.data.permissions.length > 0 &&
            data.data.permissions.includes?.(AppPermissions.inicio)
          ) {
            dispatch(
              ChangeUserData({
                email: data.data.email ?? '',
                employeeId: data.data.employeeId,
                isLoggedIn: true,
                permissions: data.data.permissions,
                profile: data.data.profile ?? 'User',
                token: data.data.token,
                username: data.data.username,
                name: data.data.name,
                employeePosition: data.data.employeePosition ?? '',
                __jsogObjectId: '1',
                acceptedTerms: data.data.acceptPolicy ?? true,
                picture: data.data.picture,
              })
            );
            showToast({
              title: 'Inicio de sesion con exito',
              status: 'success',
              // description: data.Message ?? 'Ocurrio un error inesperado',
            });
          } else {
            showToast({
              title: 'Hubo un error',
              status: 'warning',
              description: 'No tienes permisos para acceder a esta aplicacion',
            });
          }
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: 'Ocurrio un error inesperado',
          });
        }
      },
    }
  );

  return (
    <KeyboardAvoidingView
      h={{
        base: '100%',
      }}
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ paddingTop: insets.top }]}
      _web={{
        paddingX: '96',
      }}
      bg='#ffffff'
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
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          mutation.mutate(values);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isSubmitting,
          errors,
          touched,
        }) => (
          <Layout style={styles.formContainer} level='1'>
            <Input
              placeholder='Usuario'
              accessoryRight={<PersonIcon />}
              size='large'
              value={values.username}
              onBlur={handleBlur('username')}
              onChangeText={handleChange('username')}
              disabled={mutation.isLoading}
              caption={
                errors.username && touched.username ? (
                  <ErrorText error={errors.username} />
                ) : undefined
              }
              status={
                errors.username && touched.username ? 'danger' : 'primary'
              }
            />
            <Input
              style={styles.passwordInput}
              placeholder='Contraseña'
              accessoryRight={renderPasswordIcon}
              size='large'
              secureTextEntry={!passwordVisible}
              value={values.password}
              onBlur={handleBlur('password')}
              onChangeText={handleChange('password')}
              disabled={mutation.isLoading}
              caption={
                errors.password && touched.password ? (
                  <ErrorText error={errors.password} />
                ) : undefined
              }
              status={
                errors.password && touched.password ? 'danger' : 'primary'
              }
            />
            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                color: colors.primary,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}
              onPress={() => navigate(ScreenNames.REQUEST_RESET_PASSWORD)}
            >
              He olvidado mi contraseña
            </Text>
            <Button
              style={styles.signInButton}
              size='giant'
              onPress={() => handleSubmit()}
              disabled={mutation.isLoading}
              accessoryLeft={mutation.isLoading ? LoadingIndicator : undefined}
            >
              {mutation.isLoading ? 'INICIANDO SESION' : 'INICIAR SESION'}
            </Button>
            {Platform.OS === 'ios' && (
              <Text
                style={{
                  marginVertical: 10,
                  textAlign: 'center',
                  color: colors.primary,
                  fontWeight: 'bold',
                }}
                onPress={() => navigate(ScreenNames.FAKE_FORM)}
              >
                ¿Quieres ser parte de Mundo Diunsa?
              </Text>
            )}
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

const mapStateToProps = (state: any) => {
  return { user: state.auth.login.permissions };
};
export default connect(mapStateToProps)(LoginScreen);
