import { oAuthThunk } from "../redux/Thunks/oAuth";
import { useThunk } from "../utils/useLoadingThunk";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import Button from "./Button";

const OAuth = () => {
  const [doGoogleAuth, isGoogleLoading, isGoogleError] = useThunk(oAuthThunk);

  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    doGoogleAuth(result);
  };

  return (
    <>
      <Button
        loading={isGoogleLoading}
        onClick={handleClick}
        type="button"
        className="bg-red-700 text-white rounded-lg h-12 hover:opacity-95 disabled:opacity-80"
      >
        CONTINUE WITH GOOGLE
      </Button>
      <div>{isGoogleError && isGoogleError}</div>
    </>
  );
};

export default OAuth;
