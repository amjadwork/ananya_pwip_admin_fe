export const types = {
  SET_USER_DATA_REQUEST: "SET_USER_DATA_REQUEST",
  SET_USER_DATA: "SET_USER_DATA",
  RESET_USER_DATA_REQUEST: "RESET_USER_DATA_REQUEST",
  RESET_USER_DATA: "RESET_USER_DATA",
};

export const initialState = {
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_DATA:
      return { ...state, user: action.user };
    case types.RESET_USER_DATA:
      return { ...state, user: null };
    default:
      return state;
  }
};

export const actions = {
  setUserData: (data) => {
    return { type: types.SET_USER_DATA_REQUEST, user: data };
  },
  resetUserData: () => ({ type: types.RESET_USER_DATA_REQUEST, user: null }),
};
