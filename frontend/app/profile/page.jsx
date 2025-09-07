"use client"
import { useEffect, useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import ProfileSections from './ProfileSections';
// import useFetch from '@/ApiHandle/useFetch';
import api from '@/axiosInstance';

const EditButton = ({ onClick }) => {
    return (
        <button className='px-3 flex items-center rounded-lg bg-primary text-[#fff] text-sm' onClick={onClick}>Edit</button>
    );
};

const ProfileCard = () => {
    const [profileInfo, setProfileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch student profile data
    useEffect(() => {
        const fetchStudentProfile = async () => {
            setLoading(true);
            try {
                const response = await api.get('/user/student-profile');
                
                if (response?.data) {
                    setProfileInfo({
                        ...response.data.user,
                        ...response.data.profile
                    });
                    console.log('Fetched student profile:', response.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching student profile:', err);
                setError(err.message);
                // Set mock data for testing if needed
                setProfileInfo({
                    id: 5,
                    email: "student@example.com",
                    name: "Student Name",
                    bio: "Student bio",
                    img_url: null,
                    phone: "123-456-7890",
                    place: "City, Country",
                    role: "student",
                    university: "University Name",
                    graduation_year: "2025",
                    major: "Computer Science",
                    total_points: 250,
                    resume_url: null
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchStudentProfile();
    }, []);
    
    const [basicFormData, setBasicFormData] = useState({
        name: "",
        phone: "",
        place: "",
        email: "",
        img_url: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveClick = async (section) => {
        if (section) {
            try {
                const response = await api.put('/user/student-profile', {
                    name: basicFormData.name,
                    phone: basicFormData.phone,
                    place: basicFormData.place
                });
                
                if (response?.data) {
                    setProfileInfo(prev => ({
                        ...prev,
                        name: basicFormData.name,
                        phone: basicFormData.phone,
                        place: basicFormData.place
                    }));
                    console.log('Profile updated successfully');
                }
            } catch (err) {
                console.error('Error updating profile:', err);
                // Handle error appropriately
            }
        }
        setEditMode(false);
    };

    useEffect(() => {
        if(profileInfo) {
            setBasicFormData({
                name: profileInfo.name || "",
                phone: profileInfo.phone || "",
                place: profileInfo.place || "",
                email: profileInfo.email || "",
                img_url: profileInfo.img_url || ""
            });
        }
    }, [profileInfo]);

    return (
        <div className="grid gap-4 p-4 lg:grid-cols-3 mx-5 md:mx-40 my-10">
            {profileInfo && <ProfileSections profileDetails={{ name: profileInfo?.name, role: profileInfo?.role, img_url: profileInfo?.img_url }} />}
            <div className="bg-gray-100 lg:p-4 px-2 py-4 rounded-lg lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-8 py-2">
                    <div className='flex justify-between'>
                        <div className="contact-item text-lg font-bold">About</div>
                        {editMode ? (
                            <>
                                <div className='flex'>
                                    <button className='px-3 flex items-center rounded-lg bg-red text-white text-sm' onClick={() => setEditMode(false)}>Cancel</button>
                                    <button className='ml-2 px-3 flex items-center rounded-lg bg-primary text-[#fff] text-sm' onClick={() => handleSaveClick('about')}>Save</button>
                                </div>
                            </>
                        ) : (
                            <EditButton onClick={() => setEditMode(!editMode)} />
                        )}
                    </div>
                    {editMode ? (
                        <>
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Name</div>
                                <input
                                    type="text"
                                    name="name"
                                    value={basicFormData.name}
                                    onChange={(e) => setBasicFormData({ ...basicFormData, name: e.target.value })}
                                    className="text-gray-600 border rounded-lg px-3 py-1"
                                />
                            </div>
                            <hr />
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Phone</div>
                                <input
                                    type="text"
                                    name="phone"
                                    value={basicFormData.phone}
                                    onChange={(e) => setBasicFormData({ ...basicFormData, phone: e.target.value })}
                                    className="text-gray-600 border rounded-lg px-3 py-1"
                                />
                            </div>
                            <hr />
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Place</div>
                                <input
                                    type="text"
                                    name="place"
                                    value={basicFormData.place}
                                    onChange={(e) => setBasicFormData({ ...basicFormData, place: e.target.value })}
                                    className="text-gray-600 border rounded-lg px-3 py-1"
                                />
                            </div>
                            <hr />
                        </>
                    ) : (
                        <>
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Name</div>
                                <div className='text-gray-600'>{profileInfo?.name}</div>
                            </div>
                            <hr />
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Phone</div>
                                <div className='text-gray-600'>{profileInfo?.phone}</div>
                            </div>
                            <hr />
                            <div className="contact-item flex justify-between">
                                <div className='text-black'>Place</div>
                                <div className='text-gray-600'>{profileInfo?.place}</div>
                            </div>
                            <hr />
                        </>
                    )}
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Email</div>
                        <div className='text-gray-600'>{profileInfo?.email}</div>
                    </div>
                    <hr />
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Password</div>
                        <div className="flex justify-center">
                            <button className="lg:px-4 px-2 py-1 text-sm bg-primary text-[#fff] rounded-lg" onClick={() => setIsModalOpen(true)}>
                                Change Password
                            </button>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
            <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProfileCard;
