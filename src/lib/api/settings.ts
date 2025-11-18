import api from "./axios";

export interface PharmacyResponse{
    id: number,
    pharmacy_name: string,
    invoice_footer: string,
    email: string,
    phone: string,
    address: string
}

export interface UpdatePharmacyRequest{
    pharmacy_name: string,
    invoice_footer: string,
    email: string,
    phone: string,
    address: string
}

export const getPharmacy = async () => {
    const response = await api.get('/settings');
    return response.data.data;
}

export const updatePharmacy = async (data: UpdatePharmacyRequest) => {
    const response = await api.put('/settings', data);
    return response.data.data;
}