import DashNavbar from "../Components/DashNavbar"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react";

import { useRecoilState, useSetRecoilState } from "recoil";
import { avatarState, userState } from "../store/userAtom";
import axios from "axios";
import { spaceState } from "../store/spaceAtom";
import { toast } from "sonner";
import { RiDeleteBin7Line } from "react-icons/ri";
import Button5 from "../Components/Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

function Dash() {
  const {authUser} = useAuthStore();
  const setUser = useSetRecoilState(userState);
  const setAvatar = useSetRecoilState(avatarState);
  const [spaces, setSpaces] = useRecoilState(spaceState);
  const [loading, setLoading] = useState(true);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [selectedSpaceid, setSelectedSpaceid] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");

      // if (!token) {
      //   navigate("/");
      //   return;
      // }

      try {
        const res = await axios.get(`${BACKEND_URL}/user/metadata`, {
          headers: { authorization: token },
        });
        const res2 = await axios.get(`${BACKEND_URL}/space/all`, {
          headers: { authorization: token },
        });
        setSpaces(res2.data.spaces);
        setUser(res.data.user);
        setAvatar(res.data.avatar);
      } catch (error) {
        toast("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [navigate, setAvatar, setSpaces, setUser]);

  const HandleOpenDelete = (spaceId: string) => {
    setSelectedSpaceid(spaceId);
    setDeleteModal(true);
  };

  const handleCancel = () => {
    setDeleteModal(false);
    setSelectedSpaceid("");
  };

  const handleDelete = async (spaceId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/space/${spaceId}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setSpaces(spaces.filter((s) => s.id !== spaceId));
      toast("Space deleted successfully");
      setDeleteModal(false);
      setSelectedSpaceid("");
    } catch (error) {
      toast("Error deleting");
    }
  };

  console.log(authUser)
  return <div className="bg-Hero w-full h-screen bg-[#282d4e] text-white">
  <DashNavbar />
  {/* Content */}
  <div className="w-[100%] h-[80%] p-8">
    {loading ? (
      <div className="w-full h-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    ) : spaces.length > 0 ? (
      <div className="grid grid-cols-12 justify-center gap-3">
        {spaces.map((space) => (
          <div
            key={space?.id}
            className="col-span-12 md:col-span-6 lg:col-span-4 h-[300px] p-2"
          >
            <div className="w-full h-[80%]">
              <img
                onClick={() => navigate(`/space/${space?.id}`)}
                className="w-full h-full rounded-xl hover:border-4 hover:border-[#545c8f] cursor-pointer"
                src={`${space?.thumbnail}`}
                alt=""
              />
            </div>
            <div className="flex w-full justify-between items-center p-2">
              <h1>{space?.name}</h1>
              <p
                onClick={() => HandleOpenDelete(space?.id)}
                className="cursor-pointer"
              >
                <RiDeleteBin7Line width={40} height={40} />
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="w-[95vw] h-full flex justify-center items-center">
        <p>No Space Found! Create New Space.</p>
      </div>
    )}
  </div>

  {DeleteModal && (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
      <div
        className="fixed top-1/2 left-1/2 w-[500px] h-[150px] flex flex-col justify-center items-center gap-2 shadow-lg rounded-xl z-30"
        style={{
          backgroundColor: "rgb(40, 45, 78)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <p className="text-xl font-semibold">
          Are you sure you want to delete this Space?
        </p>
        <div className="w-[50%] flex justify-between items-center mt-4">
          <Button5
            text="Cancel"
            size="xl"
            color="black"
            classname="cursor-pointer"
            onClick={handleCancel}
          />
          <Button5
            text="Delete"
            size="xl"
            color="black"
            classname="text-white cursor-pointer"
            onClick={() => handleDelete(selectedSpaceid)}
          />
        </div>
      </div>
    </>
  )}
</div>

}

export default Dash








