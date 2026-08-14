
import Register from "../../components/Register";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/api";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userData = {
        email: String(formData.get("email")),
        userName: String(formData.get("username")),
        password: String(password),
      };
      const res = await signUp(userData);
      console.log("signUp API response: " + res);
      navigate("/login");
    }
    
    catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("signUp Error: " + message);
    }
  };


  return (
    <Register
      title="Sign Up"
      submitLabel="Create Account"
      fields={[
        { name: "username", label: "Username" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
        },
      ]}
      onSubmit={handleSubmit}
    />
  );
}
