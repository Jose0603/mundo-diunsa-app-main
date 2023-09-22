import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Icon,
  IndexPath,
  Spinner,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from "@ui-kitten/components";
import { Formik } from "formik";
import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  FormControl,
  IconButton,
  KeyboardAvoidingView,
  PresenceTransition,
  Pressable,
  ScrollView,
  Select,
  Text,
  TextArea,
  WarningOutlineIcon,
} from "native-base";
import { useToast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
// @ts-ignore
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Loading } from "../../Components/Loading";
import { AppPermissions } from "../../Helpers/AppPermissions";
import { ScreenNames } from "../../Helpers/ScreenNames";
import useIncidents from "../../hooks/useIncidents";
import { useHasPermissions } from "../../hooks/usePermissions";
import { IAssignee } from "../../interfaces/IAssignee";
import { Area, IIncident } from "../../interfaces/IIncident";
import { IUploadingImage } from "../../interfaces/IUploadingImage";
import { Assignees } from "../../Services/incidents/Assignees";
import { SaveIncident } from "../../Services/incidents/Incidents";
import { useCustomToast } from "../../hooks/useCustomToast";

const CameraIcon = (style: any) => <Icon {...style} name="camera-outline" />;

interface IProps extends NativeStackScreenProps<any, any> {}

