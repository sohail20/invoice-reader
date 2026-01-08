"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useLoginMutation } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

type JwtPayload = {
  roles?: string[];
  exp: number;
};

export default function SignInForm() {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await login({ email, password }).unwrap();

      const token = data.access_token;
      const decoded = jwtDecode<JwtPayload>(token);
      const roles = decoded.roles ?? [];

      // Store in redux
      dispatch(setCredentials({ token, roles }));

      // Persist
      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));

      // Redirect
      if (roles.includes("admin")) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      // RTK handles error state
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your user name and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  User Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="User Name"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red-500">
                  {"status" in error
                    ? "Invalid credentials"
                    : "Something went wrong"}
                </p>
              )}

              <Button className="w-full" size="sm" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
