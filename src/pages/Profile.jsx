import FormHeader from "../components/FormHeader";
import ProfileCompletionForm from "../components/ProfileCompletionForm";
import RegisterSteps from "../components/RegisterSteps";

export default function Profile() {
  return (
    <div>
      <RegisterSteps />
      <FormHeader title={"Complete Your Profile"} description={"finish this part to beggin your journy ."}/>
      <ProfileCompletionForm />
    </div>
  );

};
