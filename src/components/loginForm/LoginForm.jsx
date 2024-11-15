/* eslint-disable react/prop-types */
import React, { memo, useContext, useState } from "react";
import ManImage from "../../assets/images/man.svg";
import {
  AiOutlineUser,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { AuthContext } from "../../context/AuthContext";
import { instance } from "../../api/Api";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router";

const InputWithIcon = ({
  Icon,
  type,
  placeholder,
  value,
  onChange,
  iconClick,
}) => (
  <div className="mt-2 relative">
    <input
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="block w-full text-md rounded-md border-0 py-2.5 pl-2 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      value={value.trim()}
    />
    <Icon
      className={`text-2xl absolute top-2 right-2 ${
        iconClick ? "cursor-pointer" : ""
      }`}
      onClick={iconClick}
    />
  </div>
);

function LoginForm() {
  const [payload, setPayload] = useState({ usernameoremail: "", password: "" });
  const { setProfile } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const showPassword = () => setShow(!show);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!payload.usernameoremail || !payload.password) {
      toast.warning("Iltimos bo'shjoylarni to'ldiring");
      return;
    }

    setLoader(true);

    try {
      const loginResponse = await instance.post("/auth/login", payload, {
        withCredentials: true,
      });

      sessionStorage.setItem("token", loginResponse.data.refreshToken);
      toast.success("Kirish muvaffaqiyatli bajarildi");

      const profileResponse = await instance.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.refreshToken}`,
        },
        withCredentials: true,
      });

      setProfile(profileResponse.data);
      sessionStorage.setItem(
        "userProfile",
        JSON.stringify(profileResponse.data)
      );
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.error("Parol yoki foydalanuvchi nomi noto‘g‘ri");
      } else {
        toast.error(
          "Kirishda xatolik bor: " +
            (err.response ? err.response.data.message : err.message)
        );
      }
    } finally {
      setLoader(false);
      setPayload({ usernameoremail: "", password: "" });
    }
  };

  return (
    <div className="flex items-center lg:flex-row sx:flex-col md:flex-col md:px-10 md:gap-0 w-full lg:gap-10 h-full bg-[#F8F8F8] lg:px-28 rounded-lg shadow-lg sx:px-5 sx:gap-0 sx:w-max">
      <div className="basis-1/2">
        <img
          src={ManImage}
          alt="man-image"
          className="h-96 w-full sx:w-auto sx:h-60"
        />
      </div>
      {loader && <Loader />}
      <form
        className="space-y-6 basis-1/2 sx:basis-auto sx:w-80"
        onSubmit={handleSubmit}
      >
        <InputWithIcon
          Icon={AiOutlineUser}
          type="text"
          placeholder="Foydalanuvchi Nomi"
          value={payload.usernameoremail}
          onChange={(e) =>
            setPayload({ ...payload, usernameoremail: e.target.value })
          }
        />

        <InputWithIcon
          Icon={show ? AiOutlineEye : AiOutlineEyeInvisible}
          type={show ? "text" : "password"}
          placeholder="Parol"
          value={payload.password}
          onChange={(e) => setPayload({ ...payload, password: e.target.value })}
          iconClick={showPassword}
        />

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-500"
          >
            Kirish
          </button>
        </div>
      </form>
    </div>
  );
}

const MemoizeLoginForm = memo(LoginForm);

export default MemoizeLoginForm;
