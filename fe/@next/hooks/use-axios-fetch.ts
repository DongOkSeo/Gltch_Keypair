/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
import { useState } from "react";
import {} from "@store";
import { useAppSelector, useAppDispatch } from "@hooks";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";

interface mainProps {
  (
    setSnackbarProps?:
      | ((
          message: string,
          show: boolean,
          type: "success" | "error" | "warning" | "info" | undefined
        ) => void)
      | boolean
  ): any;
}
interface fetchDataProps {
  (
    url: (...props: any) => Promise<AxiosResponse<unknown, any>>,
    handleErrorResponse?: () => void,
    shouldHandleError?: boolean
  ): any | void;
}
let tokenId: any;

export const useAxiosFetch: mainProps = (setSnackbarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<any>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  // eslint-disable-next-line consistent-return
  const fetchData: fetchDataProps = async (
    url,
    handleErrorResponse,
    shouldHandleError = true
  ) => {
    setIsLoading(true);
    setFetchError(null);
    setData(null);
    try {
      const res: any = await url();
      setData(res?.data);
      setFetchError(null);
      setIsLoading(false);
    } catch (err: any) {
      setFetchError(err?.response);

      setIsLoading(false);
      if (!err?.response) {
        if (setSnackbarProps)
          enqueueSnackbar("Something Went Wrong. Please Try Again", {
            variant: "error",
          });
        setData(null);
        return;
      }
      if (setSnackbarProps) {
        enqueueSnackbar(err?.response?.data?.description, {
          variant: "error",
        });
      }
    }
  };

  return { data, fetchError, isLoading, fetchData };
};
