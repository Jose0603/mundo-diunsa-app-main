import { Feather } from '@expo/vector-icons';
import { Box, Center, HStack, Image, PresenceTransition, Pressable, ScrollView, Text, useToast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';

import { baseURL } from '../Axios';
import { useCustomToast } from '../hooks/useCustomToast';
import { IUploadingImage } from '../interfaces/IUploadingImage';
import { TicketFileUpload } from '../Services/UploadImage';
import ImageDetailViewer from './ImageDetailViewer';
import { Loading } from './Loading';
import { pickImage, takeImage } from './UploadImage';

interface IProps {
  prevImages?: string[];
  ticketId: number;
}

export const Attachments = ({ prevImages = [], ticketId }: IProps) => {
  const [visible, setVisible] = useState(false);
  const showToast = useCustomToast();
  const [showingImages, setshowingImages] = useState<string[]>([...prevImages]);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleUpload = async (res: IUploadingImage) => {
    try {
      setIsUploading(true);
      const uploadResponse = await TicketFileUpload(res, ticketId);
      if (uploadResponse.result) {
        const newShowingImages = [...showingImages, uploadResponse.data.name];
        setshowingImages(newShowingImages);
      } else {
        showToast({
          title: 'Hubo un error',
          status: 'error',
          description: uploadResponse.message,
        });
      }
    } catch (error) {
      showToast({
        title: 'Hubo un error',
        status: 'error',
        description: 'Ha ocurrido un error al subir la imagen',
      });
      console.error('ha ocurrido un error al subir la imagen', error);
    } finally {
      setIsUploading(false);
    }
  };

  console.log(showingImages);

  return (
    <VStack px={2}>
      <Text fontSize="md" fontWeight="bold">
        Adjunto
      </Text>
      <ImageDetailViewer
        visible={visible}
        toggleVisible={toggleVisible}
        showingImages={showingImages}
        selectedImage={selectedImage}
      />
      <ScrollView horizontal>
        {showingImages &&
          showingImages.map((imageName: string, i: number) => {
            return (
              <Pressable
                m={2}
                key={`attachment-${i}`}
                onPress={() => {
                  setSelectedImage(i);
                  setVisible(!visible);
                }}
              >
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
                  <Image
                    key={`image-${i}`}
                    source={{ uri: `${baseURL}/images/${imageName}` }}
                    size={100}
                    alt={`attachment-${imageName}`}
                  />
                </PresenceTransition>
              </Pressable>
            );
          })}
      </ScrollView>
      {/* <ScrollView horizontal>
        {uploadingImages &&
          uploadingImages.map((image: IUploadingImage, i: number) => {
            return (
              <Pressable
                m={2}
                key={`attachment-${i}`}
                onPress={() => {
                  setVisible(!visible);
                }}
              >
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
                  <Image key={`image-${i}`} source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
                </PresenceTransition>
              </Pressable>
            );
          })}
      </ScrollView> */}
      {isUploading ? (
        <Loading message="Subiendo imagen..." />
      ) : (
        <HStack space={6} mt={2}>
          <Pressable
            onPress={async () => {
              try {
                let res = await takeImage();
                if (res !== null) {
                  handleUpload(res);
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <Center>
              <Feather name="camera" size={24} color="black" />
              <Text fontSize="sm">Hacer Foto</Text>
            </Center>
          </Pressable>
          <Pressable
            onPress={async () => {
              try {
                let res = await pickImage();
                if (res !== null) {
                  handleUpload(res);
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <Center>
              <Feather name="file" size={24} color="black" />
              <Text fontSize="sm">Subir Imagen</Text>
            </Center>
          </Pressable>
        </HStack>
      )}
    </VStack>
  );
};
