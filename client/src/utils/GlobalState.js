import React, { createContext, useContext } from 'react'; // createContext creates a container to hold global state data and functionality; useContext allows that data to be used
import { useProductReducer  } from './reducers';

const StoreContext = createContext();
const { Provider } = StoreContext; // every context objuect has a Provider and Consumer. Provider wraps StoreContext and makes it like a prop for all components. Consumer is the means to grab and use that data

const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });
    // use this to confirm it works
    console.log(state);
    return <Provider value = {[state, dispatch]} {...props} />; // Provider is used here, passing state/dispatch and ...props to everything as props
};

const useStoreContext = () => { // Components that use this will receive [state, dispatch] from StoreProvider, so any component with access to StoreProvider can use any data in the global state container or update it with the dispatch function
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };