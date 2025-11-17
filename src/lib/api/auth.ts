import api from "./axios";

interface LoginPayload {
    email: string;
    password: string;
}

export async function loginApi(data: LoginPayload) {
    const res = await api.post("/auth/login", data);
    return res.data.data;
}
