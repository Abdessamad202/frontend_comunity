import { Mail, Lock } from 'lucide-react'; // Import icons for email and password fields
import { useNavigate } from 'react-router'; // Import Link for navigation and useNavigate for redirecting
import { useContext, useState } from 'react'; // Import hooks for context and state management
import { useMutation } from '@tanstack/react-query'; // Import mutation hook for API calls
import { NotificationContext } from '../contexts/NotificationContext'; // Notification context for showing messages
import { register } from '../apis/apiCalls'; // Register API call
import Input from '../components/Input'
import SubmitBtn from './SubmitBtn'; // Custom submit button component
import LogInLink from './LogInLink';
import { setUser } from '../utils/localStorage'; // Utility to set user data in local storage

const RegisterForm = () => {
    // State and context initialization
    const navigate = useNavigate(); // For navigating to different routes
    const notify = useContext(NotificationContext); // Access notification context to show success/error messages
    const [formData, setFormData] = useState({ email: '', password: '' }); // State to hold form data
    const [errors, setErrors] = useState({}); // State to hold form validation errors
    // React Query mutation for the registration API call
    const { mutate: registerMutation, isPending } = useMutation({
        mutationFn: (formData) => register(formData), // Define the API call function
        onSuccess: (data) => { // On successful registration
            notify("success", data.message); // Show success notification
            setUser(data.user); // Set user data in local storage or context
            setFormData({ email: '', password: '' }); // Reset form data
            setErrors({}); // Clear any existing errors
            navigate('/verify-email'); // Navigate to verification page
        },
        onError: (error) => { // On failed registration
            notify("error", "Registration failed. Try again."); // Show error notification
            setErrors(error.response?.data?.errors || { general: "Registration failed. Try again." }); // Set error messages
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        registerMutation(formData); // Call the mutation function to submit the registration data
    };

    return (
        <>
            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Email Input */}
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

                {/* Password Input */}
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
                {/* Submit Button */}
                <SubmitBtn isPending={isPending} title="Create account" pandingTitle="Creating ..." />
            </form>
            {/* Login Link */}
            <LogInLink />
        </>
    );
};

export default RegisterForm;
