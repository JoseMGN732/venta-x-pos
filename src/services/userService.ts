const API = "http://localhost:3001/api/users";

const getNegocioId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.negocioId;
};

export const getUsers = async () => {

    const negocioId = getNegocioId();

    const res = await fetch(`${API}?id_negocio=${negocioId}`);

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

    const negocioId = getNegocioId();

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...user,
            id_negocio: negocioId
        }),
    });

    return await res.json();

};

export const deleteUser = async (id: number) => {

    const negocioId = getNegocioId();

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_negocio: negocioId
        }),
    });

    return await res.json();

};