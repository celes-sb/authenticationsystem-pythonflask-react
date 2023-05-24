import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const Register = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSignup = async () => {
        try {
            const response = await actions.signup(name, email, username, password);
            console.log(response);
            setIsRegistered(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="contactForm container border mt-5 pb-5">
                    <div className="d-flex justify-content-center">
                        <h1 className="fs-1 fw-bold mt-5">Register</h1>
                    </div>
                    <div className="form-control border border-0 ps-4 pe-4">
                        <form>
                            <label htmlFor="name" className="form-label fs-5">
                                Name
                            </label>
                            <input
                                className="form-control mb-3"
                                type="text"
                                id="name"
                                placeholder="Enter name"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="name" className="form-label fs-5">
                                Username
                            </label>
                            <input
                                className="form-control mb-3"
                                type="text"
                                id="username"
                                placeholder="Enter username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
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
                            <label htmlFor="password" className="form-label fs-5">Password</label>
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
                                    className={`button-save col-md-2 btn ${isRegistered ? "btn-warning" : "btn-success"} fs-6 mt-3`}
                                    onClick={handleSignup}
                                    disabled={isRegistered}
                                >
                                    {isRegistered ? "Register Successful!" : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>)
}

export default Register;