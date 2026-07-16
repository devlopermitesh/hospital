"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserLogin, UserLoginSchema } from "@/src/zodSchema/userLogin.schema";

const Login = () => {
  const router = useRouter();
  const form = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserLogin> = async (data) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        console.log("Error:", response.error);
        toast.error(`Login failed: ${response.error}`, {
          duration: 3000,
          style: {
            backgroundColor: "red",
            color: "white",
            borderRadius: "8px",
          },
        });
      } else if (response?.ok) {
        // Success case
        toast.success("Login successful!", {
          duration: 3000,
          style: {
            backgroundColor: "green",
            color: "white",
            borderRadius: "8px",
          },
        });


      } else {
        toast.error("Something went wrong! Please try again.", {
          duration: 3000,
          style: {
            backgroundColor: "red",
            color: "white",
            borderRadius: "8px",
          },
        });
      }
    } catch (error: any) {
      console.log("Error:", error);
      toast.error(
        error?.response?.data?.error ||
          "An unexpected error occurred. Please try again.",
        {
          duration: 3000,
          style: {
            backgroundColor: "red",
            color: "white",
            borderRadius: "8px",
          },
        },
      );
    } finally {
   
    }
  };
  return (
    <div className="flex flex-col  justify-center items-center   ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full   lg:mr-auto  p-3 px-10"
        >
          <Field>
            <FieldLabel>email</FieldLabel>
            <Input
              placeholder="Enter your email"
              {...form.register("email")}
              aria-invalid={form.formState.errors.email ? "true" : "false"}
            />
            {form.formState.errors.email && (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            )}
          </Field>
          {/* password  */}
          <Field>
            <FieldLabel>password</FieldLabel>
            <Input
              placeholder="Enter your password"
              type="password"
              {...form.register("password")}
              aria-invalid={form.formState.errors.password ? "true" : "false"}
            />
            {form.formState.errors.password && (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            )}
          </Field>
        </form>
      </Form>
    </div>
  );
};
export default Login;
