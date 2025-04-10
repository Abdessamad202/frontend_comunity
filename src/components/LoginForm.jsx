import { useMutation } from "@tanstack/react-query";
import { Mail, Lock } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { logIn } from "../apis/apiCalls";
import { NotificationContext } from "../contexts/NotificationContext";
import Input from "./Input";
import SubmitBtn from "./SubmitBtn";

const LoginForm = () => {
    const notify = useContext(NotificationContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const { mutate: logInMutation, isPending: isLoggingIn } = useMutation({
        mutationFn: (formData) => logIn(formData),
        onSuccess: (data) => {
            notify("success", data.message);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        },
        onError: (error) => {
            const responseData = error.response?.data;

            if (error.response?.status === 403) {
                notify("error", responseData?.message);
                setUser(responseData?.user);

                if (responseData?.registration_status === "pending") {
                    navigate("/verify-email");
                } else {
                    navigate("/complete-profile");
                }
            } else {
                notify("error", "Login failed. Try again.");
            }
            setErrors(responseData?.errors);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        logInMutation(formData);
    };

    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit}>
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

                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    error={errors.password}
                    icon={Lock}
                    required
                />
                <SubmitBtn isPending={isLoggingIn} title="Sign in" pandingTitle="Signing in ..." />
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                {"Don't"} have an account?{" "}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Create one
                </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
                {"Forgot"} your password?{" "}
                <Link to="/check-email" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Reset
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
