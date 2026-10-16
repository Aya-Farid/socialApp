import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({ children }: { children: React.ReactNode }) {

  if (localStorage.getItem("userToken")) {

    return <Navigate to={"/home"} />

  }
  else {

    return <>{children}</>

  }

}