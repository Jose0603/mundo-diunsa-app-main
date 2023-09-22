import { HStack, Text as NbText, useToast, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import * as Progress from "react-native-progress";
import { useDispatch } from "react-redux";

import { getData, storeData } from "../Helpers/AsyncStorage";
import useIsMountedRef from "../hooks/useIsMountedRef";
import { setProfile } from "../Redux/reducers/auth/profileSlice";
import { AddNewsViewPoints } from "../Services/rrhh/News";
import { getMyPoints } from "../Services/User";
import { useCustomToast } from "../hooks/useCustomToast";

interface Props {
  seconds: number;
  newsId: number;
  shouldAddPoints: boolean;
}

function NewsReadingTimer({ seconds = 0, newsId, shouldAddPoints }: Props) {
  const showToast = useCustomToast();
  const { width } = useWindowDimensions();
  const [countingSeconds, setCountingSeconds] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isCompleted, setIsCompleted] = useState(!shouldAddPoints);
  const [minutes, setMinutes] = useState(0);
  const timer = useRef<any>();
  // const toast = useToast();
  const dispatch = useDispatch();
  const isMounted = useIsMountedRef().current;

  const fetchMyPoints = async () => {
    try {
      const res = await getMyPoints();
      if (res.result && isMounted) {
        dispatch(setProfile(res.data.points));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewsViewPoints = async (adId: number) => {
    try {
      const res = await AddNewsViewPoints(adId);
      if (res.result && res.message === "Puntos agregados con exito") {
        showToast({
          title: "Puntos por lectura agregados con exito",
          status: "success",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchMyPoints();
      // setIsLoading(false);
    }
  };

  interface PrevWatchedNews {
    id: number;
    seconds: number;
  }

  const checkForPreviusNewsWatched = async () => {
    const prevWatchedNews = await getData("watchedNews");
    if (typeof prevWatchedNews === "string") {
      let watchedNews: PrevWatchedNews = JSON.parse(prevWatchedNews);
      if (watchedNews.id === newsId) {
        setCountingSeconds(watchedNews.seconds);
      }
    }
  };

  const SaveCurrentWatchedNews = async () => {
    let savingCurrentNews: PrevWatchedNews = {
      id: newsId,
      seconds: countingSeconds,
    };
    await storeData("watchedNews", JSON.stringify(savingCurrentNews));
  };

  useEffect(() => {
    setMinutes(seconds / 60);

    checkForPreviusNewsWatched();

    const interval = setInterval(() => {
      setCountingSeconds((secs) => secs + 1);
    }, 1000);

    timer.current = interval;

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countingSeconds >= seconds || seconds === 0) {
      setCountingSeconds(seconds);
      setIsCompleted(true);
      clearInterval(timer.current);
      addNewsViewPoints(newsId);
    } else {
      setProgressValue(100 / (seconds / (countingSeconds + 1)) / 100);
    }
    SaveCurrentWatchedNews();
    return () => {};
  }, [seconds, countingSeconds]);

  return (
    <VStack bgColor="white">
      <Progress.Bar
        progress={countingSeconds > 0 ? progressValue : 1}
        width={Platform.OS === "web" ? (width * 75) / 100 : width}
        color={"#FBE232"}
      />
      <HStack justifyContent={"space-between"}>
        {minutes > 0 && (
          <NbText ml={4} py={2}>
            Tiempo de lectura: {minutes} {minutes > 1 ? "mins" : "min"}
          </NbText>
        )}
        <NbText mx={4} py={2}>
          {!isCompleted ? "👓 Leyendo.." : "✅ Leido"}
        </NbText>
      </HStack>
    </VStack>
  );
}

export default React.memo(NewsReadingTimer);
