
// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { initializeAuthThunk } from "../../features/auth/authThunks";

// function AuthInitializer({ children }) {
//   const dispatch = useDispatch();
//   const hasInitialized = useRef(false);

//   const isInitializing = useSelector(
//     (state) => state.auth.isInitializing
//   );

//   useEffect(() => {
//     if (hasInitialized.current) return;

//     hasInitialized.current = true;
//     dispatch(initializeAuthThunk());
//   }, [dispatch]);

//   if (isInitializing) {
//     return (
//       <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3">
//         <div
//           className="spinner-border text-primary"
//           role="status"
//           aria-label="Loading"
//         />

//         <p className="text-secondary mb-0">
//           Preparing your TalentHub experience...
//         </p>
//       </div>
//     );
//   }

//   return children;
// }

// export default AuthInitializer;
// ------------------------------------------------------------


import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { initializeAuthThunk } from "../../features/auth/authThunks";
import { clearAuthSession } from "../../features/auth/authSlice";
import { setSessionExpiredHandler } from "../../api/axios";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  const isInitializing = useSelector(
    (state) => state.auth.isInitializing
  );

  useEffect(() => {
    setSessionExpiredHandler(() => {
      dispatch(clearAuthSession());
    });

    return () => {
      setSessionExpiredHandler(null);
    };
  }, [dispatch]);

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading"
        />

        <p className="text-secondary mb-0">
          Preparing your TalentHub experience...
        </p>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
