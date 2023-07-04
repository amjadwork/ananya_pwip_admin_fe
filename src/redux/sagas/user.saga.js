import { put, takeEvery } from "redux-saga/effects";

import { types as userTypes } from "../ducks/user";

function* willSetUserData(action) {
  yield put({
    type: userTypes.SET_USER_DATA,
    user: action.user,
  });
}

function* willResetUserData() {
  yield put({
    type: userTypes.RESET_USER_DATA,
    user: null,
  });
}

const userSagas = [
  takeEvery(userTypes.SET_USER_DATA_REQUEST, willSetUserData),
  takeEvery(userTypes.RESET_USER_DATA_REQUEST, willResetUserData),
];

export default userSagas;
