"use client";

import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, google_provider } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import {
  checkIfDocumentExists,
  createBizUserDocumentFromAuth,
  createUserDocumentFromAuth,
  getDocumentByFieldValue,
} from "@/utils/functions";
import { useRouter } from "next/navigation";
import { createToken } from "@/utils/auth";
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setAdmin] = useState(false);

  // Check if there's a saved isAdmin state in localStorage on component mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  function login(email, password){
    signInWithEmailAndPassword(auth, email, password)
    setAdmin(true);
    // Save isAdmin state in localStorage
    localStorage.setItem('isAdmin', JSON.stringify(true));
  };

  function logout(){
    signOut(auth)
    setAdmin(false);
    // Remove isAdmin state from localStorage
    localStorage.removeItem('isAdmin');
  };

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // function login(email, password) {
  //   return signInWithEmailAndPassword(auth, email, password);
  // }

  // function logout() {
  //   return signOut(auth);
  // }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }
  /**Login and sign up for influencer account goes here */
  const signUpWithEmailandPassword_influencer = async (
    email,
    password,
    username
  ) => {
    const userCredential = await signup(
      // emailRef.current.value,
      // passwordRef.current.value
      email,
      password
    );

    const user = userCredential.user;

    const doesAccountHaveUserName = await checkIfDocumentExists(
      "users",
      "uid",
      user.uid
    ); // returns true if there is a username associated with the user uid
    console.log(doesAccountHaveUserName, "doesAccountHaveUserName");

    if (doesAccountHaveUserName) {
      console.log("user already has username");
      throw new Error("user already has username");
      toast({
        variant: "destructive",
        title: "Account has username",
        description: "Please login instead",
        status: "",
        action: (
          <ToastAction altText="Try again">
            <Link href="/sigin">Create an account</Link>
          </ToastAction>
        ),
      });
      return;
    } else {
      //user does not have a username so creating one and redirecting to user dashboard
      console.log(username);
      await createUserDocumentFromAuth(user, username);
      await setInfUserCookie({ uid: user.uid, username: username });

      router.push(`/${username}/edit`);
    }
  };
  const loginWithEmailandPassword_influencer = async (email, password) => {
    const res = await login(email, password);
    const user = res.user;
    const userDetails = await getDocumentByFieldValue("users", "uid", user.uid);
    console.log(userDetails);
    /* 
      Fetch the username from firebase
    */
    await setInfUserCookie({
      uid: user.uid,
      username: userDetails.username,
    });
    router.push(`/${userDetails.username}/edit`); // We need the username here... Must be `/${username}/edit`
  };
  const signUpWithGoogle_influencer = async (username) => {
    const result = await signInWithPopup(auth, google_provider);

    if (result) {
      const user = result.user;
      //handle case where user is already registered
      const doesAccountHaveUserName = await checkIfDocumentExists(
        "users",
        "uid",
        user.uid
      ); // returns true if there is a username associated with the user uid

      if (doesAccountHaveUserName) {
        console.log("user already has username");

        throw new Error("user already has username");
      } else {
        //user does not have a username so creating one and redirecting to user dashboard
        await createUserDocumentFromAuth(user, username);
        await setInfUserCookie({ uid: user.uid, username: username });
        console.log(username);
        router.push(`/${username}/edit`);
      }
    }
  };

  const loginWithGoogle_influencer = async () => {
    const result = await signInWithPopup(auth, google_provider);

    if (result) {
      const user = result.user;
      // console.log(user);
      const doesAccountHaveUserName = await checkIfDocumentExists(
        "users",
        "uid",
        user.uid
      ); // returns true if there is a username associated with the user uid
      // console.log("doesUsername", doesAccountHaveUserName);
      if (doesAccountHaveUserName) {
        // console.log("user has username");

        const userDetails = await getDocumentByFieldValue(
          "users",
          "uid",
          user.uid
        ); //getting user details associated with the user uid
        // console.log("user details: " + userDetails);
        await setInfUserCookie({
          uid: user.uid,
          username: userDetails.username,
        });
        //create cookie

        router.push(`/${userDetails.username}/edit`);
      } else {
        //user does not have a username so creating one and redirecting to user dashboard
        throw new Error("account does not exist");
      }
    }
  };

  /**Login and sign up for influencer account Ends here */
  /**
   *
   *
   *
   *
   *
   *
   */
  /**Login and sign up for business account goes here */

  const signUpWithGoogle_business = async (ownerInfo, businessInfo) => {
    const result = await signInWithPopup(auth, google_provider);
    if (!result) return { success: false, msg: "sign in google failed" };

    const user = result.user;
    // const bizNameExists = await checkIfDocumentExists(
    //   "business",
    //   "name",
    //   businessInfo.businessName
    // );

    //checking if account uid has a business account
    const uidExistInDB = await checkIfDocumentExists(
      "business",
      "uid",
      user.uid
    );
    //check if user exists in db
    //if not, create user in db
    if (uidExistInDB)
      throw new Error("this google account has a business acount already");
    //at this point, all checks have been passed so creating account
    const res = await createBizUserDocumentFromAuth(
      ownerInfo,
      businessInfo,
      user
    );
    setBizUserCookie({ uid: user.uid, bizID: res.bizID });
    router.push(`/business/${res.bizID}/dashboard`);
    console.log("user created, done!");
  };

  const loginWithEmailandPassword_business = async (email, password) => {
    const res = await login(email, password);
    const user = res.user;
    const userDetails = await getDocumentByFieldValue(
      "business",
      "uid",
      user.uid
    );
    console.log(userDetails);
    /* 
      Fetch the username from firebase
    */
    await setBizUserCookie({
      uid: user.uid,
      bizID: userDetails.bizID,
    });
    console.log(userDetails.bizID);
    // router.push(`business/${userDetails.bizID}/dasboard`); // We need the username here... Must be `/${username}/edit`
    console.log("done");
    return userDetails.bizID;
  };
  const loginWithGoogle_business = async () => {
    const result = await signInWithPopup(auth, google_provider);

    if (result) {
      const user = result.user;
      // console.log(user);
      const doesAccountHaveUserName = await checkIfDocumentExists(
        "business",
        "uid",
        user.uid
      ); // returns true if there is a username associated with the user uid
      // console.log("doesUsername", doesAccountHaveUserName);
      if (doesAccountHaveUserName) {
        // console.log("user has username");

        const userDetails = await getDocumentByFieldValue(
          "business",
          "uid",
          user.uid
        ); //getting user details associated with the user uid
        // console.log("user details: " + userDetails);
        await setBizUserCookie({
          uid: user.uid,
          bizID: userDetails.bizID,
        });
        //create cookie

        router.push(`business/${userDetails.bizID}/dashboard`);
      } else {
        //user does not have a username so creating one and redirecting to user dashboard
        throw new Error("account does not exist");
      }
    }
  };

  const signUpWithEmailandPassword_business = async (
    email,
    password,
    ownerInfo,
    businessInfo
  ) => {
    console.log(email, password);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const uidExistInDB = await checkIfDocumentExists(
      "business",
      "uid",
      user.uid
    );
    if (uidExistInDB) throw new Error("uid is in DB already");
    //if not, create user in db

    const res = await createBizUserDocumentFromAuth(
      ownerInfo,
      businessInfo,
      user
    );
    await setBizUserCookie({ uid: user.uid, bizID: res.bizID });

    router.push(`/business/${res.bizID}/dashboard`);
  };
  /**Login and sign up for business account ends here */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
      } else {
        deleteBizUserCookie();
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    signUpWithGoogle_business,
    signUpWithGoogle_influencer,
    signUpWithEmailandPassword_business,
    signUpWithEmailandPassword_influencer,
    loginWithGoogle_influencer,
    loginWithEmailandPassword_influencer,
    loginWithGoogle_business,
    loginWithEmailandPassword_business,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";

export const setBizUserCookie = async (userDetails) => {
  const tokenized = await createToken(userDetails);
  return Cookies.set("bizUser", tokenized, { secure: true });
};
export const setInfUserCookie = async (userDetails) => {
  console.log(userDetails); //{uid: "1", bizID: "2"} do i have to stringify this?

  const tokenized = await createToken(userDetails);
  return Cookies.set("infUser", tokenized, { secure: true });
};

const deleteBizUserCookie = () => {
  // cookieStore.delete("bizUser"); // I was getting some error so... commented it
};
