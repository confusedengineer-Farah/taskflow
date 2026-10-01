import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api/api";
import { userAuth } from "../context/AuthContext";
import { AuthResponse } from "../types";
import { formToJSON } from "axios";

const input = "w-full border border-slate-300 rounded-lg p-2 mb-3 bg-white";
const button = "w-full bg-indigo-600 text-white rounded-lg p-2 font-medium hover:bg-indigo-700 disabled: opacity-60";

export default function Login() {
    const [ form, setForm ] = useState({ email: "", password: "" });
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const { saveLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = ( e: ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError();
        setLoading(true);
        try {
            const { data } = await api.post<AuthResponse>("/auth/login", form);
            saveLogin(data);
            navigate("/");
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }


return (
    <div className="min-h-screen flex items-center justify-center px-4">
        <form 
          onSubmit= { handleSubmit }
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow">
            <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
            { error && <p className="text-red-600 text-sm mb-3"></p>}
            <input className={ input } name="email" type="email" placeholder="Email" value={ form.email } onChange={handleChange} required />
            <input className={ input } name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button className={ button } disabled={ loading }>{loading ? "Logging in ..." : "Login"}</button>
            <p className="text-sm text-slate-500 mt-4 text-center">No account?{" "}
                <link className="text-indigo-600" to="/register">Registerr</link>
            </p>
        </form>
    </div>
)
}