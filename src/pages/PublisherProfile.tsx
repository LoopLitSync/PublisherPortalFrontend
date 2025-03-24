import React, { useState } from "react";
import Button from '../components/Button';
import { useAuth } from "../AuthContext";
import keycloak from "../keycloak";
import { Publisher } from "../models/Publisher";
import { updatePublisher } from "../api/PublisherService";
import { useEffect } from "react";
import { fetchPublisherById } from "../api/PublisherService";

const ProfilePage: React.FC = () => {
    const { publisher } = useAuth();
    const keycloakId = keycloak.tokenParsed?.sub;
    const [newEmail, setNewEmail] = useState("");
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPublisher, setCurrentPublisher] = useState<Publisher | null>(null);
    const API_URL = "http://localhost:8081/api/v1/publishers";

    useEffect(() => {
        if (publisher?.id) {
            fetchPublisherById(Number(publisher.id))
                .then(data => {
                    setCurrentPublisher(data);
                })
                .catch(error => console.error("Error fetching publisher:", error));
        }
    }, [publisher]);
    
    const handleEmailUpdate = async () => {
        if (!newEmail.trim()) return alert("Please enter a valid email!");

        const updatedPublisher: Publisher = {
            ...publisher,
            id: publisher?.id || 0,
            keycloakId: publisher?.keycloakId || "",
            name: publisher?.name || "",
            email: newEmail,
            picture: publisher?.picture || null,
        };

        try {
            const keycloakResponse = await fetch(`${API_URL}/${keycloakId}/update_email?newEmail=${newEmail}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    "Content-Type": "application/json",
                },
            });
            
            if (keycloakResponse.ok) {
                alert("A verification email has been sent. Please check your inbox to vefify your new email for successful update.");
                await updatePublisher(updatedPublisher?.id || 0, updatedPublisher);
              } else {
                alert("Failed to update email. Please try again later.");
                throw new Error(`Keycloak update failed: ${keycloakResponse.statusText}`);
            }
        } catch (error) {
            console.error("Error updating email:", error);
        };
        setEmailModalOpen(false);
    };

    const handlePasswordUpdate = async () => {
        try {
            const response = await fetch(`${API_URL}/${keycloakId}/update_password`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert(`A password reset email has been sent to ${currentPublisher?.email}. Please check your inbox to reset your password.`);
              } else {
                alert("Failed to send password reset email.");
              }
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };



    const handleUploadPicture= async () => {
        if (!selectedFile) {
            alert("Please select a file before uploading.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
    
        try {
            const response = await fetch(`${API_URL}/${keycloakId}/update_image`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                alert("Profile picture updated successfully.");
                const updatedPublisher = await fetchPublisherById(Number(publisher?.id));
                setCurrentPublisher(updatedPublisher);
            } else {
                const errorMessage = await response.text();
                alert(`Failed to upload image: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("An error occurred while uploading the image.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
};

const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <div className="flex h-screen items-center justify-center gap-10">
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-2xl">{currentPublisher?.name}</h1>
                <div className="flex flex-row gap-2">
                    <p className="font-bold">Email:</p>
                    <p>{currentPublisher?.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setEmailModalOpen(true)}>
                        Change E-mail
                    </Button>
                    <Button onClick={handlePasswordUpdate}>
                        Change Password
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
            <img
                className="rounded-full w-32 h-32 object-cover"
                src={previewUrl || currentPublisher?.picture || "/default_user.png"}
                alt={currentPublisher?.name || "Default User"}
            />
            <Button onClick={() => document.getElementById("fileUpload")?.click()}>
                Change Picture
            </Button>
            <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
            {selectedFile && (
                <Button onClick={handleUploadPicture}>
                    Upload Picture
                </Button>
            )}
        </div>

            {isEmailModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/25">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Update Email</h2>
                        <input
                            type="email"
                            className="border p-2 w-full rounded-md"
                            placeholder="New email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <Button onClick={handleEmailUpdate}>
                                Update
                            </Button>
                            <button className=" bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setEmailModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    );
};

export default ProfilePage;
