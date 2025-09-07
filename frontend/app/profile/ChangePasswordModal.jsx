import { Spinner } from "@/components/ui/components/spinner";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
// import { handleChangePassword } from "./handleChangePassword";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    oldPasswordError: "",
    newPasswordErrors: [],
    confirmPasswordError: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {
      oldPasswordError: "",
      newPasswordErrors: [],
      confirmPasswordError: "",
    };

    if (!formData.oldPassword) {
      errors.oldPasswordError = "Please enter your current password.";
    }

    if (!formData.newPassword) {
      errors.newPasswordErrors.push("Please enter a new password.");
    } else if (formData.newPassword?.length < 8) {
      errors.newPasswordErrors.push(
        "The password field must be at least 8 characters."
      );
    }

    if (!formData.confirmPassword) {
      errors.confirmPasswordError = "Please enter a confirm password.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPasswordError =
        "The password field confirmation does not match.";
    }

    if (
      errors.oldPasswordError ||
      errors.newPasswordErrors?.length > 0 ||
      errors.confirmPasswordError
    ) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({
      oldPasswordError: "",
      newPasswordErrors: [],
      confirmPasswordError: "",
    });

    setIsLoading(true); // Set loading to true before API call
    const res = await handleChangePassword(formData, setFormErrors);
    setIsLoading(false); // Set loading to false after API call
    if (res) {
      toast.success("Password changed successfully");
      onClose();
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md lg:px-10 px-4 md:px-6 py-6 relative">
        <div className="w-full  flex justify-between mb-2">
          <div className=" text-xl font-bold text-black-700 ">
            Change password
          </div>
          <button onClick={onClose} className=" text-xl ">
            <IoIosCloseCircle></IoIosCloseCircle>
          </button>
        </div>
        <hr />
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="mb-3">
            <label htmlFor="oldPassword">{"Enter your old Password"}</label>
            <div className="relative">
              <input
                type={showPassword.oldPassword ? "text" : "password"}
                id="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('oldPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.oldPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.oldPasswordError && (
              <p className="text-red-500 mt-1">{formErrors.oldPasswordError}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword">{"Enter your new Password"}</label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.newPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.newPasswordErrors?.length > 0 && (
              <ul className=" text-red-500 mt-1 space-y-2">
                {formErrors?.newPasswordErrors?.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword">
              {"Retype your new Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.confirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.confirmPasswordError && (
              <p className="text-red-500 mt-1">
                {formErrors.confirmPasswordError}
              </p>
            )}
          </div>
          <div className="flex justify-center mb-2">
            <button
              type="submit"
              className="w-full max-w-[300px] rounded-lg py-2 bg-primary text-[#fff] my-4 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
