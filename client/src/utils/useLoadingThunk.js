import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export const useThunk = (thunk) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();

  const runThunk = useCallback(
    (arg) => {
      setIsLoading(true);
      dispatch(thunk(arg))
        .unwrap()
        .then(() => {
          setIsError(null);
          setIsSuccess(true);
        })
        .catch((error) => {
          setIsError(error.message);
          setIsSuccess(false);
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => {
            setIsSuccess(false);
            setIsError(null);
          }, 4000);
        });
    },
    [dispatch, thunk]
  );

  return [runThunk, isSuccess, isLoading, isError];
};
