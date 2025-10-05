import React, { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  updateProfilePicture,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../services/profileApi/profileApi";
import ProfilePictureModal from "./ProfilePictureModal/ProfilePictureModal";
import AddressFormModal from "./Forms/AddressFormModal";
import EditProfileModal from "./Forms/EditProfileModal";
import AddressSection from "./Address/AddressSection";
import ProfileCard from "./ProfileCard/ProfileCard";
import DeleteConfirmationModal from "./Forms/DeleteConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserReview } from "./Reviews/UserReview";
import useAuth from "../../hooks/useAuth";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { updateProfilePic } = useAuth(); // Get update function from context

  // Fetch profile and addresses
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileResponse, addressesResponse] = await Promise.all([
        getProfile(),
        listAddresses(),
      ]);
      setProfile(profileResponse.data);
      setAddresses(addressesResponse.data);
    } catch (err) {
      toast.error("Error loading profile data!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [profileResponse, addressesResponse] = await Promise.all([
        getProfile(),
        listAddresses(),
      ]);
      setProfile(profileResponse.data);
      setAddresses(addressesResponse.data);
    } catch (err) {
      toast.error("Error refreshing profile data!");
      console.error(err);
    }
  };

  // Profile update
  const handleProfileUpdate = async (data) => {
    try {
      setActionLoading(true);
      await updateProfile(data);
      toast.success("Profile updated successfully!");
      await refreshData();
      setActiveModal(null);
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Profile picture update - UPDATED
  const handleProfilePictureUpdate = async (file) => {
    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append("profile_picture", file);
      await updateProfilePicture(formData);
      toast.success("Profile picture updated!");

      // Update the context and localStorage
      const profileResponse = await getProfile();
      const updatedPic = profileResponse.data.profile_picture_url || null;
      updateProfilePic(updatedPic); // This will update the navbar instantly

      await refreshData();
      setActiveModal(null);
    } catch (err) {
      toast.error("Failed to update picture");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Address create/update
  const handleAddressSubmit = async (data) => {
    try {
      setActionLoading(true);
      if (selectedAddress?.id) {
        await updateAddress(selectedAddress.id, data);
        toast.success("Address updated!");
      } else {
        await createAddress(data);
        toast.success("Address added!");
      }
      await refreshData();
      setActiveModal(null);
      setSelectedAddress(null);
    } catch (err) {
      toast.error("Failed to save address");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Address delete
  const handleAddressDelete = async () => {
    try {
      setActionLoading(true);
      await deleteAddress(selectedAddress.id);
      toast.success("Address deleted!");
      await refreshData();
      setActiveModal(null);
      setSelectedAddress(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete address";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Modal handlers
  const openProfileEditModal = () => setActiveModal("profileEdit");
  const openProfilePictureModal = () => setActiveModal("profilePicture");
  const openAddAddressModal = () => {
    setSelectedAddress(null);
    setActiveModal("addressForm");
  };
  const openEditAddressModal = (address) => {
    setSelectedAddress(address);
    setActiveModal("addressForm");
  };
  const openDeleteAddressModal = (address) => {
    setSelectedAddress(address);
    setActiveModal("deleteConfirm");
  };
  const closeModal = () => {
    setActiveModal(null);
    setSelectedAddress(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-[#1E293B] pt-[13vh]">
      <div className=" mx-auto max-w-7xl px-4 py-8">
        <div className="profile-section flex flex-col lg:flex-row gap-8 mt-10">
          {profile && (
            <>
              <ProfileCard
                profile={profile}
                onEdit={openProfileEditModal}
                onEditPicture={openProfilePictureModal}
              />
              <AddressSection
                addresses={addresses}
                onAddAddress={openAddAddressModal}
                onEditAddress={openEditAddressModal}
                onDeleteAddress={openDeleteAddressModal}
              />
            </>
          )}
        </div>
      </div>
      {/* Modals */}
      {activeModal === "profileEdit" && (
        <EditProfileModal
          profile={profile}
          onSubmit={handleProfileUpdate}
          onClose={closeModal}
          loading={actionLoading}
        />
      )}
      {activeModal === "profilePicture" && (
        <ProfilePictureModal
          profile={profile}
          onSubmit={handleProfilePictureUpdate}
          onClose={closeModal}
          loading={actionLoading}
        />
      )}
      {activeModal === "addressForm" && (
        <AddressFormModal
          address={selectedAddress}
          onSubmit={handleAddressSubmit}
          onClose={closeModal}
          loading={actionLoading}
        />
      )}
      {activeModal === "deleteConfirm" && (
        <DeleteConfirmationModal
          onConfirm={handleAddressDelete}
          onCancel={closeModal}
          loading={actionLoading}
        />
      )}
      {profile && <UserReview userId={profile.email} />}
    </div>
  );
};

export default Profile;
