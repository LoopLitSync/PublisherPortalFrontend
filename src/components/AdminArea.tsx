import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import keycloak from "../keycloak";


interface KeycloakUser {
    id: string;
    username: string;
    email: string;
}

const AdminArea = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState<KeycloakUser[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
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

        }
    }, [isAdmin]);

    return (
        <div>
            <h2>User List</h2>
            {isLoading ? <div>Loading...</div> :
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}

        </div>
    );
}

export default AdminArea;
