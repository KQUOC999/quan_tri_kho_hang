
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [data, setData] = useState({});
    const [addNewItem, setAddNewItem] = useState({});
    const [closeAddNewItem, setCloseAddNewItem] = useState(false);

    return (
        <AppContext.Provider value={{ data, setData, addNewItem, setAddNewItem, closeAddNewItem, setCloseAddNewItem }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
