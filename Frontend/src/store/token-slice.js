import { overlayMessageActions } from "./overlay-message-slice";
import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "./user-slice";
import jwt from "jwt-decode";

const endPoint = "http://localhost:3001/auths";

const tokenSlice = createSlice({
  name: "token",
  initialState: { isExpired: false, isNotInStorage: false },
  reducers: {
    setExpiredToken(state) {
      state.isExpired = true;
    },
    setIsNotInStorage(state) {
      state.isNotInStorage = true;
    },
    setTokenIsValid(state) {
      state.isExpired = false;
      state.isNotInStorage = false;
    },
  },
});

export const tokenActions = tokenSlice.actions;

const renewToken = async (token) => {
  const respone = await fetch(`${endPoint}/renew`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const isTokenExpired = !respone.ok;
  return isTokenExpired ? null : (await respone.json()).token;
};

export const checkForTokenInStorage = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return dispatch(tokenActions.setIsNotInStorage());

      const newToken = await renewToken(token);
      if (!newToken) return dispatch(tokenActions.setExpiredToken());

      const decodedData = jwt(newToken);
      const user = {
        fullname: decodedData.fullname,
        email: decodedData.email,
        address: decodedData.address,
        username: decodedData.username,
        id: decodedData.userId,
      };

      localStorage.setItem("token", newToken);
      dispatch(userActions.setUser(user));
    } catch (error) {
      console.log("error:::", error);
      dispatch(overlayMessageActions.setOverlayMessage("Undetected error occured, please try again"));
    }
  };
};

export default tokenSlice;
