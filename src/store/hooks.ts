import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

// Use these throughout the app instead of the plain react-redux hooks.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
