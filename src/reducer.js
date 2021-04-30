export const initialState = {
    basket: [],
    flash: {},
    deliveryInfo: {},
    produceDetails: {},
    showFlash: false,
    user: null,
    details: false,
    lastUrl: null,
}

export const getBasketTotal = (basket) => 
    basket?.reduce((amount, item) => Number(item.price * item.quantity) + amount, 0)

export const getItemTotal = (basket) => 
basket?.reduce((amount, item) => Number(item.quantity + amount), 0)

    const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item],
            }

        case 'EMPTY_BASKET':
            return {
                ...state,
                basket: []
            }

        case 'REMOVE_FROM_BASKET':
            const basketIndex = state.basket.findIndex((basketItem) => 
                basketItem.id === action.id
            )
            let newBasket = [...state.basket]

            if (basketIndex !== -1) {
                newBasket.splice(basketIndex, 1)
            } else {
                console.warn(`Can not remove product (id: ${action.id}) as it is not in the basket`)
            }

            return {
                ...state,
                basket: newBasket
            }

        case 'ADD_BASKET_QUANTITY' :
            const basketItemIndex = state.basket.findIndex((basketItem) => 
                basketItem.id === action.id
            )
            let newQuantityBasket = [...state.basket]
            
            if (basketItemIndex !== -1) {
                newQuantityBasket[basketItemIndex].quantity = action.quantity
            }

            return {
                ...state,
                basket: newQuantityBasket
            }

        case 'ADD_FLASH_MESSAGE':
            return {
                ...state,
                flash: action.message,
            }
    
        case "SHOW_FLASH_MESSAGE":
            return {
                ...state,
                showFlash: action.showFlash
            }

        case 'ADD_PRODUCE_DETAILS':
            return {
                ...state,
                produceDetails: action.produceDetails,
            }

        case 'ADD_DELIVERY_INFO':
            return {
                ...state,
                deliveryInfo: action.deliveryInfo,
            }

        case 'EMPTY_DELIVERY_INFO':
            return {
                ...state,
                deliveryInfo: {}
            }
            
        case "SET_USER":
            return {
                ...state,
                user: action.user
            }
        
        case "SET_LASTURL":
            return {
                ...state,
                lastUrl: action.lastUrl
            }

        case 'RESET__URL':
            return {
                ...state,
                lastUrl: null
            }

        case "SHOW_DETAILS":
            return {
                ...state,
                details: action.details
            }
            
        default:
            return state;
    }
}

export default reducer