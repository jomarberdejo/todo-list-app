import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { loginSchema } from "../schemas/auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        fieldErrors[field as "email" | "password"] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    try {
      await login(form.email, form.password);
      navigate("/todos");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>Enter your registered email</FieldDescription>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <FieldSeparator />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldDescription>Your account password</FieldDescription>
          <Input name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <FieldSeparator />
        </Field>

        <Button type="submit" className="w-full mt-2">
          Login
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
