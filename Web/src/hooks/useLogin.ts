import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; // Your Axios API call
import { useAuthStore } from "../store/authStore"; // Your Zustand Store
import { AxiosError } from "axios";

const useLogin = () => {
  // 1️⃣ Local State for the Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2️⃣ Access Global Store & Router
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  // 3️⃣ Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call backend login API
      const data = await loginUser(email, password);

      setAuth(data.accessToken, data.user);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // AxiosError: backend message or fallback
        setError(err.response?.data?.error ?? "Login failed");
      } else {
        setError("Unexpected error");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
};

export default useLogin;
