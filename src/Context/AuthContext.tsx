import { createContext, useState, useEffect, type ReactNode } from "react";
import {jwtDecode} from "jwt-decode"


interface AuthContextType {
  userLogin: any;
  userId: string;
  setuserLogin: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setuserLogin: () => {},
  userId: "",
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
          const [userLogin, setuserLogin] = useState(
          localStorage.getItem("userToken")
        );

        const [userId, setuserId] = useState("")
        useEffect(() => {
          if ( localStorage.getItem("userToken")) {
            const {user} : {user : string } = jwtDecode(localStorage.getItem("userToken"))
            setuserId(user)
          }
                    
          
        }, [userLogin])
        



  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
}



    // useEffect(() => {
    //   if(localStorage.getItem("userToken")){
    //     setuserLogin(localStorage.getItem("userToken"))
    //   }
    
    //   return () => {
        
    //   }
    // }, [])