import React, { useState, useEffect } from "react";

const ProfilePictureModal = ({ onSubmit, onClose, profile, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.profile_picture_url || null);

  useEffect(() => {
    if (profile?.profile_picture_url) {
      setPreviewUrl(profile.profile_picture_url);
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7C2D12]">Update Profile Picture</h2>
            <button onClick={onClose} className="text-[#F97316] hover:text-[#DC2626]">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FDBA74] mb-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#FFEDE9] flex items-center justify-center">
                    <i className="fas fa-user text-4xl text-[#F97316]"></i>
                  </div>
                )}
              </div>

              <label className="cursor-pointer bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-[#DC2626] hover:to-[#F97316] inline-flex items-center">
                <i className="fas fa-upload mr-2"></i>
                Choose Image
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#F97316] font-medium border border-[#FDBA74] rounded-lg hover:bg-[#FFEDE9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || loading}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white font-medium rounded-lg shadow-md hover:from-[#DC2626] hover:to-[#F97316] disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner animate-spin"></i> : "Update Picture"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
