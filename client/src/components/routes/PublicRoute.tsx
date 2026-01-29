import { Navigate } from "react-router-dom"
import type { JSX } from "react"
import { useAuth } from "@/context/AuthContext"

interface Props {
  children: JSX.Element
}

const PublicRoute = ({ children }: Props) => {
  const { user } = useAuth() 

  if (user) return <Navigate to="/todos" replace />

  return children
}

export default PublicRoute
