import { useAuthState } from "react-firebase-hooks/auth";
import { auth, guestPFP } from "../firebase-config";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { GithubAuthProvider, ProviderId, deleteUser, reauthenticateWithCredential } from "firebase/auth";

function Profile() {
    const user = auth.currentUser;

    return (
        <>
            <div className="w-full h-screen p-6 space-y-16 ">
                <div className="space-y-3">
                    <div className="static flex items-end justify-start h-64 p-3 bg-center bg-cover border-2 rounded-md shadow-xl bg-hero-img" >
                        <img src={user?.photoURL ? user.photoURL : guestPFP} alt="User Profile Picture" className="absolute w-32 transition-all translate-y-16 border-2 rounded-full shadow-lg dark:border-white hover:border-violet-500" />
                    </div>
                </div>
                <div className="space-y-5">
                    <div>
                        <h1 className="text-3xl">{user?.displayName ? user.displayName : "Guest"}</h1>
                        <p className="lowercase font-jbmono before:content-['@']">{user?.displayName ? user.displayName : "guest"}</p>
                    </div>
                    <h2 className="text-2xl">Info</h2>
                    {user?.phoneNumber &&
                        <div>
                            <h3 className="text-xl">Phone Number</h3>
                            <p>{user?.phoneNumber}</p>
                        </div>}
                    {user?.email &&
                        <div>
                            <h3 className="text-xl">E-Mail</h3>
                            <p>{user?.email}</p>
                        </div>}
                    {user?.uid &&
                        <div>
                            <h3 className="text-xl">User ID</h3>
                            <p>{user?.uid}</p>
                            <p>ONLY SEND THIS TO NOVAGON SUPPORT!!!</p>
                        </div>}
                    <button onClick={() => auth.signOut()} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-full dark:bg-secGray-secondary text-violet-500 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700">Sign Out</button>
                </div>
            </div>
        </>
    )
}

export { Profile };