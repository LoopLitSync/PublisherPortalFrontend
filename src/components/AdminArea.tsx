import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import keycloak from "../keycloak";
import { updatePublisher } from "../api/PublisherService";
import { fetchPublisherByKeycloakId } from "../api/PublisherService";
import { deletePublisher } from "../api/PublisherService";
import LoadingSpinner from "./LoadingSpinner";

interface KeycloakUser {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
}

const AdminArea = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState<KeycloakUser[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            fetchKeycloakUsers();
        }
    }, [isAdmin]);

    const fetchKeycloakUsers = () => {
        fetch("http://localhost:8081/api/v1/admin/publishers", {
            headers: {
                "Authorization": `Bearer ${keycloak.token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching users:", error));
    };


    const handleEnableDisable = async (keycloakId: string, enable: boolean) => {
        setLoading(true);
        const currentPublisher = await fetchPublisherByKeycloakId(keycloakId);
        currentPublisher.isEnabled = enable;

        try {
            const keycloakResponse = await fetch(`http://localhost:8081/api/v1/admin/publishers/${keycloakId}/${enable ? "enable" : "disable"}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${keycloak.token}`,
                },
            });
            if (keycloakResponse.ok) {
                alert(`User has been ${enable ? "enabled" : "disabled"} successfully.`);
                await updatePublisher(currentPublisher?.id || 0, currentPublisher);
            } else {
                alert(`Failed to ${enable ? "enabled" : "disabled"} user. Please try again later.`);
                throw new Error(`Keycloak update failed: ${keycloakResponse.statusText}`);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating email:", error);
        }
        await fetchKeycloakUsers();
    };


    const handleDelete = async (keycloakId: string) => {
        const currentPublisher = await fetchPublisherByKeycloakId(keycloakId);

        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const keycloakResponse = await fetch(`http://localhost:8081/api/v1/admin/publishers/${keycloakId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${keycloak.token}`,
                    },
                });
                if (keycloakResponse.ok) {
                    alert(`User ${currentPublisher.name} has been deleted.`);
                    await deletePublisher(currentPublisher.id || 0);
                } else {
                    alert(`Failed to delete user ${currentPublisher.name}. Please try again later.`);
                    throw new Error(`Keycloak deleting failed: ${keycloakResponse.statusText}`);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
            }
            await fetchKeycloakUsers();
        };
    };


    return (
        <div className="p-6">
            <span className="text-2xl font-bold block text-center mb-2">User List</span>
            {/* {isLoading && <LoadingSpinner />} */}
            <table className="w-full border border-black bg-white shadow-lg">
                <thead>
                    <tr className="bg-[#8075FF] text-white text-left border-b border-black">
                        <th className="p-3 border-r border-black">ID</th>
                        <th className="p-3 border-r border-black">Username</th>
                        <th className="p-3 border-r border-black">Email</th>
                        <th className="p-3 border-r border-black">Enabled</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100 border-b border-black">
                                <td className="p-3 border-r border-black">{user.id}</td>
                                <td className="p-3 border-r border-black">{user.username}</td>
                                <td className="p-3 border-r border-black">{user.email}</td>
                                <td className="p-3 border-r border-black">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={user.enabled}
                                            onChange={() => handleEnableDisable(user.id, !user.enabled)}
                                            className="sr-only peer"
                                        />
                                        <div
                                            className={`relative w-11 h-6 rounded-full ${user.enabled
                                                ? "bg-[#8075FF] peer-checked:bg-[#8075FF]"
                                                : "bg-gray-200 peer-checked:bg-gray-600"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all ${user.enabled
                                                    ? "translate-x-5"
                                                    : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="p-3">
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))) : (
                        <tr>
                            <td colSpan={8} className="text-center p-4 border-t border-gray-300">
                                {isLoading ? <LoadingSpinner/> : "No users found."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminArea;
