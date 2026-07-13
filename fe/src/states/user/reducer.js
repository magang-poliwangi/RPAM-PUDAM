import { ActionType } from "./action";

function usersReducer(users = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USERS:
      return action.payload.users;

    case ActionType.ADD_USER:
      return [...users, action.payload.user];

    case ActionType.UPDATE_USER:
    case ActionType.SET_USER_STATUS:
      return users.map((u) =>
        u.id === action.payload.user.id ? { ...u, ...action.payload.user } : u
      );

    case ActionType.DELETE_USER:
      return users.filter((u) => u.id !== action.payload.id);

    default:
      return users;
  }
}

export default usersReducer;