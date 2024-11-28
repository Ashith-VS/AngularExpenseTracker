
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { initialState } from "./authentication.reducer";

const selectorState=createFeatureSelector<initialState>('currentUser')

export const selectCurrentUser=createSelector(
selectorState,
(state)=>state.userState
)