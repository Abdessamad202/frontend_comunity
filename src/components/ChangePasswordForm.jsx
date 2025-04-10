import { Lock } from "lucide-react";
import { useContext, useState } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query"; // ✅ Import useMutation
import { resetPassword } from "../apis/apiCalls";
import SubmitBtn from "./SubmitBtn";
import Input from "./Input"; // ✅ Import Input component
import { getEmail } from "../utils/localStorage"; // ✅ Import utility to get email from local storage
import { setUser } from "../utils/localStorage"; // ✅ Import utility to set user in local storage
const ChangePasswordForm = () => {
  // ✅ Access notification context for displaying messages
  const notify = useContext(NotificationContext);

  // ✅ Hook for navigation
  const navigate = useNavigate();

  // ✅ Form state for user input
  const [errors, setErrors] = useState({});

  // ✅ Access user context to update user state after password change
  const email = getEmail(); // Assuming you have a function to get the email from local storage or context
  const [formData, setFormData] = useState({ email, password: "", password_confirmation: "" });

  // ✅ Handle password change mutation using React Query
  const { mutate: ChangePasswordMutation, isPending: isVerifying } = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: (data) => {
      notify("success", data.message);
      setUser(data.user); // ✅ Update user state
      navigate("/home"); // ✅ Redirect user after successful password change
    },
    onError: (error) => {
      notify("error", "Password change failed. Try again.");
      setErrors(error.response?.data?.errors || { general: "Password change failed. Try again." });
    },
  });

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Call API mutation
    ChangePasswordMutation(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* New Password Input Field */}
      <Input
        name="password"
        type="password"
        placeholder="New Password"
        value={formData.password}
        setFormData={setFormData}
        setErrors={setErrors}
        error={errors.password}
        icon={Lock}
        required
      />
      {/* ✅ Show password error */}


      {/* Confirm Password Input Field */}
      <Input
        name="password_confirmation"
        type="password"
        placeholder="Confirm Password"
        value={formData.password_confirmation}
        setFormData={setFormData}
        setErrors={setErrors}
        error={errors.password_confirmation}
        icon={Lock}
        required
      />

      {/* General Error Message */}
      {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>} {/* ✅ Show general error */}

      {/* Submit Button */}
      <SubmitBtn title="Change Password" pandingTitle="Changing..." isPending={isVerifying} />
    </form>
  );
};

export default ChangePasswordForm;
