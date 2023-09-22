import React, {useCallback, useEffect, useState} from "react";
import {
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  Button,
} from "@ui-kitten/components";
import {useSelector} from "react-redux";
import {HeartIcon} from "../Screens/rrhh/News/articles/extra/icons";
import {ToggleNewsLike} from "../Services/rrhh/News";
import {INews, LikeData, UserDetail} from "../interfaces/rrhh/INews";
import {AuthState} from "../Redux/reducers/auth/loginReducer";
import {IResponseModel} from "../interfaces/IResponseModel";

interface IProps {
  id: number | undefined;
  serviceFn: (id: number, likeType: any) => Promise<IResponseModel>;
  likes: LikeData | undefined;
}

const LikeButton = ({id, serviceFn, likes}: IProps) => {
  const styles = useStyleSheet(themedStyles);
  const [loadingLikeSent, setLoadingLikeSent] = useState(false);
  const [userLikeThis, setUserLikeThis] = useState(false);
  const [likesQty, setLikesQty] = useState(0);
  const user = useSelector((state: any) => state.auth.login);

  const userLikesThis = (
    userData: AuthState,
    usersLikingThis: UserDetail[] | undefined
  ): boolean => {
    if (usersLikingThis && usersLikingThis.length > 0) {
      const usersArr = usersLikingThis.map((user: UserDetail) => user.id);
      return usersArr.includes(userData.employeeId);
    }
    return false;
  };

  const toggleNewsLike = async (
    id: number,
    funcService: (id: number) => Promise<IResponseModel>
  ) => {
    setUserLikeThis(!userLikeThis);
    if (userLikeThis) {
      setLikesQty(likesQty - 1);
    } else {
      setLikesQty(likesQty + 1);
    }
    try {
      setLoadingLikeSent(false);
      const res = await funcService(id);
    } catch (error) {
      if (userLikeThis) {
        setLikesQty(likesQty + 1);
      } else {
        setLikesQty(likesQty - 1);
      }
      setUserLikeThis(!userLikeThis);
      console.error(error);
    } finally {
      setLoadingLikeSent(false);
    }
  };

  useEffect(() => {
    if (likes && likes.users) {
      const iLikeThis = userLikesThis(user, likes.users);
      setUserLikeThis(iLikeThis);
      setLikesQty(likes.qty);
    }
    return () => {};
  }, []);

  return (
    <Button
      style={styles.reactionButton}
      appearance="ghost"
      status={userLikeThis ? "danger" : "basic"}
      accessoryRight={HeartIcon}
      onPress={() => {
        toggleNewsLike(id, serviceFn);
      }}
      disabled={loadingLikeSent || !id}
    >
      {`${likesQty ?? 0}`}
    </Button>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 240,
  },
  titleLabel: {
    marginHorizontal: 15,
    marginVertical: 16,
  },
  descriptionLabel: {
    margin: 24,
  },
  contentLabel: {
    margin: 24,
  },
  authoringContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  dateLabel: {
    marginHorizontal: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "text-basic-color",
  },
  commentInput: {
    marginHorizontal: 24,
    // marginTop: 24,
    marginBottom: 20,
  },
  commentReactionsContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginHorizontal: -8,
    marginVertical: -8,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reactionButton: {
    paddingHorizontal: 0,
  },
});

export default LikeButton;
