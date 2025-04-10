import { Lock } from 'lucide-react'; // Icon for password input
import { Link, useNavigate } from 'react-router'; // React Router hooks
import { useContext, useState } from 'react'; // React hooks
import { useMutation } from '@tanstack/react-query'; // React Query for data fetching and mutation
import { NotificationContext } from '../contexts/NotificationContext'; // Context for notifications
import { sendResetPasswordCode, validateResetCode } from '../apis/apiCalls'; // API calls for verification and resending code
import { getEmail } from '../utils/localStorage'; // Utility to get email from local storage
import SubmitBtn from './SubmitBtn'; // Submit button component
import Input from './Input'; // Input component for form fields
// import useUser from '../hooks/useUser'; // Custom hook to get user data
const ValidateCodeForm = () => {
  const navigate = useNavigate();
  const notify = useContext(NotificationContext); // Notification context to show messages
  const email = getEmail()// Get email from local storage
  const [formData, setFormData] = useState({ code: '' }); // State to hold the verification code
  const [errors, setErrors] = useState({}); // State to hold any validation errors

  // Mutation for verifying the code
  const { mutate: validateCode, isPending: isVerifying } = useMutation({
    mutationFn: (data) => validateResetCode(data), // Dynamic data for user ID and form data
    onSuccess: (data) => {
      notify('success', data.message); // Notify on successful verification
      navigate('/change-password'); // Redirect to verification code page
      setErrors({});
    },
    onError: (error) => {
      const responseData = error.response?.data; // Get response data

      notify("info", responseData?.message);

      setErrors({ code: responseData?.message } || { general: "verification failed. Try again." });
    },
  })
  // Mutation for resending the verification code
  const { mutate: resendingCode, isPending: isReSending } = useMutation({
    mutationFn: () => sendResetPasswordCode({ email }),
    onSuccess: (data) => {
      notify('success', data.message); // Notify on successful resend
      setErrors({});
    },
    onError: (error) => {
      const status = error.response?.status
      if (status === 409) {
        if (error.response.data?.registration_status === "verified") {
          navigate('/complete-profile')
        } else {
          navigate('/home')
        }
      }
      notify('info', error.response.data?.message); // Notify on resend failure
      setErrors(error.response?.data?.errors || { general: 'Failed to resend code. Try again.' }); // Set error messages
    },
  });

  // Handle form submission for code verification
  const handleSubmit = (e) => {
    e.preventDefault();
    validateCode(formData); // Pass dynamic user ID and form data
  };

  // Handle code resend request
  const resendCode = (e) => {
    e.preventDefault();
    resendingCode(); // Trigger resend code mutation
  };

  return (
    <>
      {/* Verification Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Code Input Field */}
        <Input
          type="text"
          name="code"
          placeholder="Enter your verification code"
          value={formData.code}
          setErrors={setErrors} // Function to set errors
          setFormData={setFormData} // Function to set form data
          error={errors.code} // Display error if exists
          icon={Lock} // Icon for the input field
          required
        />

        {/* Submit Button */}
        <SubmitBtn isPending={isVerifying} title="Verify Code" pandingTitle="Verifying..." />
      </form>

      {/* Resend Code Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        {"Didn't"} receive the code?{' '}
        <Link
          to=""
          onClick={resendCode} // Trigger resend action
          className="text-indigo-600 hover:text-indigo-500 font-medium"
          disabled={isReSending} // Disable the link when resending
        >
          {isReSending ? 'Resending...' : 'Resend Code'} {/* Change text while resending */}
        </Link>
      </p>
    </>
  );
};

export default ValidateCodeForm;
