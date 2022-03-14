import { createContext } from "react";

export interface ILoadingContext {
  loading: boolean;
}

const initialState: ILoadingContext = {
  loading: false,
};

const LoadingContext = createContext<ILoadingContext>(initialState);

export default LoadingContext;
