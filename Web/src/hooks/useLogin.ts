import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; // Your Axios API call
import { useAuthStore } from "../store/authStore"; // Your Zustand Store
import { AxiosError } from "axios";

const useLogin = () => {
  // 1. Local State for the Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Access Global Store & Router
  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // 3. The Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call your Node.js Backend
      const data = await loginUser(email, password);

      // Save to Zustand (and LocalStorage via the store logic)
      setAuth(data.token, data.user);

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? "Login failed");
      } else {
        setError("Unexpected error");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Return only what the UI needs
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
