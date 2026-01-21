import React from "react";

export default function ImageUpload({ backgroundImage, imageFile, onFileChange, onInputChange, fileInputRef }) {
  const handlePreviewClick = () => fileInputRef.current.click();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
      <div
        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={handlePreviewClick}
      >
        {backgroundImage ? (
          <img src={backgroundImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">Click to upload image</span>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

      <input
        type="url"
        name="background_image"
        value={imageFile ? "" : backgroundImage}
        onChange={onInputChange}
        className="mt-3 w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Or paste image URL here"
      />
    </div>
  );
}