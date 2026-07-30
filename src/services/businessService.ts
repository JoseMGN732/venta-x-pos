export const getBusiness = async (id:number) => {

    const response = await fetch(
        `http://localhost:3001/api/business/${id}`
    );

    return await response.json();

};


export const updateBusiness = async (
    id:number,
    data:any
) => {

    const response = await fetch(
        `http://localhost:3001/api/business/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }
    );

    return await response.json();

};