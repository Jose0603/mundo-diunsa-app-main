import { useDispatch } from "react-redux";
import { setMessage } from "../Redux/reducers/dialog/dialogsSlice";
interface props {
  onPress: () => void;
  isOpen: boolean;
}
export default function useAlert() {
  const dispatch = useDispatch();
  const show = ({ onPress = () => {}, isOpen = true }: props) => {
    return dispatch(
      setMessage({
        onPress,
        isOpen,
      })
    );
  };
  return { show };
}
