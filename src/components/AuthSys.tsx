import { signInAnonymously, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, Auth } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import { Cancel, GithubCircle, GoogleCircle, LogOut, User, UserCircle } from 'iconoir-react';
// Initialize Firebase

export function SignIn() {
  const [isBanned, setIsBanned] = useState(false);
  const signInAsGuest = () => {
    signInAnonymously(auth)
      .then(() => {
        console.log('Signed in as guest');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-disabled") {
          setIsBanned(true);
        } else {
          console.log(errorCode, errorMessage);
        }
      });
  };

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // GitHub sign-in successful
        const user = result.user;
        console.log('Signed in as', user.displayName);
      })
      .catch((error) => {
        // An error occurred during sign-in
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-disabled") {
          setIsBanned(true);
        } else {
          console.log(errorCode, errorMessage);
        }
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // GitHub sign-in successful
        const user = result.user;
        console.log('Signed in as', user.displayName);
      })
      .catch((error) => {
        // An error occurred during sign-in
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-disabled") {
          setIsBanned(true);
        } else {
          console.log(errorCode, errorMessage);
        }
      });
  };
  return (
    <>
      {isBanned && <BannedPopup isBanned={isBanned} onClose={() => setIsBanned(false)} />}
      <div className="md:h-[86vh] h-[90vh] w-full flex justify-center md:items-center  items-end flex-col bg-gradient-to-bl from-primaryBlue-primary to-logoPink">
        <div className="inline-flex flex-col items-center justify-center w-full h-screen gap-8 px-12 py-8 border-2 rounded-none shadow-lg md:w-96 md:h-80 dark:bg-base/50 bg-subtext1/50 dark:border-surface0 border-overlay2 md:rounded-2xl">
          <h1 className="text-center text-white text-[24px] font-bold leading-tight">Sign In</h1>
          <div className="p-[0px] flex-col justify-center items-center gap-4 flex">
            <button className="sign-in-btn button-secondary" onClick={signInAsGuest}>
              <UserCircle className="w-6 h-6" />
              Try Novagon Web
            </button>
            <button className="sign-in-btn button-secondary" onClick={signInWithGitHub}>
              <GithubCircle className='w-6 h-6'/>
              Sign in with GitHub
            </button>
            <button className="sign-in-btn button-secondary" onClick={signInWithGoogle}>
              <GoogleCircle className='w-6 h-6'/>
              Sign in with Google
            </button>
          </div>
          <div className="p-[0px] flex-col justify-start items-start gap-[10px] flex">
          </div>
        </div>
      </div>
    </>
  );
}


interface SignOutProps {
  auth: Auth;
}

export function SignOut({ auth }: SignOutProps) {
  const [user] = useAuthState(auth);
  if (user) {
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    return (
      <div className="flex items-center justify-center space-x-4 rounded-full dark:bg-crust bg-zinc-300">
        {displayName == null ? <p className="ml-6">Guest</p> : <p className="ml-6">{displayName}</p>}
        {photoURL && <img className='rounded-full w-9 h-9' src={photoURL || 'https://novagoncdn.netlify.app/img/guest_pfp.png'} alt="pfp" />}
        <button onClick={() => auth.signOut()} className="button-secondary"> <LogOut className='w-6'/> <p className='sr-only'>Sign Out</p></button>
      </div>
    );
  } else {
    return null
  }
}

interface BannedPopupProps {
  isBanned: boolean;
  onClose: () => void;
}

export function BannedPopup({ isBanned, onClose }: BannedPopupProps) {
  if (!isBanned) {
    return null; // Render nothing if not banned
  }
  return (
    <div className="fixed top-0 left-0 z-50 flex items-end justify-center w-full h-full p-4 bg-black bg-opacity-50 sm:items-center sm:p-0 backdrop-blur-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 space-x-16 rounded-full dark:bg-base bg-zinc-300">
          <h2 className="self-center ml-2 text-2xl font-bold">Account Banned</h2>
          <button onClick={onClose} className="transition-all hover:text-mauve">
            <Cancel className='w-8 h-8'/>
          </button>
        </div>
        <div className="p-4 dark:bg-base bg-zinc-300 rounded-3xl">
          <p>Hello. Your account has been banned.</p>
          <p>Reason: Unknown.</p>
          <p>If you think its a mistake, or have any questions, <a href="mailto:contactnovagon@gmail.com" className="underline text-mauve">Contact Us.</a></p>
        </div>
      </div>
    </div>
  );
}