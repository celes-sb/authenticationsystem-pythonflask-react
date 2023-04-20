import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => { console.log(email) }, [email])
    useEffect(() => { console.log(password) }, [password])

    return (<>
        <div className="container-fluid">
            <div className="contactForm container border mt-5 pb-5">
                <div className="d-flex justify-content-center">
                    <h1 className="fs-1 fw-bold mt-5">Login</h1>
                </div>
                <div className="form-control border border-0 ps-4 pe-4">
                    <form>
                        <label htmlFor="full-name" className="form-label fs-5">
                            Email
                        </label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Enter email"
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                        <label htmlFor="email" className="form-label fs-5">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Enter email"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                className="button-save col-md-2 btn btn-success fs-6 mt-3"
                                onClick={(e) => {
                                    actions.login(email, password)
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default Login;