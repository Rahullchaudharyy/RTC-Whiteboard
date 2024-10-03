import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { db } from "../../utils/firebase";
import { ref, set,get } from "firebase/database";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/UserSlice";

const Auth = () => {
  const [IsSignUp, setIsSignUp] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
//   const [Data, setData] = useState()
  const dispatch = useDispatch()
  const FormState = () => {
    setIsSignUp(!IsSignUp);
  };

  const HandleForm = async (e) => {
    e.preventDefault();
    try {
      if (!IsSignUp) {
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user ;
      console.log('User Sign in successfully !!', user)   
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const user = userCredential.user;
        await updateProfile(user, {
            displayName: name,
          });
        const userRef = ref(db, "users/" + user.uid);
        await set(userRef, {
          name: name,
          createdSessions: ["Initial"],
          joinedSessions: ["initial"],
          email: email,
          uid: user.uid,
          createdAt: new Date().toISOString()
        });
        const snapshot = await get(userRef);
              
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Retrieved data:", data);
            dispatch(addUser(data))
        }
        
        console.log("This is the User Data", user);
          alert("User Created successfully");
      }
    } catch (error) {
        console.error("Error creating user: ", error);
    }
  };
  const RegisterByGoogle= async ()=>{
    try {
      const UserCredentials =   await signInWithPopup(auth,provider)
      console.log(UserCredentials)
        
    } catch (error) {
        
    }
  }
  return (
    <div className="h-[100vh] w-[100vw]  flex justify-center items-center ">
      <div className="h-auto w-[300px] sm:h-auto sm:w-[40vmin] lg:h-auto p-6 rounded-md lg:w-[50vmin] bg-white">
        <form className="flex flex-col p-6 gap-5" onSubmit={HandleForm}>
          {IsSignUp ? (
            <>
              <label
                htmlFor="Email"
                className="sm:text-[2.5vmin] md:text-[2vmin]"
              >
                Name
              </label>
              <input
                onChange={(e) => {
                  setname(e.target.value);
                }}
                value={name}
                required={true}
                className="border border-gray-500 rounded-md p-3 md:p-1"
                type="text"
                placeholder="Please Enter your name"
              />
            </>
          ) : (
            ""
          )}

          <label htmlFor="Email" className="sm:text-[2.5vmin] md:text-[2vmin]">
            Email
          </label>
          <input
            onChange={(e) => {
              setemail(e.target.value);
            }}
            value={email}
            required={true}
            className="border border-gray-500 rounded-md p-3 md:p-1"
            type="email"
            placeholder="Please Enter your email"
          />
          <label
            htmlFor="Password"
            className="sm:text-[2.5vmin] md:text-[2vmin]"
          >
            Password
          </label>
          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            value={password}
            required={true}
            className="border border-gray-500 rounded-md p-3 md:p-1"
            type="password"
            placeholder="Please Enter your Password"
          />
          <button type="submit" className="bg-black rounded-md  p-2 text-white justify-items-center">
     
            {IsSignUp ? "SignUp" : "Login"}
          </button>
          <button>OR</button>
          <button
          onClick={RegisterByGoogle}
            className="bg-blue-700 rounded-md  p-2 text-white justify-items-center"
          >
            {IsSignUp ? "SignUp" : "Signin"} With Google
          </button>

          <h1
            onClick={FormState}
            className="text-blue-600 underline cursor-pointer"
          >
            {IsSignUp?"Don't have an accouunt ?? Click here":"Already have an accound ?? Login ."}
          </h1>
        </form>
      </div>
    </div>
  );
};

export default Auth;
