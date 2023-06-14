import React, { createContext, useState } from 'react';
import { Alert } from "../components/index";

export const ErrorContext = createContext();

// export const ErrorProvider = ({ children }) => {
//     const [error, setError] = useState(false);
  
//     const showError = (message) => {
//       setError(message);
//     };
  
//     const hideError = () => {
//       setError(null);
//     };
  
//     return (
//       <ErrorContext.Provider value={{ error, showError, hideError }}>
//          {error ? (
//               <Alert title="Something wrong" color="red" radius="md">
//                 Didn't get name of product properly .
//               </Alert>
//             ) : null}
//       </ErrorContext.Provider>
//     );
//   };