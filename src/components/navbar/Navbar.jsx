/* eslint-disable react/no-unescaped-entities */
import React, { useState, memo, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { HiBars3 } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCurrencies,
  getCurrencyList,
  getLastCurrency,
} from "../../functions/UserMethodes";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { BsCalendarDate, BsClock } from "react-icons/bs";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [activeNav, setActiveNav] = useState(false);
  const { profile, isOpenMenu, setIsOpenMenu } = useContext(AuthContext);

  const navigate = useNavigate();

  const { data: list } = useQuery(["getCurrencyList"], () => getCurrencyList());
  const { data: last } = useQuery(
    ["getLastCurrency"],
    () => getLastCurrency(),
    // { refetchInterval: 5000 } // shuni yoqib quyish kerak
  );

  const yearFormat = (value) => {
    return value ? format(new Date(value), "dd-MM-yyy") : "";
  };
  const hourFormat = (value) => {
    return value ? format(new Date(value), "HH:mm ") : "";
  };

  const logOut = () => {
    ["token", "userProfile"].forEach((item) => sessionStorage.removeItem(item));
    navigate("/login");
  };

  const queryClient = useQueryClient();
  const addCurrency = useMutation({
    mutationFn: addCurrencies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLastCurrency"] });
    },
  });

  useEffect(() => {
    if (last?.length === 0) {
      if (profile?.roles?.role_name) {
        Swal.fire({
          title: "Dollar kursini kiriting!",
          input: "number",
          inputAutoTrim: true,
          inputAttributes: {
            autocapitalize: "off",
            autocomplete: "off",
          },
          confirmButtonText: "Saqlash",
          confirmButtonColor: "#1769c7",
          allowOutsideClick: false

        }).then((result) => {
          if (result.isConfirmed) {
            let data = {
              rate_value: result.value,
              currency_id: list?.["0"]?.id,
              is_default: true,
            };
            if (result.value) {
              addCurrency.mutate(data);
            }
          }
        });
      }
    }
  }, [last]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Swal.fire({
        title: "Dollar kursini kiriting!",
        input: "number",
        inputAutoTrim: true,
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
        },
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Bekor qilish",
        confirmButtonText: "Saqlash",
        confirmButtonColor: "#1769c7",
      }).then((result) => {
        if (result.isConfirmed) {
          let data = {
            rate_value: result.value,
            currency_id: list?.["0"].id,
            is_default: true,
          };
          if (result.value) {
            addCurrency.mutate(data);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[70px] z-40 bg-white shadow-md shadow-gray-200 flex  items-center pr-4 relative">
      <div className="flex flex-wrap  xl:flex-nowrap w-full justify-between h-full items-center px-2 sm:px-10">
        <div className="flex flex-1 xl:flex-initial items-center justify-between">
          <Link
            to={"/"}
            className="md:text-3xl text-lg font-semibold select-none cursor-pointer text-secondary font-montserrat flex gap-2"
          >
            <p className="text-transparent bg-clip-text bg-gradient-to-bl from-indigo-600 to-cyan-400">
              FAYZLI
            </p>
            <p>UYLAR</p>
          </Link>
          <button className="cursor-pointer text-[30px] block xl:hidden">
            {activeNav ? (
              <RxCross1
                className="text-[25px]"
                onClick={() => setActiveNav(!activeNav)}
              />
            ) : (
              <HiBars3 onClick={() => setActiveNav(!activeNav)} />
            )}
          </button>
        </div>
        <div
          className={`flex flex-1 select-none  overflow-hidden transition-all duration-300  xl:items-center bg-white shadow-xl xl:shadow-none shadow-black/50 xl:flex-row flex-col absolute border-l sm:border-l-0  ${activeNav ? "sm:w-[400px] w-[calc(100%-72px)] px-2" : "w-0"
            } py-2 xl:w-auto h-[calc(100vh-70px)] xl:h-auto top-[100%] xl:top-auto xl:right-auto right-0 xl:relative  gap-2 xl:gap-5 ml-[40px] xl:order-1 order-3`}
        >
          <Link
            className="border border-gray-200 p-2 text-[13px] text-gray-500 font-bold rounded-md hover:bg-gray-200 hover:text-secondary hover:text-primary duration-200"
            to="/sales-department"
          >
            # Maskanlar
          </Link>
          <Link
            className="border border-gray-200 p-2 text-[13px] text-gray-500 font-bold rounded-md hover:bg-gray-200 hover:text-secondary hover:text-primary duration-200"
            to="/customers"
          >
            # Mijozlar
          </Link>
          <Link
            className="border border-gray-200 p-2 text-[13px] text-gray-500 font-bold rounded-md hover:bg-gray-200 hover:text-secondary hover:text-primary duration-200"
            to="/cassier"
          >
            # To'lovlar
          </Link>
          <Link
            className="border border-gray-200 p-2 text-[13px] text-gray-500 font-bold rounded-md hover:bg-gray-200 hover:text-secondary hover:text-primary duration-200"
            to="/orders"
          >
            # Shartnomalar
          </Link>
          <div className="flex lg:ml-auto items-center gap-6 order-2">
            <div className="flex md:flex-row sx:flex-col items-center sx:items-start gap-6 sx:gap-2">
              <div className="text-sm font-medium flex gap-2 items-center">
                <p className="flex items-center gap-2">
                  <BsCalendarDate />
                  {yearFormat(last?.updated_at)}
                </p>
                <p className="flex items-center gap-2">
                  <BsClock />
                  {hourFormat(last?.updated_at)}
                </p>
              </div>
              <button
                // disabled={profile?.roles?.role_name !== "SuperAdmin"}
                onDoubleClick={handleSubmit}
                className="text-sm text-blue-600 font-bold select-none cursor-pointer disabled:opacity-90 disabled:cursor-default border-0 ring-0 outline-none"
              >
                1 $ = {last?.rate_value?.brm()} UZS
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50px]">
        <button
          onClick={() => setIsOpenMenu((prev) => !prev)}
          className="w-[45px] h-[45px]  cursor-pointer border border-slate-400 rounded-full flex items-center justify-center"
        >
          {profile ? (
            profile?.first_name?.slice(0, 1).toUpperCase()
          ) : (
            <BiUser className="text-xl" />
          )}
        </button>
        <div
          className={`absolute top-[70px] right-4 shadow-best bg-white rounded-md whitespace-nowrap overflow-hidden ${isOpenMenu ? "h-[72px]" : "h-0"
            } duration-200 z-50 flex flex-col justify-center items-start`}
        >
          <button
            onClick={() => {
              navigate("/profile");
              setIsOpenMenu(false);
            }}
            className="py-1.5 px-5 rounded-sm w-full text-left duration-150 hover:bg-gray-200"
          >
            Mening Profilim
          </button>
          <button
            onClick={() => {
              logOut();
              setIsOpenMenu(false);
            }}
            className="py-1.5 px-5 rounded-sm w-full text-left duration-150 hover:bg-gray-200"
          >
            Chiqish
          </button>
        </div>
      </div>
      {isOpenMenu && (
        <div
          onClick={() => setIsOpenMenu(false)}
          className="fixed w-full h-full top-0 z-40 left-0"
        ></div>
      )}
    </div>
  );
}

const MemoizeNavbar = memo(Navbar);

export default MemoizeNavbar;
