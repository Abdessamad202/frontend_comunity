import {getStepColor} from '../utils/getStepColor'
const RegisterSteps = () => {
  return (
    <div className="text-center mb-8">
      {/* Step navigation container */}
      <div className="flex justify-around items-center steps">
        {/* Step 1 - Register */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(1)}`}
          >
            <span>1</span>
          </div>
          {/* Step description */}
          <div className="text-xs text-gray-600">Register</div>
        </div>

        {/* Step 2 - Verify Email */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(2)}`}
          >
            <span>2</span>
          </div>
          {/* Step description */}
          <div className="text-xs text-gray-600">Verify Email</div>
        </div>

        {/* Step 3 - Complete Profile */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(3)}`}
          >
            <span>3</span>
          </div>
          {/* Step description */}
          <div className="text-xs text-gray-600">Complete Profile</div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSteps;
