import React, { createContext, useContext, useReducer } from 'react'

export const StateContext = createContext()

export const useStateValue = () => useContext(StateContext)

export function StateProvider({ reducer, initialState, children }) {
    return (
        <div>
            <StateContext.Provider value={useReducer(reducer, initialState)}>
                {children}
            </StateContext.Provider>
        </div>
    )
}
