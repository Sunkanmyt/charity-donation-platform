import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser} = useAuth();
  const fileInputRef = useRef(null);

  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImageUrl: "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI Feedback States
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await api.get("/users/profile");
        const u = res.data?.user || res.user || res.data;
        if (u) {
          setFormData({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            phone: u.phone || "",
            profileImageUrl: u.profileImageUrl || "",
          });
          return;
        }
      } catch {
        // Fallback to AuthContext if network fetch fails
      }

      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImageUrl: user.profileImageUrl || "",
        });
      }
    };

    loadUserData();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("phone", formData.phone);

      if (selectedFile) {
        payload.append("profileImage", selectedFile);
      }

      const res = await api.put("/users/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data?.user || res.user || res.data;

      if (updatedUser) {
        setFormData((prev) => ({
          ...prev,
          firstName: updatedUser.firstName || prev.firstName,
          lastName: updatedUser.lastName || prev.lastName,
          phone: updatedUser.phone || prev.phone,
          profileImageUrl: updatedUser.profileImageUrl || prev.profileImageUrl,
        }));

        // Update global AuthContext state so Navbar updates instantly
        setUser((prev) => ({
          ...prev,
          ...updatedUser
        }));
      }

      setProfileMessage({
        type: "success",
        text: res.data?.message || res.message || "Profile updated successfully!",
      });

      setImagePreview(null);
      setSelectedFile(null);
    } catch (err) {
      setProfileMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 8 characters long",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put("/users/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordMessage({
        type: "success",
        text: res.data?.message || res.message || "Password changed successfully!",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "0.95rem",
    background: "var(--surface)",
    color: "var(--text-main)",
    outline: "none",
    boxSizing: "border-box",
    marginTop: "0.35rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "var(--text-muted)",
  };

  return (
    <div className="container" style={{ maxWidth: "960px", margin: "2rem auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
          Account Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Manage your personal profile details, avatar, and security credentials.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}
      >
        {/* Personal Details Card */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            Personal Information
          </h2>

          {profileMessage.text && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                marginBottom: "1.25rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                background: profileMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                color: profileMessage.type === "success" ? "#15803d" : "#b91c1c",
                border: `1px solid ${profileMessage.type === "success" ? "#86efac" : "#fca5a5"}`,
              }}
            >
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Avatar Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBottom: "0.5rem" }}>
              <img
                src={
                  imagePreview ||
                  formData.profileImageUrl || 
                  "/default-avatar.png"
                }
                alt="Profile Avatar"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--border)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="btn btn-outline"
                  style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                >
                  Upload New Photo
                </button>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                  JPG, PNG, or WEBP (Max 5MB)
                </p>
              </div>
            </div>

            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address (Read-Only)</label>
              <input
                type="email"
                value={formData.email}
                disabled
                style={{
                  ...inputStyle,
                  background: "#f1f5f9",
                  color: "var(--text-muted)",
                  cursor: "not-allowed",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234..."
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.8rem",
                marginTop: "0.5rem",
                opacity: profileLoading ? 0.7 : 1,
              }}
            >
              {profileLoading ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </form>
        </div>

        {/* Password & Security Card */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            Security & Password
          </h2>

          {passwordMessage.text && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                marginBottom: "1.25rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                background: passwordMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                color: passwordMessage.type === "success" ? "#15803d" : "#b91c1c",
                border: `1px solid ${passwordMessage.type === "success" ? "#86efac" : "#fca5a5"}`,
              }}
            >
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
                placeholder="At least 6 characters"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn btn-outline"
              style={{
                width: "100%",
                padding: "0.8rem",
                marginTop: "0.5rem",
                borderColor: "var(--text-main)",
                opacity: passwordLoading ? 0.7 : 1,
              }}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}