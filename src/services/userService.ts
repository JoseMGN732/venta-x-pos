const API = "http://localhost:3001/api/users";

export const getUsers = async () => {
    const res = await fetch(API);
    return await res.json();
};

export const createUser = async (user: any) => {
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    return await res.json();
};

export const updateUser = async (id: number, user: any) => {
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    return await res.json();
};

export const deleteUser = async (id: number) => {
    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
    });

    return await res.json();
};