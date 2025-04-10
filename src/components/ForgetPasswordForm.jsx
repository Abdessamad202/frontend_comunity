import { Mail } from "lucide-react";
import { useContext, useState } from "react";
import SubmitBtn from "./SubmitBtn";
import { NotificationContext } from "../contexts/NotificationContext";
import { useNavigate } from "react-router";
import { sendResetPasswordCode } from "../apis/apiCalls";
import { useMutation } from "@tanstack/react-query";
import LogInLink from "./LogInLink";
import Input from "./Input"
import { setUser } from "../utils/localStorage"; // Utility to set user data in local storage
const ForgotPasswordForm = () => {
  // ✅ Access notification context for displaying messages
  const notify = useContext(NotificationContext);

  // ✅ Hook for navigation
  const navigate = useNavigate();

  // ✅ Form state for user input
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // ✅ Handle login mutation using React Query
  const { mutate: verificationMutation, isPending: isVerifying } = useMutation({
    mutationFn: (formData) => sendResetPasswordCode(formData),
    onSuccess: (data) => {
      notify("success", data.message);
      setUser(data.user); // Assuming you have a function to set the user in local storage or context
      setFormData({ email: "", password: "" }); // Reset form data
      setErrors({}); // Clear any existing errors
      navigate("/validate-code"); // Redirect user based on success status
    },
    onError: (error) => {
      notify("error", "Login failed. Try again.");
      setErrors(error.response?.data?.errors || { general: "Login failed. Try again." });
    },
  });

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    verificationMutation(formData);
  };
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Input Field */}
      <Input
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        setFormData={setFormData}
        setErrors={setErrors}
        error={errors.email}
        icon={Mail}
        required
      />

      {/* Submit Button */}
      <SubmitBtn isPending={isVerifying} title="Send Reset Link" pandingTitle="Sending..." />
      <LogInLink />
    </form>
  );
};

export default ForgotPasswordForm;
