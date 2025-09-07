"use client"
import { Spinner } from "@/components/ui/components/spinner";
import { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";

const ProfileSections = ({ profileDetails }) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [imageLink, setImage] = useState(profileDetails?.img_url);
  useEffect(()=>{
    
  },[imageLink])
  const handleuploadImage = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = JSON.parse(localStorage.getItem("token"));
      console.log(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/profile-picture`, {
        method: "PUT",
        headers: {
          'Authorization': 'Bearer ' + token.access_token,
          "ngrok-skip-browser-warning": "69420"
        },
        body: formData,
      });
      const data = await response.json();
      if (data.img_url) {
        setImage(data.img_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center bg-gray-100 pt-2 rounded-lg">
      <div className="rounded-full">
        {imageLink ? (
          <img
            src={process.env.NEXT_PUBLIC_ENDPOINT +'/'+ imageLink}
            alt="Profile"
            className="rounded-full h-24 md:h-60 md:w-60 w-24 "
          />
        ) : (
          <div className="rounded-full  h-24 md:h-32 md:w-32 w-24 flex items-center justify-center bg-[#7BA1A4] text-white text-3xl font-bold">
            {profileDetails?.name[0]}
          </div>
        )}
      </div>
      <div className="my-2">
        <label
          htmlFor="file"
          className="bg-primary text-[#fff] rounded-xl py-2 px-2 xl:px-3 text-xs flex  items-center"
        >
          {imageUploading ? (
            <div className="w-20 h-4">
              <Spinner></Spinner>
            </div>
          ) : (
            <>
              <IoCamera className="mr-2"/>
              Change
            </>
          )}
          <input
            type="file"
            id="file"
            accept="image/*"
            style={{ opacity: 0, width: 0, height: 0 }}
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                handleuploadImage(file);
              }
            }}
          />
        </label>
      </div>
      <div className="text-2xl font-bold">
        {profileDetails?.name}
      </div>
      <div className="text-sm text-gray-500">
        {profileDetails?.role}
      </div>
    </div>
  );
};

export default ProfileSections;
