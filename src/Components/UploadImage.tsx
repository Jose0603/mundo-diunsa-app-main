import * as ImagePicker from "expo-image-picker";
// import { useToast } from 'native-base';
import React, { useEffect, useState } from "react";
import { Button, Image, Platform, View } from "react-native";

import { IUploadingImage } from "../interfaces/IUploadingImage";
import { useCustomToast } from "../hooks/useCustomToast";

export const UploadImage = () => {
  const [image, setImage] = useState<string>("");
  const showToast = useCustomToast();
  // const toast = useToast();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          showToast({
            title: "Permisos necesarios",
            status: "error",
            description: "No hay permisos para acceder a la galeria",
          });
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

const imageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.All,
  allowsEditing: false,
  aspect: [9, 16],
  quality: 1,
};

export const takeImage = async (): Promise<IUploadingImage | null> => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        reject("No se brindaron permisos para acceder a la Camara");
      } else {
        let result: any = await ImagePicker.launchCameraAsync(imageOptions);

        if (result.cancelled) {
          resolve(null);
          return;
        }

        let localUri = result.uri;
        if (localUri && localUri.length > 0) {
          let filename = localUri.split("/").pop();
          let match = /\.(\w+)$/.exec(filename ?? "");
          let type = match ? `image/${match[1]}` : `image`;
          resolve({ uri: localUri, name: filename ?? "", type });
        }
      }
    } else {
      resolve(null);
    }
  });
};
export const pickImage = async (): Promise<IUploadingImage | null> => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        reject("No se brindaron permisos para acceder a la galeria");
      } else {
        let result: any = await ImagePicker.launchImageLibraryAsync(
          imageOptions
        );

        if (result.cancelled) {
          resolve(null);
          return;
        }

        let localUri = result.uri;
        if (localUri && localUri.length > 0) {
          let filename = localUri.split("/").pop();
          let match = /\.(\w+)$/.exec(filename ?? "");
          let type = match ? `image/${match[1]}` : `image`;

          resolve({
            uri:
              Platform.OS === "android"
                ? localUri
                : localUri.replace("file://", ""),
            name: filename ?? "",
            type,
          });
        }
      }
    } else {
      resolve(null);
    }
  });
};
