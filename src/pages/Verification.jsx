import FormHeader from "../components/FormHeader";
import RegisterSteps from "../components/RegisterSteps";
import VerificationForm from "../components/VerificationForm";

export default function Verification() {
  return (
    <div>
      <RegisterSteps />
      <FormHeader title="Verify your email" description="Enter the verification code we sent to your email." />
      <VerificationForm />
    </div>
  );

};
