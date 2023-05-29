import { getToken, setToken, removeToken } from "./tokenManager.js";

export const usuarioStore = {
    listaUsuarios: [],
    usuario: {
        msg: "I'm an object"
    },
    user: "",
    userLogin: false
};

export function usuarioActions(getStore, getActions, setStore) {
    return {
        login: async (email, password) => {
            const store = getStore();
            const actions = getActions();
            console.log("Es la encargada de hacer login del usuario", email, password);
            let obj = {
                email: email,
                password: password
            };

            let { respuestaJson, response } = await actions.useFetch("/api/login", obj, "POST");
            console.log(response.ok);
            console.log(respuestaJson);
            if (response.ok) {
                setToken(respuestaJson.token); // Store the token using the token manager
                actions.setStore({ ...store, userLogin: true }); // Use actions.setStore to update the store
            } else {
                console.log("login fallido");
                removeToken(); // Remove the token from storage
                actions.setStore({ ...store, userLogin: false }); // Use actions.setStore to update the store
            }

            return store.usuario;
        },
        signup: async (name, email, username, password) => {
            const store = getStore();
            const actions = getActions();
            console.log("Es la encargada de hacer login del usuario", email, password, name, username);
            let obj = {
                name: name,
                email: email,
                username: username,
                password: password
            };

            let { respuestaJson, response } = await actions.useFetch("/api/signup", obj, "POST");
            console.log(response.ok);
            console.log(respuestaJson);
            if (response.ok) {
                console.log(respuestaJson);
            } else {
                console.log("signup failed");
            }
        },
        logout: () => {
            const store = getStore();
            const actions = getActions();
            removeToken(); // Remove the token from storage
            actions.setStore({ ...store, userLogin: false }); // Use actions.setStore to update the store
        },
        userToDo: (nuevoUser) => {
            const store = getStore();
            actions.setStore({ ...store, user: nuevoUser }); // Use actions.setStore to update the store
        },
        setStore: setStore // Include the setStore function in the actions object
    };
}
