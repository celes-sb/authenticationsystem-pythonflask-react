import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const CardPlanet = (props) => {
    const { store, actions } = useContext(Context)
    return (
        <div className="row">
            <div className="col-sm-4">
                <div className="card m-2">
                    <div className="card-body m-1 p-1">
                        <img className="rounded img-thumbnail img-center" /*src={"https://starwars-visualguide.com/assets/img/planet/" + item.uid + ".jpg"}*/ />
                        <br />
                        <h3 className="card-title mt-2 text-center">{props.name}</h3>
                        <p className="card-text text-start ps-4 mb-2"><em>Information</em></p>
                        <ul className="text-start ps-4">
                            <div key={`climate_${props.uid}`}>Climate: {props.climate}</div>
                            <div key={`gravity_${props.uid}`}>Gravity: {props.gravity}</div>
                        </ul>
                        <div className="text-center">
                            <Link to={`/planet/${props.uid}`} className="btn btn-outline-primary me-5">Learn More!</Link>
                            <button type="button" onClick={() => {
                                actions.agregarFavorito({
                                    name: props.name,
                                    uid: props.uid,
                                    category: "planet",
                                    link: `/planet/${props.uid}`
                                }
                                )
                            }} className="btn btn-outline-warning ms-5"><i className="far fa-heart"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CardPlanet;