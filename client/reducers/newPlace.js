
const CREATE_ADDRESS = 'CREATE_ADDRESS';
const CREATE_PLACE_NAME = 'CREATE_PLACE_NAME';

export function createAddress(address){
	const action = {type: CREATE_ADDRESS, address}
	return action
}

export function createPlaceName(name){
	const action = {type: CREATE_PLACE_NAME, name}
	return action
}

export function newAddressReducer(state='', action){
	switch(action.type){
		case CREATE_ADDRESS:
			return action.address
		default:
			return state
	}
}

export function newPlaceNameReducer(state='', action){
	switch(action.type){
		case CREATE_PLACE_NAME:
			return action.name
		default:
			return state
	}
}

// export default newPlaceReducer