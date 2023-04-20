export const favoritosStore = {
    favoritos: JSON.parse(localStorage.getItem("favoritos") || "[]")
};


export function favoritosActions(getStore, getActions, setStore) {
    const handleDelete = (index) => {
        let store = getStore();
        let arrTemp = store.favoritos.slice(); //copio estado centralizado
        arrTemp.splice(index, 1);
        setStore({ ...store, favoritos: arrTemp });
    }

    return {
        agregarFavorito: async (objeto) => {
            let store = getStore();
            let arrTemp = store.favoritos.slice(); //copio estado centralizado

            if (arrTemp.length > 0) {
                for (let i = 0; i < arrTemp.length; i++) {
                    if (arrTemp[i]["name"] == objeto.name) {
                        return; //sale de la función
                    }
                }
            }
            arrTemp.push(objeto);
            setStore({ ...store, favoritos: arrTemp }); //[...favoritos, objeto]

            // update local storage
            localStorage.setItem("favoritos", JSON.stringify(arrTemp));
            return true;
        },

        handleDelete: handleDelete,
    }
}
