import { User, Calendar } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { NotificationContext } from '../contexts/NotificationContext';
import { completeProfile } from '../apis/apiCalls';
import { handleInputChange } from '../utils/formHelpers'; // Utility function to handle input changes
import SubmitBtn from './SubmitBtn';
import Input from './Input'; // Input component for form fields
import { setUser } from './../utils/localStorage';
const ProfileCompletionForm = () => {
  const notify = useContext(NotificationContext);
  // Navigation
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
  });

  // Errors state
  const [errors, setErrors] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
  });

  // Mutation for profile completion
  const { mutate: completeProfileMutation, isPending: isSubmitting } = useMutation({
    mutationFn: (formData) => completeProfile(formData),
    onSuccess: (data) => {
      notify("success", data.message);
      setUser(data.user); // Update user data in local storage
      navigate('/home');
    },
    onError: (error) => {
      const status = error.response?.status;
      const serverErrors = error.response?.data?.errors || { general: "Profile completion failed. Try again." };

      if (status === 409) { // Profile already completed
        notify("info", "Your profile is already completed.");
        navigate('/home');
      } else if (status === 403) {
        notify("info", "Your email verification is pending. Please verify your email to continue.");
        navigate('/verify-email'); // Redirect to verification page
      } else {
        notify("error", "Profile completion failed. Try again.");
        setErrors(serverErrors);
      }

    },
  });


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    completeProfileMutation(formData); // Call the mutation with form data
    console.log(formData);

    // setErrors({}); // Clear previous errors
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name Field */}
      <Input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Enter your name"
        setErrors={setErrors}
        setFormData={setFormData}
        required={true}
        icon={User}
        error={errors.name}
      />

      {/* Date of Birth Field */}
      <Input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        placeholder="Select your date of birth"
        setErrors={setErrors}
        setFormData={setFormData}
        required={true}
        icon={Calendar}
        error={errors.date_of_birth}
        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
      />

      {/* Gender Selection - Radio Buttons */}
      <div>
        <div className="text-gray-700 font-medium mb-2">Select your gender:</div>
        <div className="flex gap-4 justify-center">
          {/* Male Option */}
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${formData.gender === 'M' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
            <input type="radio" name="gender" value="M" className="hidden" onChange={(e) => handleInputChange(e, setFormData, setErrors)} />
            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${formData.gender === 'M' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {formData.gender === 'M' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className="text-gray-700 font-medium">Male</span>
          </label>
          {/* Female Option */}
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${formData.gender === 'F' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
            <input type="radio" name="gender" value="F" className="hidden" onChange={(e) => handleInputChange(e, setFormData, setErrors)} />
            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${formData.gender === 'F' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {formData.gender === 'F' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className="text-gray-700 font-medium">Female</span>
          </label>
        </div>
        {errors.gender && <div className="text-red-500 text-xs text-center mt-1">{errors.gender}</div>}
      </div>

      {/* Submit Button */}
      <SubmitBtn isPending={isSubmitting} title="Submit" pandingTitle="Submitting ..." />
    </form>
  );
};

export default ProfileCompletionForm;
