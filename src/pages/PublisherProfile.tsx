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
    const [newPassword, setNewPassword] = useState("");
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPublisher, setCurrentPublisher] = useState<Publisher | null>(null);
    const API_URL = "http://localhost:8081/api/v1/publishers";

    useEffect(() => {
        if (publisher) {
            fetchPublisherById(Number(publisher.id)).then(setCurrentPublisher);
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
            if (!keycloakResponse.ok) {
                // If Keycloak update fails, alert and exit
                alert("Failed to update email in Keycloak. Please try again later.");
                throw new Error(`Keycloak update failed: ${keycloakResponse.statusText}`);
            }
            // If Keycloak update succeeds, proceed to update email in the backend
            await updatePublisher(updatedPublisher?.id || 0, updatedPublisher);
            alert("Email updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating email:", error);
        };
        setEmailModalOpen(false);
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword.trim()) return alert("Please enter a new password!");

        try {
            // Update password to keycloak
            await fetch(`${API_URL}/${keycloakId}/update_password?newPassword=${newPassword}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: newPassword }),
            });

            alert("Password updated successfully!");
            setPasswordModalOpen(false);
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password.");
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
                    <p>{currentPublisher?.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setEmailModalOpen(true)}>
                        Change E-mail
                    </Button>
                    <Button onClick={() => setPasswordModalOpen(true)}>
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

            {/* Password Update Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/25">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Update Password</h2>
                        <input
                            type="password"
                            className="border p-2 w-full rounded-md"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className="flex justify-end mt-4 gap-2">

                            <Button onClick={handlePasswordUpdate}>
                                Update
                            </Button>
                            <button className=" bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setPasswordModalOpen(false)}>
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
