import { atom } from "recoil";

export const spaceState = atom<any>({
    key: 'spaceState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

