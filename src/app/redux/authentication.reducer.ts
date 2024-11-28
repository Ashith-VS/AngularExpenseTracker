import { createReducer, on } from "@ngrx/store";
import { userModel } from "../models/auth.model";
import { authenticationAction, logoutAction } from "./authentication.action";

export interface initialState{
userState:userModel;
}

const InitialState:initialState={
    userState:new Object as userModel
}

export const AuthenticationReducer=createReducer(
InitialState,
on(authenticationAction,(state,payload)=>{
    return {
       ...state,
        userState:payload
    }
}),
on(logoutAction,()=>InitialState)
)