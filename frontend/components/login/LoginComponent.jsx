"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/components/button";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/components/toaster";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/components/input";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { push_messaging_token } from "@/lib/push-message";
export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function loginHandler() {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_ENDPOINT}/login`;
    const data = {
      username: email,
      password,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify(data),
    });
    const ans = await response.json();
    const id = ans?.user_id;
    console.log(ans);
    if (id != null) {
      console.log("user_id", id);
      localStorage.setItem("token", JSON.stringify(ans));
      // push_messaging_token();
      router.push("/");
    }
    if (ans.detail == "error") {
      toast({
        title: "Invalid Credentials",
        description: `Please Re-Enter Your Email and Password`,
      });
    }
    setLoading(false);
  }

  return (
    <div className="w-[60%] bg-white px-16 3xl:px-44">
      <div className="flex flex-col items-center justify-center bg-white p-4 w-full h-full">
        <h1 className="text-black sm:text-xl font-semibold my-4">
          Login First To Your Account
        </h1>

        <div className="w-full flex flex-col gap-4 my-4">
          <Input
            type="email"
            value={email}
            rounded
            size="lg"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="placeholder:text-sm"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              size="lg"
              rounded
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mb-4 placeholder:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[40%] -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 my-2">
            <input
              type="checkbox"
              className="checkbox border border-gray-300"
            />
            <label htmlFor="remember" className="text-gray-500 text-xs">
              Remember Me
            </label>
          </div>
          <a href="#" className="text-[#227f7e] text-xs">
            Forgot Password?
          </a>
        </div>
        <div className="w-full my-8">
          <Button
            onClick={loginHandler}
            variant="outline-secondary"
            center
            disabled={email == "" || password == ""}
            isLoading={loading}
          >
            Login
          </Button>
        </div>
        <p className="my-4 text-sm text-gray-600 dark:text-gray-400">
          New to us?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
}
