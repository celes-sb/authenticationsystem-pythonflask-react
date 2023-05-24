import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const { setStore } = actions; // Import the setStore function

	const handleDelete = (index) => {
		let store = getStore();
		let arrTemp = store.favoritos.slice(); //copio estado centralizado
		arrTemp.splice(index, 1);
		setStore({ ...store, favoritos: arrTemp });
	};

	const handleLogout = () => {
		actions.logout();
		alert("Logout successful.")
	};


	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container-fluid">
				<Link to="/">
					<img className="img-responsive h-25 w-25" src="https://lumiere-a.akamaihd.net/v1/images/sw_logo_stacked_2x-52b4f6d33087_7ef430af.png?region=0,0,586,254" />
				</Link>
				{!store.userLogin ?
					<div>
						<Link to="/login">
							<button className="btn btn-warning rounded-pill me-3" type="button">Login</button>
						</Link>
						<Link to="/register">
							<button className="btn btn-warning rounded-pill me-3" type="button">Register</button>
						</Link>
					</div>
					:
					<div className="d-flex align-items-center">
						<div className="nav-item dropdown">
							<button className="btn btn-warning dropdown-toggle rounded-pill" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
								Favorites
							</button>
							<ul className="dropdown-menu list-unstyled" style={{ width: '200px' }} aria-labelledby="navbarDropdown">
								{store.favoritos && store.favoritos.length > 0 ? (
									<>
										{store.favoritos.map((item, index) => {
											return (
												<div key={index} className="d-flex justify-content-between align-items-center" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
													<Link to={item.link} style={{ color: 'black', textDecoration: 'none', fontSize: '15px' }}>
														{item.name}
													</Link>
													<i className="fas fa-trash-alt text-danger h6 p-1" onClick={() => actions.handleDelete(index)} style={{ cursor: 'pointer' }}></i>
												</div>
											);
										})}
									</>
								) : (
									<></>
								)}
							</ul>
						</div>
						<button className="btn btn-warning rounded-pill btn-danger ms-2" onClick={handleLogout}>Logout</button>
					</div>
				}
			</div>
		</nav >
	);
};