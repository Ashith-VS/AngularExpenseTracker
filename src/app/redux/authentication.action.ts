import { createAction, props } from "@ngrx/store";
import { userModel } from "../models/auth.model";

export const authenticationAction = createAction('[currentUser] currentUserData',props<userModel>())
export const logoutAction = createAction('[Auth] Logout')