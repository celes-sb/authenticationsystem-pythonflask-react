import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const SingleVehicle = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [vehicle, setVehicle] = useState({})

    useEffect(() => {
        const cargaDatos = async () => {
            let { respuestaJson, response } = await actions.useFetch(`/vehicles/${params.uid}`)
            if (response.ok) {
                console.log(respuestaJson)
                setVehicle(respuestaJson.result.properties)
            }
        }
        cargaDatos()

    }, [params.uid])

    return (<>
        Soy {vehicle.name ? vehicle.name : ""} con el uid {params.uid}
        <br />
        <div className="jumbotron jumbotron-fluid bg-light border rounded w-75 mx-auto mt-5 p-3 text-center">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-6">
                        <img className="img-fluid rounded" src="https://lumiere-a.akamaihd.net/v1/images/databank_bwingfighter_01_169_460cc528.jpeg?region=0%2C0%2C1560%2C878" alt="Vehicle Image" />
                    </div>
                    <div className="col-md-6">
                        <h1 className="singleCardTitle">{vehicle.name ? vehicle.name : ""} | UID # {params.uid}</h1>
                        <p className="lead text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare lacus nec magna suscipit dictum. Nullam sit amet viverra metus. Praesent facilisis dictum ipsum eu venenatis. Pellentesque imperdiet nunc non pulvinar viverra. Suspendisse sollicitudin egestas nisl at mattis. Nullam quis rutrum massa. Integer non turpis at felis facilisis viverra sit amet et mi. Mauris mattis magna turpis, nec consectetur erat congue quis. Phasellus eu nibh vitae arcu gravida maximus sagittis imperdiet massa. Aenean maximus eu velit ac tempus. Mauris at massa sed orci tempor auctor. Nunc auctor sapien non sem convallis cursus et quis lacus. Donec eleifend tellus vel lacinia consequat. Pellentesque ex felis, placerat non accumsan placerat, sagittis eget eros. Sed luctus turpis eu placerat pharetra. Pellentesque eleifend ac odio non ornare.</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-3">
                        <p className="text-danger">Model</p>
                        <p className="text-dark">{vehicle.model}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Vehicle Class</p>
                        <p className="text-dark">{vehicle.vehicle_class}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Max Atmosphering Speed</p>
                        <p className="text-dark">{vehicle.max_atmosphering_speed}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Passengers</p>
                        <p className="text-dark">{vehicle.passengers}</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default SingleVehicle