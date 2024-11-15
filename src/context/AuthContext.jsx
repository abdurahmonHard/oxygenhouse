/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [entranceId, setEntranceId] = useState(null);
   const [profile, setProfile] = useState({});
   const [isOpenMenu, setIsOpenMenu] = useState(false)
   const [cassierType, setCassierType] = useState(null)
   const [paymentNow, setPaymentNow] = useState(null)
   const [imageId, setImageId] = useState(null)

   useEffect(() => {
      // localStorage dan malumotni o'qib olish
      const storedProfile = JSON.parse(sessionStorage.getItem("userProfile"));
      if (storedProfile) {
         setProfile(storedProfile);
      }
   }, []);

   return (
      <AuthContext.Provider
         value={{ user, setUser, entranceId, setEntranceId, profile, setProfile, isOpenMenu, setIsOpenMenu, cassierType, setCassierType, paymentNow, setPaymentNow, imageId, setImageId }}
      >
         {children}
      </AuthContext.Provider>
   );
}
