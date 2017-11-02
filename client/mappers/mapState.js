import * as store from '../store.js'

//Cart component
export function cartStateMap ({cart, user}) {
	return { cart, user }
}

//Product mappers
export function productsStateMap ({products}) {
	return { products }
}

//Product mappers
export function userStateMap ({user}) {
	return { user }
}

//All mapper
export function allStateMap({user, products, cart}) {
	return {
		user,
		products,
		cart
	}
}
