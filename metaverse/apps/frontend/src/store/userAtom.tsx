import { atom } from "recoil";
interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}
export const userState = atom<User|null>({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: { id: "", name: "", username: "", role: "" }, // default value (aka initial value)
});

export const avatarState = atom({
  key: "avatarState", // unique ID (with respect to other atoms/selectors)
  default: { id: "", imageUrl: "" }, // default value (aka initial value)
});
