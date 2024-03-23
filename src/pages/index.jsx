import { Inter } from "next/font/google";

import { FormProvider, useForm } from "react-hook-form";
import ValidatedInput from "@/components/ValidatedInput";
import Button from "@/components/Button";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const methods = useForm()
  const router = useRouter();


  const onSubmit = async (data) => {
    const url = 'https://qt.organogram.app/token';

    const requestData = {
      email: data?.email
    };

    setIsLoading(true)
    try {
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", JSON.stringify(response?.data?.token));
      }
      alert("Your token has been created successfully")
      router.push("/questions")
    } catch (error) {
      console.error('Error requesting token:', error.message);
      alert(error.message)
    }
    setIsLoading(false)
  }

  return (
    <main className="w-full max-w-[30rem] mx-auto" >
      <div className="flex items-center justify-between my-8">
        <h1 className="flex gap-4 text-3xl items-center text-black font-semibold">
          Get Token Page
        </h1>
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-y-8 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <ValidatedInput
            name="email"
            label="Enter Email Address"
            placeholder="example@email.com"
            rules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            }}
          />

          <Button
            title={isLoading ? "Loading..." : "Login"}
            type="submit"
          />
        </form>
      </FormProvider>
      {/* <Link
        href="/questions"
        text-black font-semibold
      >
        Login
      </Link> */}

    </main>
  );
}
