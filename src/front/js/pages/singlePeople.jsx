import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const SinglePeople = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [people, setPeople] = useState({})

    useEffect(() => {
        const cargaDatos = async () => {
            let { respuestaJson, response } = await actions.useFetch(`/people/${params.uid}`)
            if (response.ok) {
                console.log(respuestaJson)
                setPeople(respuestaJson.result.properties)
            }
        }
        cargaDatos()

    }, [params.uid])

    return (<>
        <div className="jumbotron jumbotron-fluid bg-light border border-danger rounded w-75 mx-auto mt-5 p-3 text-center">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-6">
                        <img className="img-fluid rounded border border-danger" src={"https://starwars-visualguide.com/assets/img/characters/" + params.uid + ".jpg"} alt={`${people.name + ' Picture'}`} style={{ width: '300px', height: '400px' }} />
                    </div>
                    <div className="col-md-6">
                        <h2 className="singleCardTitle pb-2">{people.name ? people.name : ""} | UID # {params.uid}</h2>
                        <p className="lead text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare lacus nec magna suscipit dictum. Nullam sit amet viverra metus. Praesent facilisis dictum ipsum eu venenatis. Pellentesque imperdiet nunc non pulvinar viverra. Suspendisse sollicitudin egestas nisl at mattis. Nullam quis rutrum massa. Integer non turpis at felis facilisis viverra sit amet et mi. Mauris mattis magna turpis, nec consectetur erat congue quis. Phasellus eu nibh vitae arcu gravida maximus sagittis imperdiet massa. Aenean maximus eu velit ac tempus. Mauris at massa sed orci tempor auctor. Nunc auctor sapien non sem convallis cursus et quis lacus. Donec eleifend tellus vel lacinia consequat. Pellentesque ex felis, placerat non accumsan placerat, sagittis eget eros. Sed luctus turpis eu placerat pharetra. Pellentesque eleifend ac odio non ornare.</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-3">
                        <p className="text-danger">Height</p>
                        <p className="text-dark">{people.height}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Hair Color</p>
                        <p className="text-dark">{people.hair_color}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Mass</p>
                        <p className="text-dark">{people.mass}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="text-danger">Birth Year</p>
                        <p className="text-dark">{people.birth_year}</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default SinglePeople