const FormIncidentScreen = ({
  navigation,
  route,
}: IProps): React.ReactElement => {
  const [subcategory, setSubcategory] = React.useState<number>();
  const [category, setCategory] = useState<string>("");
  const [area, setArea] = useState<Area>();
  const [possibleAssignees, setPossibleAssignees] = useState<IAssignee[]>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);
  const loginState = useSelector((state: any) => state.auth.login);
  const dispatch = useDispatch();
  const showToast = useCustomToast();
  // const toast = useToast();
  const [uploadingImages, setUploadingImages] = useState<IUploadingImage[]>([]);
  const observationsRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState<number>();

  const isTechnician = useHasPermissions([AppPermissions.tecnico]);

  const [receivedIncident, setReceivedIncident] = useState<IIncident>();

  if (route && route.params && route.params.incident) {
    setReceivedIncident(route.params.incident);
  }

  // useEffect(() => {
  //   setReceivedIncident(incident);
  // }, [incident]);

  const incidentSchema = Yup.object().shape({
    category: Yup.string().required("Seleccione un tipo de gestion"),
    subCategoryId: Yup.number().required("Selecciona una gestion"),
    storeId: Yup.number().required("Selecciona una tienda"),
    observations: Yup.string().default(""),
  });

  const insets = useSafeAreaInsets();

  const styles = useStyleSheet(themedStyles);

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  // useEffect(() => {
  //   (async () => {
  //     setLoadingAssignees(true);
  //     try {
  //       if (subcategory && selectedLocation) {
  //         const res = await Assignees(subcategory, selectedLocation);
  //         console.log(res);

  //         setPossibleAssignees([
  //           ...[
  //             {
  //               employeeCode: '-1',
  //               employeeName: 'AUTOMATICO',
  //               positionCode: 0,
  //               positionName: '',
  //               sectionCode: 0,
  //               sectionName: '',
  //             },
  //           ],
  //           ...res.data,
  //         ]);
  //       }
  //     } catch (error) {
  //       setPossibleAssignees([
  //         {
  //           employeeCode: '-1',
  //           employeeName: 'AUTOMATICO',
  //           positionCode: 0,
  //           positionName: '',
  //           sectionCode: 0,
  //           sectionName: '',
  //         },
  //       ]);
  //       console.error(error);
  //     } finally {
  //       setLoadingAssignees(false);
  //     }
  //   })();
  // }, [subcategory, selectedLocation]);

  const navigate = (screen: string) => {
    navigation && navigation.navigate(screen);
  };

  const mutation = useMutation(
    (values: any) => {
      return SaveIncident(values);
    },
    {
      onSettled: (response: any, error: any, variables, context) => {
        if (!response.result) {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message ?? "Ocurrio un error inesperado",
          });
        } else {
          showToast({
            // title: `Se ha generado el ticket ${response?.data?.tUuid}`,
            title: `Se ha generado el ticket`,
            status: "success",
            // description: data.Message ?? 'Ocurrio un error inesperado',
          });
          if (response?.data?.id) {
            navigation.navigate(ScreenNames.DETAIL_INCIDENT, {
              ticketId: response.data.id,
            });
          } else {
            navigation.goBack();
          }
        }
      },
    }
  );

  const {
    Categories: { data: categories },
    Areas: { data: areas, isLoading: loadingAreas },
    SubCategories: { data: subcategories, isLoading: loadingSubcategories },
    Stores: { data: stores, isLoading: loadingStores },
  } = useIncidents();

  // const assignees =
  //   subcategory && ;

  // console.log('[FORM INCIDENTS]', assignees);

  // const priorities = ['Baja', 'Media', 'Alta'];

  // const displayCategoryValue = categories && categories[selectedIndex.row];
  // const displaySubCategoryValue = subcategories && subcategories[selectedSubCategoryIndex.row];

  const RenderRightActions = () => (
    <>
      <Pressable onPress={async () => {}}>
        <Box flexDirection="row" alignItems="center"></Box>
      </Pressable>
    </>
  );

  const RenderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
    />
  );

  return (
    <Box
      h={{
        base: "100%",
        lg: "auto",
      }}
      backgroundColor="#fff"
      style={[{ paddingTop: insets.top }]}
    >
      <TopNavigation
        alignment="start"
        title="Reportar Incidencia"
        accessoryLeft={<RenderLeftActions />}
        accessoryRight={<RenderRightActions />}
      />
      <ScrollView
        h={{
          base: "100%",
          lg: "auto",
        }}
        mt={4}
      >
        {/* {
            category: '',
            subCategoryId: receivedIncident?.subCategoryId ?? 0,
            observations: receivedIncident?.observations ?? '',
            priority: receivedIncident?.priority ?? 0,
            assignedTo: receivedIncident?.assignedToName ?? '',
          } */}
        <Formik
          initialValues={{
            area: "",
            category: "",
            subCategoryId: 0,
            storeId: 0,
            observations: "",
            // priority: 0,
            assignedTo: "-1",
          }}
          validationSchema={incidentSchema}
          onSubmit={async (values, { resetForm }) => {
            let formDataToUpload: any[] = [];
            let res: any;
            // if (uploadingImages.length > 0) {
            //   uploadingImages.forEach(async (fileData) => {
            //     let formData = new FormData();
            //     formData.append('files', fileData);
            //     // res = await FileUpload(formData);
            //     console.log(formData);
            //   });
            // }
            values.observations = observationsRef?.current?.value ?? "";
            mutation.mutate({ ...values });
            observationsRef.current.value = '';
            resetForm();
          }}
        >
          {({
            handleSubmit,
            isSubmitting,
            errors,
            touched,
            setFieldValue,
            values,
          }) => {
            return (
              <>
                <Box px={3}>
                  {stores && (
                    <Box mb={3}>
                      <FormControl
                        isRequired
                        isInvalid={
                          errors.category && touched.category ? true : false
                        }
                      >
                        <FormControl.Label>
                          Selecciona la ubicacion
                        </FormControl.Label>
                        <Select
                          minWidth="200"
                          accessibilityLabel="Selecciona la ubicacion"
                          placeholder="Selecciona la ubicacion"
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          isDisabled={mutation.isLoading}
                          selectedValue={values.storeId.toString()}
                          mt="1"
                          onValueChange={(itemValue: string) => {
                            setFieldValue("storeId", parseInt(itemValue, 10));
                            setSelectedLocation(parseInt(itemValue, 10));
                          }}
                        >
                          {stores.map(({ label, value }) => {
                            return (
                              <Select.Item
                                key={`store-${value}`}
                                label={label}
                                value={value.toString()}
                              />
                            );
                          })}
                        </Select>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.storeId}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </Box>
                  )}
                  {areas && (
                    <Box mb={3}>
                      <FormControl
                        isRequired
                        isInvalid={
                          errors.category && touched.category ? true : false
                        }
                      >
                        <FormControl.Label>
                          Selecciona el Area
                        </FormControl.Label>
                        <Select
                          minWidth="200"
                          accessibilityLabel="Selecciona el Area"
                          placeholder="Selecciona el Area"
                          isDisabled={mutation.isLoading}
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          selectedValue={values.area}
                          mt="1"
                          onValueChange={(itemValue: string) => {
                            setFieldValue("area", itemValue);
                            const foundArea = areas.find(
                              (_area) => _area.id.toString() === itemValue
                            );
                            setArea(foundArea);
                          }}
                        >
                          {areas.map(({ name, id }) => {
                            return (
                              <Select.Item
                                key={`area-${id}`}
                                label={name}
                                value={id.toString()}
                              />
                            );
                          })}
                        </Select>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.area}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </Box>
                  )}
                  {area?.categories && (
                    <Box mb={3}>
                      <FormControl
                        isRequired
                        isInvalid={
                          errors.category && touched.category ? true : false
                        }
                      >
                        <FormControl.Label>
                          Selecciona el Tipo de Gestión
                        </FormControl.Label>
                        <Select
                          minWidth="200"
                          accessibilityLabel="Selecciona el Area de la Gestión"
                          placeholder="Selecciona el Area de la Gestión"
                          isDisabled={mutation.isLoading}
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          selectedValue={values.category}
                          mt="1"
                          onValueChange={(itemValue: string) => {
                            setFieldValue("category", itemValue);
                            setCategory(itemValue);
                          }}
                        >
                          {area.categories.map(({ name, id }) => {
                            return (
                              <Select.Item
                                key={`category-${id}`}
                                label={name}
                                value={id.toString()}
                              />
                            );
                          })}
                        </Select>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.category}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </Box>
                  )}
                  <PresenceTransition
                    visible={true}
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
                    {subcategories && category && category.length > 0 ? (
                      <Box mb={3}>
                        <FormControl
                          isRequired
                          isInvalid={
                            errors.subCategoryId && touched.subCategoryId
                              ? true
                              : false
                          }
                        >
                          <FormControl.Label>
                            Selecciona la Gestión
                          </FormControl.Label>
                          <Select
                            minWidth="200"
                            accessibilityLabel="Selecciona la Gestión"
                            placeholder="Selecciona la Gestión"
                            isDisabled={mutation.isLoading}
                            selectedValue={values.subCategoryId.toString()}
                            _selectedItem={{
                              endIcon: <CheckIcon size={5} />,
                            }}
                            mt="1"
                            onValueChange={async (itemValue: string) => {
                              setFieldValue(
                                "subCategoryId",
                                parseInt(itemValue, 10)
                              );
                              // subCategory.current = +itemValue;
                              setSubcategory(+itemValue);
                            }}
                          >
                            {subcategories
                              .filter(({ categoryId }) =>
                                category
                                  ? categoryId.toString() === category
                                  : true
                              )
                              .map(({ name, id }) => {
                                return (
                                  <Select.Item
                                    key={`subcategory-${id}`}
                                    label={name}
                                    value={id.toString()}
                                  />
                                );
                              })}
                          </Select>
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.subCategoryId}
                          </FormControl.ErrorMessage>
                        </FormControl>
                      </Box>
                    ) : null}
                  </PresenceTransition>
                  {/* {possibleAssignees && !loadingAssignees ? (
                    <Box mb={3}>
                      <FormControl isRequired isInvalid={errors.assignedTo && touched.assignedTo ? true : false}>
                        <FormControl.Label>Selecciona un técnico</FormControl.Label>
                        <Select
                          minWidth="200"
                          accessibilityLabel="Selecciona un técnico"
                          placeholder="Selecciona un técnico"
                          isDisabled={mutation.isLoading}
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          mt="1"
                          onValueChange={(itemValue: string) => {
                            setFieldValue('assignedTo', itemValue);
                          }}
                        >
                          {possibleAssignees.map(({ employeeName, employeeCode }: IAssignee) => {
                            return (
                              <Select.Item key={`assignee-${employeeCode}`} label={employeeName} value={employeeCode} />
                            );
                          })}
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.assignedTo}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </Box>
                  ) : (
                    <Box py={2}>
                      <Loading message="Cargando tecnicos..." />
                    </Box>
                  )} */}
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                  >
                    <Box mb={3}>
                      <FormControl>
                        <FormControl.Label>Observaciones</FormControl.Label>
                        <TextArea
                          h={150}
                          placeholder="Observaciones"
                          ref={observationsRef}
                          w={{
                            base: "100%",
                            md: "25%",
                          }}
                          isDisabled={mutation.isLoading}
                          // value={values.observations}
                          onChangeText={(itemValue: string) => {
                            observationsRef.current.value = itemValue;
                            // setFieldValue('observations', itemValue);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </KeyboardAvoidingView>

                  {/* {Priorities && (
                    <Box mb={3}>
                      <FormControl isRequired isInvalid={errors.priority && touched.priority ? true : false}>
                        <FormControl.Label>Selecciona la prioridad</FormControl.Label>
                        <Select
                          minWidth="200"
                          accessibilityLabel="Selecciona la prioridad"
                          placeholder="Selecciona la prioridad"
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          mt="1"
                          onValueChange={(itemValue: string) => {
                            setFieldValue('priority', parseInt(itemValue, 10));
                          }}
                        >
                          {Priorities.map(({ label, value }) => {
                            return <Select.Item key={`priority-${value}`} label={label} value={value.toString()} />;
                          })}
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.priority}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </Box>
                  )} */}
                  <Box mb={3}>
                    <Box>
                      <IconButton
                        colorScheme="black"
                        key="camera-icon"
                        variant="ghost"
                        icon={<CameraIcon />}
                        size="4"
                      />
                    </Box>
                    {/* <FormControl>
                    <FormControl.Label>Adjunto</FormControl.Label>
                    
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      {errors.priority}
                    </FormControl.ErrorMessage>
                  </FormControl> */}
                  </Box>
                </Box>
                {/* <Attachments uploadingImages={uploadingImages} setUploadingImages={setUploadingImages} /> */}

                <Button
                  style={styles.signInButton}
                  size="giant"
                  disabled={
                    mutation.isLoading ||
                    loadingAssignees ||
                    loadingAreas ||
                    loadingSubcategories ||
                    loadingStores
                  }
                  onPress={() => {
                    handleSubmit();
                  }}
                  accessoryLeft={
                    mutation.isLoading ? LoadingIndicator : undefined
                  }
                >
                  {mutation.isLoading
                    ? "Enviando reporte"
                    : "Reportar Problema"}
                </Button>
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </Box>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 216,
    backgroundColor: "color-primary-default",
  },
  formContainer: {
    flex: 1,
    //  paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {},
  signInButton: {
    margin: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8F9BB3",
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FormIncidentScreen;
