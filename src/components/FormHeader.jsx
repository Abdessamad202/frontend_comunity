const FormHeader = ({ title, description,children }) => {
  return (
    <div className="text-center mb-8">
      {/* Display the title and description passed as props */}
      {children}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default FormHeader;
