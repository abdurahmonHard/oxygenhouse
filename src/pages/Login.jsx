import React from "react";
import LoginForm from "../components/loginForm/LoginForm";

export default function Login() {
  return (
    <div className="h-screen flex items-start justify-center lg:py-20 lg:px-64 sx:px-20 md:p-20">
      <LoginForm />
    </div>
  );
}
