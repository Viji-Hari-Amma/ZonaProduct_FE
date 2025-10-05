import React from "react";

const ProfileCard = ({ profile, onEdit, onEditPicture }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="text-[12px] xs:text-[16px]  bg-white border border-[#FED7AA] rounded-xl shadow-lg shadow-[rgba(220,38,38,0.15)] p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-[rgba(249,115,22,0.25)] hover:bg-gradient-to-br hover:from-white hover:to-[#FFF5F0]">
      <div className="flex items-center mb-6">
        <div className="relative min-w-[64px]">
          <img
            src={
              profile.profile_picture_url ||
              "https://res.cloudinary.com/dpxspxtpz/image/upload/v1753194016/efoe6fcyjcjrocshfzaj.jpg"
            }
            alt="Profile"
            className="profile-picture w-16 h-16 xs:w-24 xs:h-24 rounded-full object-cover border-[3px] border-[#FDBA74]"
          />
          <button
            onClick={onEditPicture}
            className="absolute bottom-0 right-0 bg-[#F97316] text-white p-2 rounded-full shadow-md hover:bg-[#DC2626] transition-colors"
          >
            <i className="fas fa-camera text-sm"></i>
          </button>
        </div>

        <div className="profile-info ml-5">
          <h1 className="profile-name text-2xl font-bold text-[#7C2D12]">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="profile-email text-[#9A3412] text-sm">
            {profile.email}
          </p>
        </div>
      </div>

      <div className="profile-details mt-5 space-y-4">
        <div className="detail-item flex items-center">
          <i className="fas fa-envelope text-[#DC2626] w-6 mr-3"></i>
          <span className="font-semibold text-[#7C2D12] w-[60px] xs:min-w-[130px]">
            Email:
          </span>
          <span>{profile.email}</span>
        </div>

        <div className="detail-item flex items-center">
          <i className="fas fa-phone text-[#DC2626] w-6 mr-3"></i>
          <span className="font-semibold text-[#7C2D12] w-[60px] xs:min-w-[130px]">
            Mobile:
          </span>
          <span>{profile.mobile}</span>
        </div>

        <div className="detail-item flex items-center">
          <i className="fas fa-birthday-cake text-[#DC2626] w-6 mr-3"></i>
          <span className="font-semibold text-[#7C2D12] min-w-[130px]">
            Date of Birth:
          </span>
          <span>{formatDate(profile.date_of_birth)}</span>
        </div>

        <div className="detail-item flex items-center">
          <i className="fas fa-calendar-plus text-[#DC2626] w-6 mr-3"></i>
          <span className="font-semibold text-[#7C2D12] min-w-[130px]">
            Member Since:
          </span>
          <span>{formatDate(profile.created_at)}</span>
        </div>

        <div className="detail-item flex items-center">
          <i className="fas fa-calendar-check text-[#DC2626] w-6 mr-3"></i>
          <span className="font-semibold text-[#7C2D12] min-w-[130px]">
            Last Updated:
          </span>
          <span>{formatDate(profile.updated_at)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onEdit}
          className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white py-2 px-4 rounded-lg shadow-md font-semibold transition-all duration-300 hover:from-[#DC2626] hover:to-[#F97316] hover:scale-105"
        >
          <i className="fas fa-user-edit mr-2"></i> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
