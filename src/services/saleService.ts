const API = "http://localhost:3001/api/sales";

export const getSales = async () => {
    const res = await fetch(API);
    return await res.json();
};

export const createSale = async (sale: any) => {
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
    });

    return await res.json();
};