import * as React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

type PropsSafeBox = {
  children: React.ReactNode;
}

const onError = ({error}: FallbackProps) => {
  return <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{ color: "red" }}>{(error && "message" in error) ? error.message : "Error"}</pre>
  </div>
}

export const SafeBox: React.FC<PropsSafeBox> = ({children}) => (
  <ErrorBoundary fallbackRender={onError}>
    {children}
  </ErrorBoundary>
)