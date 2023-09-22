import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import {
  Box,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import { WEATHER_API_KEY } from "../Configs/config";
import { getData, storeData } from "../Helpers/AsyncStorage";
import { sentenceCase } from "../Helpers/FormatToSenteceCase";
import { GetLocation } from "../Helpers/GetLocation";
import { RootState } from "../Redux/reducers/rootReducer";
import { Platform } from "react-native";

const getCurrentGreetingIcon = (weatherCode: string) => {
  let myDate = new Date();
  let hrs = myDate.getHours();

  switch (weatherCode) {
    case "01d":
      return (
        <Image
          key={1}
          source={require("../../assets/sun.png")}
          alt="clima"
          size="sm"
        />
      );
    case "01n":
      return (
        <Image
          key={2}
          source={require("../../assets/night.png")}
          alt="clima"
          size="sm"
        />
      );
    case "02d":
      return (
        <Image
          key={3}
          source={require("../../assets/clouds.png")}
          alt="clima"
          size="sm"
        />
      );
    case "02n":
      return (
        <Image
          key={4}
          source={require("../../assets/cloudy-night.png")}
          alt="clima"
          size="sm"
        />
      );
    case "03d":
      return (
        <Image
          key={5}
          source={require("../../assets/cloud.png")}
          alt="clima"
          size="sm"
        />
      );
    case "03n":
      return (
        <Image
          key={6}
          source={require("../../assets/cloud.png")}
          alt="clima"
          size="sm"
        />
      );
    case "04d":
      return (
        <Image
          key={7}
          source={require("../../assets/cloudy.png")}
          alt="clima"
          size="sm"
        />
      );
    case "04n":
      return (
        <Image
          key={8}
          source={require("../../assets/cloudy.png")}
          alt="clima"
          size="sm"
        />
      );
    case "09d":
      return (
        <Image
          key={9}
          source={require("../../assets/rain.png")}
          alt="clima"
          size="sm"
        />
      );
    case "09n":
      return (
        <Image
          key={10}
          source={require("../../assets/rain.png")}
          alt="clima"
          size="sm"
        />
      );
    case "10d":
      return (
        <Image
          key={11}
          source={require("../../assets/rain.png")}
          alt="clima"
          size="sm"
        />
      );
    case "10n":
      return (
        <Image
          key={12}
          source={require("../../assets/rain.png")}
          alt="clima"
          size="sm"
        />
      );
    case "11d":
      return (
        <Image
          key={13}
          source={require("../../assets/thunder.png")}
          alt="clima"
          size="sm"
        />
      );
    case "11n":
      return (
        <Image
          key={14}
          source={require("../../assets/thunder.png")}
          alt="clima"
          size="sm"
        />
      );

    default:
      return (
        <Image
          key={15}
          source={require("../../assets/cloudy.png")}
          alt="clima"
          size="sm"
        />
      );
  }
};
const getCurrentGreeting = () => {
  let myDate = new Date();
  let hrs = myDate.getHours();
  let greet = "";

  if (hrs < 12) greet = "Buenos días";
  else if (hrs >= 12 && hrs <= 17) greet = "Buenas Tardes";
  else if (hrs >= 17 && hrs <= 24) greet = "Buenas Noches";

  return greet;
};

function WeatherWidget() {
  const user = useSelector((state: RootState) => state.auth.login);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setisLoadingWeather] = useState(false);

  const saveWeatherData = async () => {
    const coords = await getCoords();
    try {
      // const { data } = await axios.get(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=15.505617&lon=-88.025461&units=metric&lang=es&appid=${WEATHER_API_KEY}`
      // );
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=es&appid=${WEATHER_API_KEY}`
      );
      if (data) {
        await storeData(
          "weatherData",
          JSON.stringify({ ...data, lastSearch: moment() })
        );
        setWeatherData({ ...data, lastSearch: moment() });
      }
    } catch (error) {}
  };

  const saveCoords = async () => {
    const res = await GetLocation();
    if (res) {
      const { coords } = res;
      await storeData(
        "coords",
        JSON.stringify({ ...coords, lastSearch: moment() })
      );
      return coords;
    } else {
      await storeData(
        "coords",
        JSON.stringify({
          ...{
            latitude: 15.505617,
            longitude: -88.025461,
          },
          lastSearch: moment(),
        })
      );
      return {
        latitude: 15.505617,
        longitude: -88.025461,
      };
    }
  };

  const getCoords = async () => {
    const lastSavedCoords = await getData("coords");
    if (typeof lastSavedCoords === "string") {
      const parsedCoords = JSON.parse(lastSavedCoords);
      if (moment().diff(moment(parsedCoords.lastSearch), "days") > 1) {
        const coords = await saveCoords();
        return coords;
      } else {
        return parsedCoords;
      }
    } else {
      const coords = await saveCoords();
      return coords;
    }
  };

  const searchForWeather = async (isNew = false) => {
    try {
      setisLoadingWeather(true);
      const lastSavedData = await getData("weatherData");

      if (typeof lastSavedData === "string" && !isNew) {
        const parsedSaved = JSON.parse(lastSavedData);
        // console.log('last', parsedSaved);
        // console.log('diferencia desde la ultima busqueda', moment().diff(moment(parsedSaved.lastSearch), 'minute'));
        if (moment().diff(moment(parsedSaved.lastSearch), "minute") > 10) {
          saveWeatherData();
        } else {
          setWeatherData(parsedSaved);
        }
      } else {
        saveWeatherData();
      }
    } catch (error) {
      console.error(error.data);
    } finally {
      setisLoadingWeather(false);
    }
  };

  useEffect(() => {
    (async () => {
      await searchForWeather();
    })();
  }, []);
  return (
    <Box
      p={5}
      pt={3}
      mx={3}
      borderRadius={15}
      height={200}
      bg={{
        linearGradient: {
          colors: ["rgba(79,127,250,1)", "rgba(51, 95, 209, 100)"],
          start: [0, 0],
          end: [1, 0],
        },
      }}
      shadow="2"
    >
      <VStack p={3} justifyContent="center" alignItems="flex-start">
        <Text color="white" fontSize="md">
          {getCurrentGreeting()},{" "}
          <Text color="white" fontSize="md" bold>
            {sentenceCase(user.username)}
          </Text>
        </Text>
        <HStack justifyContent="center" alignItems="center" pl={5} py={5}>
          {!isLoadingWeather ? (
            getCurrentGreetingIcon(weatherData?.weather[0]?.icon)
          ) : (
            <Skeleton h="50" w="50" borderRadius="full" />
          )}
          {!isLoadingWeather ? (
            <VStack ml={3}>
              <Text color="white" fontSize="sm">
                {weatherData?.name ?? ""}
              </Text>
              <Text color="white" fontSize="xl">
                {Math.round(weatherData?.main?.temp ?? "32")} °C
              </Text>
              <Text
                color="white"
                fontSize="md"
                bold
                maxWidth={250}
                adjustsFontSizeToFit
              >
                {sentenceCase(weatherData?.weather[0]?.description) ??
                  "Soleado"}
              </Text>
            </VStack>
          ) : (
            <>
              <Skeleton.Text ml={2} w={150} startColor="si blue.100" />
            </>
          )}
        </HStack>
        {!isLoadingWeather ? (
          <Pressable
            onPress={async () => {
              await searchForWeather(true);
            }}
          >
            <HStack alignItems="center">
              <Ionicons name="reload" size={18} color="#fff" />
              <Text color="white" ml={2} fontSize="sm">
                Última actualización,{" "}
                {moment(weatherData?.lastSearch).fromNow()}
              </Text>
            </HStack>
          </Pressable>
        ) : (
          <>
            <Skeleton
              ml={2}
              w={300}
              h={5}
              borderRadius="full"
              startColor="blue.100"
            />
          </>
        )}
      </VStack>
    </Box>
  );
}

export default React.memo(WeatherWidget);
