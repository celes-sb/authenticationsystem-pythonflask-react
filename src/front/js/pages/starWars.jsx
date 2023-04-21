import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import CardPeople from "../component/cardPeople.jsx";
import CardPlanets from "../component/cardPlanets.jsx";
import CardVehicles from "../component/cardVehicles.jsx";

const StarWars = () => {
    const { store, actions } = useContext(Context)
    const [listPeople, setListPeople] = useState({})
    const [listPlanet, setListPlanet] = useState({})
    const [listVehicle, setListVehicle] = useState({})

    useEffect(() => {
        const cargaDatos = async () => {
            let { respuestaJson, response } = await actions.useFetch("/people")
            if (response.ok) {
                console.log(respuestaJson)
                setListPeople(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/planets"))
            if (response.ok) {
                console.log(respuestaJson)
                setListPlanet(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/vehicles"))
            if (response.ok) {
                console.log(respuestaJson)
                setListVehicle(respuestaJson.results)
            }
        }
        //cargaDatos()

        const cargaParalelo = async () => {
            let promesaPeople = actions.useFetchParalelo("/people")
            let promesaPlanet = actions.useFetchParalelo("/planets")
            let promesaVehicle = actions.useFetchParalelo("/vehicles")
            let [a, b, c] = await Promise.all([promesaPeople, promesaPlanet, promesaVehicle])

            a = await a.json()
            setListPeople(a.results)

            b = await b.json()
            setListPlanet(b.results)

            c = await c.json()
            setListVehicle(c.results)
        }
        cargaParalelo()

    }, []);

    useEffect(() => { }, [listPeople])
    useEffect(() => { }, [listPlanet])
    useEffect(() => { }, [listVehicle])

    return (
        <>
            <div className="section">
                <h1 className="text-danger" style={{ fontFamily: "monospace" }}>Characters</h1>
                <div className="card-container">
                    {listPeople && listPeople.length > 0 ? (
                        <div className="card-scroll">
                            {listPeople.map((item, index) => {
                                return (
                                    <CardPeople
                                        key={index}
                                        name={item.name}
                                        uid={item.uid}
                                        height={item.height}
                                    />

                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="section">
                <h1 className="text-danger" style={{ fontFamily: "monospace" }}>Planets</h1>
                <div className="card-container">
                    {listPlanet && listPlanet.length > 0 ? (
                        <div className="card-scroll">
                            {listPlanet.map((item, index) => {
                                return (
                                    <CardPlanets
                                        key={item.uid}
                                        name={item.name}
                                        uid={item.uid}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="section">
                <h1 className="text-danger" style={{ fontFamily: "monospace" }}>Vehicles</h1>
                <div className="card-container">
                    {listVehicle && listVehicle.length > 0 ? (
                        <div className="card-scroll">
                            {listVehicle.map((item, index) => {
                                return (
                                    <CardVehicles
                                        key={item.uid}
                                        name={item.name}
                                        uid={item.uid}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="section">
                <h1 className="text-danger" style={{ fontFamily: "monospace" }}>Read Later</h1>
                <div className="card-container ms-1 me-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col-2" style={{ fontFamily: "monospace" }}>Name</th>
                                <th scope="col-2" style={{ fontFamily: "monospace" }}>Link</th>
                                <th scope="col-2" style={{ fontFamily: "monospace" }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.readLater && store.readLater.length > 0 ? (
                                <>
                                    {store.readLater.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
                                                </td>
                                                <td>
                                                    <i className="fas fa-trash-alt text-danger h6 p-1" onClick={() => actions.handleDelete(index)} style={{ cursor: 'pointer' }}></i>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ fontFamily: "monospace" }}>No items added to Read Later list</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default StarWars;