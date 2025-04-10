import { Lock } from 'lucide-react'; // Icon for password input
import { Link, useNavigate } from 'react-router'; // React Router hooks
import { useContext, useState } from 'react'; // React hooks
import { useMutation } from '@tanstack/react-query'; // React Query for data fetching and mutation
import { NotificationContext } from '../contexts/NotificationContext'; // Context for notifications
import { resendVerificationEmailCode, VerificationEmail } from '../apis/apiCalls'; // API calls for verification and resending code
import SubmitBtn from './SubmitBtn'; // Submit button component
import Input from './Input'; // Input component for form fields
const VerificationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ code: '' }); // State to hold the verification code
  const notify = useContext(NotificationContext); // Notification context to show messages
  const [errors, setErrors] = useState({}); // State to hold any validation errors

  // Mutation for verifying the code
  const { mutate: verifyCode, isPending: isVerifying } = useMutation({
    mutationFn: (data) => VerificationEmail(data), // Dynamic data for user ID and form data
    onSuccess: (data) => {
      notify('success', data.message); // Notify on successful verification
      navigate('/complete-profile'); // Redirect to verification code page
      setErrors({});
    },
    onError: (error) => {
      const responseData = error.response?.data; // Get response data

      notify("error", responseData?.message);
      if (error.response?.status === 409) {
        // setUser(responseData?.user);

        if (responseData?.registration_status === "verified") {
          navigate("/complete-profile"); // Redirect to email verification page
        } else {
          navigate("/home"); // Redirect to email verification page
        }
      }
      setErrors(responseData?.errors || { general: error.response.data?.message });
    },
  })

  // Mutation for resending the verification code
  const { mutate: resendingCode, isPending: isReSending } = useMutation({
    mutationFn: () => resendVerificationEmailCode(),
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
      setErrors(error.response?.data?.errors || { general: error.response.data?.message }); // Set error messages
    },
  });

  // Handle form submission for code verification
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(formData); // Pass dynamic user ID and form data
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
          placeholder="Enter verification code"
          value={formData.code}
          setErrors={setErrors} // Function to set errors
          setFormData={setFormData} // Function to update form data
          error={errors.code} // Display error if present
          icon={Lock} // Icon for the input field
          required // Make the field required
        />

        {/* Submit Button */}
        <SubmitBtn isPending={isVerifying} title="Verify Code" pandingTitle="Verifying..." />
      </form>

      {/* Resend Code Link */}
      <div className="mt-6 text-center text-sm text-gray-600">
        {"Didn't"} receive the code?{' '}
        <Link
          to=""
          onClick={resendCode} // Trigger resend action
          className="text-indigo-600 hover:text-indigo-500 font-medium"
          disabled={isReSending} // Disable the link when resending
        >
          {isReSending ? 'Resending...' : 'Resend Code'} {/* Change text while resending */}
        </Link>
      </div>
    </>
  );
};

export default VerificationForm;
