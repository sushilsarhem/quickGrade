import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/config/appwriteConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await getCurrentUser(); // Await the result of getCurrentUser
            // console.log("Fetched User:", response);
    
            if (response) {
              setIsLogged(true); // Set logged-in state
              setUser(response);
              
            }else{
              setIsLogged(false); // Set logged-in state
              setUser(null);
            }
          } catch (error) {
            console.log("Error fetching user:", error);
            
          }
        };
    
        fetchUser(); // Call the async function
      }, []);

    return (
      <UserContext.Provider value={{
        isLogged,
        setIsLogged,
        user,
        setUser,}}
        >
        {children}
      </UserContext.Provider>
    );
  };



