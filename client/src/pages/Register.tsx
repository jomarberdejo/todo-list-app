"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../api/axios";
import { registerSchema } from "../schemas/auth";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await API.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/todos");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldDescription>Enter your full name</FieldDescription>
          <Input placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>Enter your email</FieldDescription>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldDescription>Create a secure password</FieldDescription>
          <Input type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <FieldDescription>Re-enter your password</FieldDescription>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
          <FieldSeparator />
        </Field>

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
