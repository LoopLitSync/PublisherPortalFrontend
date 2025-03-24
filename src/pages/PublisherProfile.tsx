import React, { useState } from "react";
import Button from '../components/Button';
import { useAuth } from "../AuthContext";
import keycloak from "../keycloak";
import { Publisher } from "../models/Publisher";
import { updatePublisher } from "../api/PublisherService";
import { useEffect } from "react";
import { fetchPublisherById } from "../api/PublisherService";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage: React.FC = () => {
    const { publisher } = useAuth();
    const keycloakId = keycloak.tokenParsed?.sub;
    const [newEmail, setNewEmail] = useState("");
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPublisher, setCurrentPublisher] = useState<Publisher | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = "http://localhost:8081/api/v1/publishers";

    useEffect(() => {
        if (publisher) {
            fetchPublisherById(Number(publisher.id)).then(setCurrentPublisher);
            setIsLoading(false);
        }
    }, [publisher]);


    const handleEmailUpdate = async () => {
        if (!newEmail.trim()) return alert("Please enter a valid email!");

        setIsLoading(true);
        if (currentPublisher) {
            currentPublisher.email = newEmail;
        }

        try {
            const keycloakResponse = await fetch(`${API_URL}/${keycloakId}/update_email?newEmail=${newEmail}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    "Content-Type": "application/json",
                },
            });
            setIsLoading(false);
            setEmailModalOpen(false);
            if (keycloakResponse.ok) {
                alert("A verification email has been sent. Please check your inbox to verify your new email. \n\nNote: The new email will be updated in your profile after next login.");
                if (currentPublisher) {
                    await updatePublisher(currentPublisher?.id || 0, currentPublisher);
                }
            } else {
                alert("Failed to update email. Please try again later.");
                throw new Error(`Keycloak update failed: ${keycloakResponse.statusText}`);
            }
        } catch (error) {
            console.error("Error updating email:", error);
        };
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
                alert(`A password reset email has been sent to ${publisher?.email}. Please check your inbox to reset your password.`);
            } else {
                alert("Failed to send password reset email.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadPicture = () => {
        console.log("Uploading picture:", selectedFile);
    };


    return (
        <div className="flex h-screen items-center justify-center gap-10">
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-2xl">{currentPublisher?.name}</h1>
                <div className="flex flex-row gap-2">
                    <p className="font-bold">Email:</p>
                    <p>{publisher?.email}</p>
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
                {publisher?.picture ? (
                    <img className="rounded-full w-32 h-32 object-cover" src={currentPublisher?.picture || "/default_user.png"} alt={currentPublisher?.name || "Default User"} />
                ) : (
                    <img className="rounded-full w-32 h-32 object-cover" src="/default_user.png" />
                )}
                <Button
                    onClick={() => document.getElementById("fileUpload")?.click()}>
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
                
                <div className="fixed inset-0 flex items-center justify-center bg-black/15">
                    {!isLoading ?
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div>
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
                        </div> : ((<LoadingSpinner />)
                    )}

                </div>


            )}
        </div>
    );
};

export default ProfilePage;
