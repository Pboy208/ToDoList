import { overlayMessageActions } from "../store/overlay-message-slice";
import { tokenActions } from "../store/token-slice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import jwt from "jwt-decode";

const TIME_THRESHOLD_FOR_REVIEW_TOKEN = 5 * 60; //In seconds

export const useHttpClient = () => {
  const dispatch = useDispatch();

  const errorHandler = useCallback(
    (errorCode, message) => {
      switch (errorCode) {
        case 401:
          dispatch(tokenActions.setExpiredToken());
          break;
        case 404:
          break;
        default:
          dispatch(overlayMessageActions.setOverlayMessage(message));
          break;
      }
      return null;
    },
    [dispatch]
  );

  const isTokenAboutToExpired = (token) => {
    const remainTimeInSeconds = jwt(token).exp - Math.floor(Date.now() / 1000);
    if (remainTimeInSeconds > 0 && remainTimeInSeconds < TIME_THRESHOLD_FOR_REVIEW_TOKEN) {
      return true;
    }
    return false;
  };

  const reviewToken = useCallback(async (token) => {
    const res = await fetch(`http://localhost:3001/auths/review`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      // if there was delay in connection and token was expired in sever then return old token
      return token;
    }

    const responeData = await res.json();
    const newToken = responeData.token;
    localStorage.setItem("token", newToken);
    return newToken;
  }, []);

  const sendRequest = useCallback(
    async ({ url, method = "GET", body = null, token = null }) => {
      try {
        const requestConfig = {
          method,
          headers: { accept: "application/json", "Content-Type": "application/json" },
        };

        if (body) {
          requestConfig.body = JSON.stringify(body);
        }

        if (token) {
          if (isTokenAboutToExpired(token)) {
            const newToken = await reviewToken(token);
            requestConfig.headers.authorization = `Bearer ${newToken}`;
          } else {
            requestConfig.headers.authorization = `Bearer ${token}`;
          }
        }

        const res = await fetch(url, requestConfig);
        console.log(requestConfig);
        const responeData = await res.json();
        if (!res.ok) {
          return errorHandler(res.status, responeData.message);
        }

        return responeData;
      } catch (error) {
        console.log("Error in useHttpClient hook:::", error);
        return errorHandler(-1, "Undetected error occured, please try again");
      }
    },
    [errorHandler, reviewToken]
  );
  return sendRequest;
};
