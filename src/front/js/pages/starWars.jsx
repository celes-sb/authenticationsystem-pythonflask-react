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

    //se ejecuta la primera vez que se reenderiza el componente
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
            //resuelvo las tres promesas al mismo tiempo
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
        </>
    );
}

export default StarWars;