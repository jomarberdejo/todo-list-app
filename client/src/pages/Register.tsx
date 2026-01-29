import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldSeparator } from "@/components/ui/field";
import API from "../api/axios";
import { registerSchema } from "../schemas/auth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<typeof form> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field in form) fieldErrors[field as keyof typeof form] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/todos");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldDescription>Enter your full name</FieldDescription>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>Enter your email</FieldDescription>
          <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldDescription>Create a secure password</FieldDescription>
          <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <FieldDescription>Re-enter your password</FieldDescription>
          <Input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          <FieldSeparator />
        </Field>

        <Button type="submit" className="w-full mt-2">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
