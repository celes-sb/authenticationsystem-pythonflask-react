import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const CardPlanets = (props) => {
    const { store, actions } = useContext(Context)

    return (
        <div className="card-container d-flex flex-row overflow-scroll bg-white">
            <div className="card-body p-3">
                <img className="img rounded img-thumbnail img-center" src={"https://starwars-visualguide.com/assets/img/planets/" + props.uid + ".jpg"} />
                <h5 className="card-title mt-2 text-center">{props.name}</h5>
                <ul className="text-start ps-4">
                    <li key={`climate_${props.uid}`}>Climate: {props.climate}</li>
                    <li key={`gravity_${props.uid}`}>Gravity: {props.gravity}</li>
                </ul>
                <div className="text-center">
                    <Link to={`/planets/${props.uid}`} className="btn btn-outline-primary me-5">Learn More!</Link>
                    <button type="button" onClick={() => {
                        actions.agregarFavorito({
                            name: props.name,
                            uid: props.uid,
                            category: "planets",
                            link: `/planets/${props.uid}`
                        }
                        )
                    }} className="btn btn-outline-warning ms-5"><i className="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    )
};

export default CardPlanets;
