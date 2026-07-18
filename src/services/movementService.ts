const API = "http://localhost:3001/api/movements";

export const getMovements = async () => {
    const res = await fetch(API);
    return await res.json();
};

export const createMovement = async (movement: any) => {
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movement),
    });

    return await res.json();
};

export const deleteMovement = async (id: number) => {
    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
    });

    return await res.json();
};