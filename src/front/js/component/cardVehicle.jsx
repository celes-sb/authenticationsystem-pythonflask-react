import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const CardVehicle = (props) => {
    const { store, actions } = useContext(Context)
    return (
        <div className="card-container d-flex overflow-scroll" style={{ width: "400px" }}>
            <div className="card m-2 d-flex">
                <div className="card-body m-1 p-1">
                    <img className="rounded img-thumbnail img-center" src={"https://starwars-visualguide.com/assets/img/vehicle/" + item.uid + ".jpg"} alt="Vehicle Image" />
                    <br />
                    <h3 className="card-title mt-2 text-center">{props.name}</h3>
                    <p className="card-text text-start ps-4 mb-2"><em>Information</em></p>
                    <ul className="text-start ps-4">
                        <div key={`model_${props.uid}`}>Model: {props.model}</div>
                        <div key={`manufacturer_${props.uid}`}>Manufacturer: {props.manufacturer}</div>
                    </ul>
                    <div className="text-center">
                        <Link to={`/vehicle/${props.uid}`} className="btn btn-outline-primary me-5">Learn More!</Link>
                        <button type="button" onClick={() => {
                            actions.agregarFavorito({
                                name: props.name,
                                uid: props.uid,
                                category: "vehicle",
                                link: `/vehicle/${props.uid}`
                            }
                            )
                        }} className="btn btn-outline-warning ms-5"><i className="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CardVehicle;