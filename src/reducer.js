export const initialState = {
    basket: [],
    flash: {},
    deliveryInfo: {},
    showFlash: false,
    user: null,
    sidebar: window.innerWidth > 1280 ? true : false,
    loading: true,
    loaded: false,
    lastUrl: null,
}

export const getBasketTotal = (basket) => 
    basket.reduce((amount, item) => Number(item.price * item.quantity) + amount, 0)

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

        case 'ADD_DELIVERY_INFO':
            return {
                ...state,
                deliveryInfo: action.deliveryInfo,
            }

        case 'EMPTY_FDELIVERY_INFO':
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

        case "ADD_LOADING":
            return {
                ...state,
                loading: action.loading
            }

        case "SET_LOADED":
            return {
                ...state,
                loaded: action.loaded
            }
    
        case "DISPLAY_SIDEBAR":
            return {
                ...state,
                sidebar: action.sidebar
            }
            
        default:
            return state;
    }
}

export default reducer