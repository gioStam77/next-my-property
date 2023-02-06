import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { enoikiastes: [], homeAddress: {}, sxolia: '' },
  // cart: {

  //   enoikiastes: Cookies.get('enoikiastes')
  //     ? JSON.parse(Cookies.get('enoikiastes'))
  //     : [],
  //   homeAddress: Cookies.get('homeAddress')
  //     ? JSON.parse(Cookies.get('homeAddress'))
  //     : { location: {} },
  //   sxolia: Cookies.get('sxolia') ? JSON.parse(Cookies.get('sxolia')) : '',
  // },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.enoikiastes.find(
        (item) => item._id === newItem._id
      );
      const enoikiastes = existItem
        ? state.cart.enoikiastes.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.enoikiastes, newItem];
      // const enoikiastes = { ...state.cart.enoikiastes, newItem };

      // Cookies.set('enoikiastes', JSON.stringify(enoikiastes));
      Cookies.set('cart', JSON.stringify({ ...state.cart, enoikiastes }));
      return { ...state, cart: { ...state.cart, enoikiastes } };
    }
    case 'CART_REMOVE_ITEM': {
      const enoikiastes = state.cart.enoikiastes.filter(
        (item) => item.slug !== action.payload.slug
      );
      // Cookies.set('enoikiastes', JSON.stringify(enoikiastes));
      Cookies.set('cart', JSON.stringify({ ...state.cart, enoikiastes }));

      return { ...state, cart: { ...state.cart, enoikiastes } };
    }
    case 'CART_RESET': {
      return {
        ...state,
        cart: {
          enoikiastes: [],
          homeAddress: { location: {} },
          sxolia: '',
        },
      };
    }
    case 'SAVE_HOME_ADDRESS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          homeAddress: {
            ...state.cart.homeAddress,
            ...action.payload,
          },
        },
      };
    }
    case 'SAVE_SXOLIA': {
      return {
        ...state,
        cart: {
          ...state.cart,
          sxolia: action.payload,
        },
      };
    }
    case 'CART_CLEAR_ITEMS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          enoikiastes: [],
        },
      };
    }
    default:
      return state;
  }
}
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
