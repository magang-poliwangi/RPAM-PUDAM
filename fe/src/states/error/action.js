export const ActionType = {
  SET_ERROR: 'SET_ERROR',
  UNSET_ERROR: 'UNSET_ERROR',
};

export function setErrorActionCreator(error) {
  return {
    type: ActionType.SET_ERROR,
    payload: {
      error
    },
  };
}

export function unsetErrorActionCreator() {
  return {
    type: ActionType.UNSET_ERROR,
  };
}

