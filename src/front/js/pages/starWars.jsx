import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import CardPeople from "../component/cardPeople.jsx";
import CardPlanet from "../component/cardPlanet.jsx";
import CardVehicle from "../component/cardVehicle.jsx";
import { todoActions } from "../store/todos";
//React parallax

const StarWars = () => {
    const { store, actions } = useContext(Context)
    const [listPeople, setListPeople] = useState({})
    const [listVehicle, setListVehicle] = useState({})
    const [listPlanet, setListPlanet] = useState({})

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

            /* ({ respuestaJson, response } = await actions.useFetch("/login"))
            if (response.ok) {
                console.log(respuestaJson)
                setListVehicle(respuestaJson.results)
            }
            if (respuestaJson.login == true) {
                ({ respuestaJson, response } = await actions.useFetch("/saldo-de-la-cuenta"))
                if (response.ok) {
                    console.log(respuestaJson)
                    setListVehicle(respuestaJson.results)
                }
            } */

        }
        //cargaDatos() //login, //consultar saldo 

        const cargaParalelo = async () => {
            let promesaPlanetas = actions.useFetchParalelo("/planets") //chequear si va en sing o plural!!
            let promesaPeople = actions.useFetchParalelo("/people")
            let promesaVehicles = actions.useFetchParalelo("/vehicles") //chequear si va en sing o plural!!

            //resuelvo las tres promesas al mismo tiempo
            let [a, b, c] = await Promise.all([promesaPlanetas, promesaPeople, promesaVehicles])

            a = await a.json()
            setListPlanet(a.results)

            b = await b.json()
            setListPeople(b.results)

            c = await c.json()
            setListVehicle(c.results)
        }
        cargaParalelo() //paralelo //saldo en la cuenta, transferencia efectiva, etc

    }, [])

    useEffect(() => { }, [listPeople])
    useEffect(() => { }, [listPlanet])
    useEffect(() => { }, [listVehicle])

    return (<>
        Soy el componente de Star wars


        <div>
            <h1 className="text-danger">Characters</h1>
            <ul>
                {listPeople && listPeople.length > 0 ?
                    <>
                        {listPeople.map((item, index) => {
                            return <li key={item.uid}>
                                <CardPeople name={item.name} uid={item.uid} />
                            </li>
                        })}
                    </> : <></>}
            </ul>
        </div>
        <br />
        <div>
            <h1 className="text-danger">Planets</h1>
            <ul>
                {listPlanet && listPlanet.length > 0 ?
                    <>
                        {listPlanet.map((item, index) => {
                            return <li key={item.uid}>
                                <CardPlanet name={item.name} uid={item.uid} />
                            </li>
                        })}
                    </> : <></>}
            </ul>
        </div>
        <br />
        <div>
            <h1 className="text-danger">Vehicles</h1>
            <ul>
                {listVehicle && listVehicle.length > 0 ?
                    <>
                        {listVehicle.map((item, index) => {
                            return <li key={item.uid}>
                                <CardVehicle name={item.name} uid={item.uid} />
                            </li>
                        })}
                    </> : <></>}
            </ul>
        </div>

    </>)
}

export default StarWars