import { atom } from "recoil";
interface Space {
  id:  string;
  name: string;
  thumbnail: string;
  dimensions: string; // "WxH" format
};

export const spaceState = atom<Space[]>({
    key: 'spaceState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
  });

