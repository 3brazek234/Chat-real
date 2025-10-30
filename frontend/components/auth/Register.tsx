import { RegisterFormData, registerSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "", // افترض وجود حقل اسم
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit: handleRegisterSubmit,
    formState: { isSubmitting: isRegisterSubmitting },
    setError: setRegisterError,
  } = registerForm;
  async function onSubmitRegister(values: RegisterFormData) {
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        // Corrected URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Registration failed:",
          data.message || "Network response was not ok"
        );
        setRegisterError("email", {
          type: "manual",
          message: data.message || "Registration failed.",
        });
        setRegisterError("password", {
          type: "manual",
          message: data.message || "Registration failed.",
        });
        setRegisterError("name", {
          type: "manual",
          message: data.message || "Registration failed.",
        }); 
        return;
      }
    
      localStorage.setItem("jwt_token", data.data.token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error registering:", error);
      setRegisterError("email", {
        type: "manual",
        message: "An unexpected error occurred.",
      });
      setRegisterError("password", {
        type: "manual",
        message: "An unexpected error occurred.",
      });
    }
  }

  return (
    <Form {...registerForm}>

      <form
        onSubmit={handleRegisterSubmit(onSubmitRegister)} // هنا استخدمنا handleRegisterSubmit
        className="space-y-6"
      >
        <FormField
          control={registerForm.control}
          name="name" // تأكد إن الـ name ده موجود في RegisterFormData و registerSchema
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  className="text-white bg-gray-900/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  className="text-white bg-gray-900/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />{" "}
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  className="text-white bg-gray-900/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />{" "}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isRegisterSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
        >
          {isRegisterSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}

export default Register;
