export const readLaterStore = {
    readLater: JSON.parse(localStorage.getItem("readLater") || "[]")
};

export function readLaterActions(getStore, getActions, setStore) {
    const handleDelete = (index) => {
        let store = getStore();
        let arrTemp = store.readLater.slice(); //copio estado centralizado
        arrTemp.splice(index, 1);
        setStore({ ...store, readLater: arrTemp });
    };

    return {
        addReadLater: async (objeto) => {
            let store = getStore();
            let arrTemp = store.readLater.slice(); //copio estado centralizado

            if (arrTemp.length > 0) {
                for (let i = 0; i < arrTemp.length; i++) {
                    if (arrTemp[i]["name"] == objeto.name) {
                        return; //sale de la función
                    }
                }
            }
            arrTemp.push(objeto);
            setStore({ ...store, readLater: arrTemp }); //[...readLater, objeto]

            // update local storage
            localStorage.setItem("readLater", JSON.stringify(arrTemp));
            return true;
        },

        handleDelete: handleDelete,
    };
}