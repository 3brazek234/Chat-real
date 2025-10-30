import { profileFormSchema, ProfileFormValues } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/useAuth";
import toast from "react-hot-toast";

function EditProfile() {
  const { user, updateUser } = useAuth();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (data: ProfileFormValues) => {
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await fetch("http://localhost:3001/api/update-profile", {
        method: "PUT", // 👈 الأفضل نستخدم PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const result = await response.json();
      updateUser(result.data); // تحديث بيانات المستخدم في السياق
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* حقل الاسم */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="bg-gray-900/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* حقل الإيميل */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  {...field}
                  className="bg-gray-900/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="your password"
                  {...field}
                  className="bg-gray-900/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="confirm your password"
                  {...field}
                  className="bg-gray-900/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}

export default EditProfile;
