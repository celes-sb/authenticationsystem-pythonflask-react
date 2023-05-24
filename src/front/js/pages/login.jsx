import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await actions.login(email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="login container-fluid">
                <div className="contactForm container border mt-5 pb-5">
                    <div className="d-flex justify-content-center">
                        <h1 className="fs-1 fw-bold mt-5">Login</h1>
                    </div>
                    <div className="form-control border border-0 ps-4 pe-4">
                        <form>
                            <label htmlFor="email" className="form-label fs-5">
                                Email
                            </label>
                            <input
                                className="form-control mb-3"
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="password" className="form-label fs-5">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control mb-3"
                                id="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="button-save col-md-2 btn btn-success fs-6 mt-3"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;