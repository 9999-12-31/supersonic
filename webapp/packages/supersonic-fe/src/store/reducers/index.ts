
const initialState = { message: '' };

const messageReducer = (state = initialState, action: any) => {    
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    default:
      return state;
  }
};

export default messageReducer;