import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
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
          <h2>پروفایل کاربری</h2>
        </div>

        <div className="profile-content">
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
