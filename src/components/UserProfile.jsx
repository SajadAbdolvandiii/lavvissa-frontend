import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import UserOrders from "./UserOrders";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: currentUser?.displayName || "",
  });
  const [originalForm, setOriginalForm] = useState({
    displayName: currentUser?.displayName || "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  // Update form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const displayName = currentUser.displayName || "";
      setProfileForm({ displayName });
      setOriginalForm({ displayName });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setProfileForm(originalForm);
    setIsEditing(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate form
    if (!profileForm.displayName.trim()) {
      showError("نام نمایشی نمی‌تواند خالی باشد");
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile({
        displayName: profileForm.displayName,
      });
      setOriginalForm({ ...profileForm });
      setIsEditing(false);
      showSuccess("پروفایل با موفقیت به‌روزرسانی شد.");
    } catch (error) {
      console.error("Profile update error:", error);
      showError(
        error.message || "خطا در به‌روزرسانی پروفایل. لطفا دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      showSuccess("با موفقیت از حساب کاربری خارج شدید.");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showError("خطا در خروج از حساب کاربری");
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <Link to="/" className="back-to-home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            بازگشت به صفحه اصلی
          </Link>
          <h2>حساب کاربری</h2>
        </div>

        <div className="user-info">
          {currentUser.photoURL ? (
            <div className="profile-image">
              <img src={currentUser.photoURL} alt="تصویر پروفایل" />
            </div>
          ) : (
            <div className="profile-image profile-image-placeholder">
              {profileForm.displayName
                ? profileForm.displayName.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}

          <div className="user-details">
            <h3>{originalForm.displayName || "کاربر"}</h3>
            <div className="email-info">{currentUser.email}</div>
            <div className="account-since">
              عضویت از{" "}
              {new Date(currentUser.metadata.creationTime).toLocaleDateString(
                "fa-IR"
              )}
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            پروفایل
          </button>
          <button
            className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
              <path d="M16.5 9.4L7.55 4.24"></path>
              <path d="M3.29 7L12 12l8.71-5"></path>
              <path d="M12 22V12"></path>
              <circle cx="18.5" cy="15.5" r="2.5"></circle>
              <path d="M20.27 17.27L22 19"></path>
            </svg>
            سفارش‌های من
          </button>
          <button
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            تنظیمات
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-form-container">
              <div className="section-header">
                <h3>اطلاعات شخصی</h3>
                {!isEditing && (
                  <button onClick={startEditing} className="edit-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    ویرایش
                  </button>
                )}
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="displayName">نام نمایشی</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profileForm.displayName}
                    onChange={handleChange}
                    disabled={loading || !isEditing}
                    placeholder="نام نمایشی خود را وارد کنید"
                    className={!isEditing ? "disabled" : ""}
                  />
                </div>

                {isEditing && (
                  <div className="profile-buttons">
                    <button
                      type="submit"
                      className="update-button"
                      disabled={loading}
                    >
                      {loading ? "در حال پردازش..." : "ذخیره تغییرات"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="cancel-button"
                      disabled={loading}
                    >
                      انصراف
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "orders" && <UserOrders />}

          {activeTab === "settings" && (
            <div className="account-actions">
              <div className="section-header">
                <h3>تنظیمات حساب کاربری</h3>
              </div>
              <div className="action-buttons">
                <button
                  onClick={handleLogout}
                  className="logout-button"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  {loading ? "در حال پردازش..." : "خروج از حساب کاربری"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
