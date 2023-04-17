import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const SinglePlanet = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [planet, setPlanet] = useState({})

    useEffect(() => {
        const cargaDatos = async () => {
            let { respuestaJson, response } = await actions.useFetch(`/planets/${params.uid}`)
            if (response.ok) {
                console.log(respuestaJson)
                setPlanet(respuestaJson.result.properties)
            }
        }
        cargaDatos()

    }, [params.uid])

    return (<>
        Soy {planet.name ? planet.name : ""} con el uid {params.uid}
        <br />
        <div className="jumbotron jumbotron-fluid bg-light border rounded w-75 mx-auto mt-5 p-3 text-center">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-6">
                        <img className="img-fluid rounded" src="https://lumiere-a.akamaihd.net/v1/images/concord-dawn_4277a880.jpeg?region=4%2C0%2C1552%2C873" alt="Planet Image" />
                    </div>
                    <div className="col-md-6">
                        <h1 className="singleCardTitle">{planet.name ? planet.name : ""} | UID # {params.uid}</h1>
                        <p className="lead text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare lacus nec magna suscipit dictum. Nullam sit amet viverra metus. Praesent facilisis dictum ipsum eu venenatis. Pellentesque imperdiet nunc non pulvinar viverra. Suspendisse sollicitudin egestas nisl at mattis. Nullam quis rutrum massa. Integer non turpis at felis facilisis viverra sit amet et mi. Mauris mattis magna turpis, nec consectetur erat congue quis. Phasellus eu nibh vitae arcu gravida maximus sagittis imperdiet massa. Aenean maximus eu velit ac tempus. Mauris at massa sed orci tempor auctor. Nunc auctor sapien non sem convallis cursus et quis lacus. Donec eleifend tellus vel lacinia consequat. Pellentesque ex felis, placerat non accumsan placerat, sagittis eget eros. Sed luctus turpis eu placerat pharetra. Pellentesque eleifend ac odio non ornare.</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-3">
                        <p className="text-danger">Climate</p>
                        <p className="text-dark">{planet.climate}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Gravity</p>
                        <p className="text-dark">{planet.gravity}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Rotation Period</p>
                        <p className="text-dark">{planet.rotation_period}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Population</p>
                        <p className="text-dark">{planet.population}</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default SinglePlanet