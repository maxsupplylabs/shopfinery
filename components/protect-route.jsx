"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// async function docExist(username) {
//   const docRef = doc(db, "users", username);
//   const docSnap = await getDoc(docRef);

//   return docSnap.exists();
// }

// export default function ProtectedRoute({ children }) {

  const PrivateRoute = ({ children }) => {
    const { isAdmin } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!isAdmin) {
        router.push('/admin/login'); // Redirect to login or another route
      }
    }, [isAdmin]);
  
    return isAdmin ? <>{children}</> : null;
  };
export default PrivateRoute;