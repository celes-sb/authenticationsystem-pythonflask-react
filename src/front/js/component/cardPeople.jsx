import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { todoActions } from "../store/todos";

const CardPeople = (props) => {
    const { store, actions } = useContext(Context)

    return (
        <div className="card-container d-flex flex-row overflow-scroll">
            <div className="card-body p-1 border">
                <img className="rounded img-thumbnail img-center" /*src={"https://starwars-visualguide.com/assets/img/characters/" + item.uid + ".jpg"} */ />
                <h4 className="card-title mt-2 text-center">{props.name}</h4>
                <p className="card-text text-start ps-4 mb-2"><em>Information</em></p>
                <ul className="text-start ps-4">
                    <li key={`height_${props.uid}`}>Height: {props.height}</li>
                    <li key={`mass_${props.uid}`}>Mass: {props.mass}</li>
                </ul>
                <div className="text-center">
                    <Link to={`/people/${props.uid}`} className="btn btn-outline-primary me-5">Learn More!</Link>
                    <button type="button" onClick={() => {
                        actions.agregarFavorito({
                            name: props.name,
                            uid: props.uid,
                            category: "people",
                            link: `/people/${props.uid}`
                        }
                        )
                    }} className="btn btn-outline-warning ms-5"><i className="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    );

}

export default CardPeople;