import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const CardPlanets = (props) => {
    const { store, actions } = useContext(Context)

    return (
        <div className="card-container d-flex flex-row overflow-scroll bg-white">
            <div className="card-body p-3">
                <img className="img rounded img-thumbnail img-center" src={"https://starwars-visualguide.com/assets/img/planets/" + props.uid + ".jpg"} />
                <h5 className="card-title mt-3 mb-3 text-center">{props.name}</h5>
                <div className="text-center">
                    <Link to={`/planets/${props.uid}`} className="btn btn-outline-primary me-5">Learn More!</Link>
                    <button type="button" onClick={() => {
                        actions.addReadLater({
                            name: props.name,
                            uid: props.uid,
                            category: "planets",
                            link: `/planets/${props.uid}`
                        }
                        )
                    }} className="btn btn-outline-success me-2"><i className="far fa-plus"></i></button>
                    <button type="button" onClick={() => {
                        actions.agregarFavorito({
                            name: props.name,
                            uid: props.uid,
                            category: "planets",
                            link: `/planets/${props.uid}`
                        }
                        )
                    }} className="btn btn-outline-warning"><i className="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    )
};

export default CardPlanets;