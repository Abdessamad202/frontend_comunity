export const handleInputChange = (e, setFormData, setErrors = null) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));

    if (setErrors) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
            general: "",
        }));
    }
};
export const handleFileChange = (e, setFormData) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0]; // get the first file from the input
        const reader = new FileReader();
        const { name } = e.target; // name of the file (e.g., "document.pdf")
        console.log(e.target);
        
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                [name]: file, 
                "target" : e.target,                // store the actual file under its name
                [`${name}Preview`]: reader.result, // store preview (usually for images)
            }));
        };

        reader.readAsDataURL(file); // this creates a base64 preview for images / files


    }
};
