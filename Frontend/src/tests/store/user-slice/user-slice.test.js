import userSlice, { userActions } from "../../../store/user-slice";

describe("user-slice actions Testing", () => {
  const defaulState = { user: null };
  test("setUser Testing", () => {
    expect(userSlice.reducer(defaulState, userActions.setUser("newUser"))).toEqual({
      user: "newUser",
    });
  });

  test("clearUser Testing", () => {
    expect(userSlice.reducer(defaulState, userActions.clearUser())).toEqual({
      user: null,
    });
  });
});
