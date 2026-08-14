import Register from "../../components/Register";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { localStorageUser } from "../../Types";
import { updateProfile, updatePassword } from "../../services/api";

export default function Profile() {
  const [user] = useState<localStorageUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  // SAVE PROFILE 
  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const id = user?.id || 0;
      const email = (formData.get("email") as string) || user?.email || "";
      const userName = (formData.get("userName") as string) || "";

      await updateProfile(id, userName, email);

      const updatedUser: localStorageUser = {
        id: id,
        email: email,
        userName: userName,
        isManager: user?.isManager ?? false,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("update profile Error: " + message);
    }
  };

  // CHANGE PASSWORD 
  const handlePasswordChange = async (formData: FormData) => {
    const id = user?.id || 0;
    const currentPassword = (formData.get("currentPassword") as string) || "";
    const newPassword = (formData.get("newPassword") as string) || "";
    const confirmPassworf = (formData.get("confirmPassword") as string) || "";

    if (confirmPassworf !== newPassword) {
      alert("new password didnt confirm");
      return;
    }
    if (newPassword === currentPassword) {
      alert("new password canot be the same as the old one");
      return;
    }

    try {
      await updatePassword(id, currentPassword, newPassword);

      alert("Password updated!");
      setShowPasswordForm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("update password Error: " + message);
    }
  };

  // PASSWORD FORM
  if (showPasswordForm) {
    return (
      <Box position="relative">
        <Button
          variant="outlined"
          sx={{ position: "absolute", top: 16, left: 16 }}
          onClick={() => navigate("/")}
        >
          Back
        </Button>
        <Register
          title="Change Password"
          submitLabel="Update Password"
          onSubmit={handlePasswordChange}
          fields={[
            {
              name: "currentPassword",
              label: "Current Password",
              type: "password",
            },
            { name: "newPassword", label: "New Password", type: "password" },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
          ]}
          extraButton={
            <Button
              variant="outlined"
              onClick={() => setShowPasswordForm(false)}
              color="warning"
              fullWidth
            >
              Change profile
            </Button>
          }
        />
      </Box>
    );
  }

  // MAIN PROFILE FORM 
  return (
    <Box position="relative">
      <Button
        variant="outlined"
        sx={{ position: "absolute", top: 16, left: 16 }}
        onClick={() => navigate("/")}
      >
        Back
      </Button>
      <Register
        title="Your Profile"
        submitLabel="Save Changes"
        onSubmit={handleUpdateProfile}
        fields={[
          {
            name: "id",
            label: "User ID",
            type: "text",
            defaultValue: user?.id ?? "",
            disabeld: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            defaultValue: user?.email ?? "",
          },
          {
            name: "userName",
            label: "Username",
            type: "text",
            defaultValue: user?.userName ?? "",
          },
        ]}
        extraButton={
          <Button
            variant="outlined"
            color="warning"
            fullWidth
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        }
      />
    </Box>
  );
}
