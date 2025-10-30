import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LoginFormData, loginSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/context/useAuth";

function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit: handleLoginSubmit,
    formState: { isSubmitting: isLoginSubmitting },
    setError: setLoginError,
  } = loginForm;
  async function onSubmitLogin(values: LoginFormData) {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // هنا قيم الـ form (values) هي اللي بتتبعت كـ body
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Login failed:",
          data.message || "Network response was not ok"
        );
        setLoginError("email", {
          type: "manual",
          message: data.message || "Invalid credentials.",
        });
        setLoginError("password", {
          type: "manual",
          message: data.message || "Invalid credentials.",
        });
        return; 
      }
      toast.success("Login successful!");

      const user_data = data?.data?.user;
      const token = data?.data?.token;
      login(token, user_data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("email", {
        type: "manual",
        message: "An unexpected error occurred.",
      });
      setLoginError("password", {
        type: "manual",
        message: "An unexpected error occurred.",
      });
    }
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">
        <FormField
          control={loginForm.control} // ربط بـ control بتاع loginForm
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  className="text-white bg-gray-900/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" /> {/* رسالة الخطأ */}
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control} // ربط بـ control بتاع loginForm
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="text-white bg-gray-900/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" /> {/* رسالة الخطأ */}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoginSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
        >
          {isLoginSubmitting ? "Logging In..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

export default Login;
