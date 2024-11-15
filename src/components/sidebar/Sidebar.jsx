/* eslint-disable react/prop-types */
import React, { memo, useContext, useState } from "react";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsBuildings } from "react-icons/bs";
import { MdOutlineSell } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { FiPieChart, FiSettings } from "react-icons/fi";
import { sidebarPanelLinks } from "../../static";
import { IoWalletOutline } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";

const NavLinkItem = ({ to, Icon, label, onMouseEnter }) => (
  <NavLink
    to={to}
    className="flex flex-col items-center py-2 sidebar-item z-40"
    onMouseEnter={onMouseEnter}
  >
    <Icon className="text-[28px] text-gray-400" />
    <p className="text-[9px] sm:text-[12px] font-semibold text-gray-400 text-center">
      {label}
    </p>
  </NavLink>
);

function Sidebar() {
  const [sidebarPanel, setSidebarPanel] = useState(false);
  const [sidebarPanelIndex, setSidebarPanelIndex] = useState(0);
  const { profile } = useContext(AuthContext);

  const menuItems = [];

  if (profile.roles?.role_name === "SuperAdmin") {
    // SuperAdmin uchun hamma menularni qo'shish:
    menuItems.push(
      {
        key: "home",
        to: "/",
        Icon: AiOutlineHome,
        label: "Bosh sahifa",
        panelIndex: null,
      },
      {
        key: "buildings",
        to: "/projects",
        Icon: BsBuildings,
        label: "Binolar",
        panelIndex: null,
      },
      {
        key: "reports",
        to: "/reports",
        Icon: FiPieChart,
        label: "Hisobotlar",
        panelIndex: 0,
      },
      {
        key: "sales",
        to: "/sales-department",
        Icon: MdOutlineSell,
        label: "Sotuv",
        panelIndex: 1,
      },
      {
        key: "customers",
        to: "/customers",
        Icon: HiOutlineUsers,
        label: "Mijozlar",
        panelIndex: null,
      },
      {
        key: "cassier",
        to: "/cassier",
        Icon: IoWalletOutline,
        label: "Kassa",
        panelIndex: null,
      },
      {
        key: "settings",
        to: "/users",
        Icon: FiSettings,
        label: "Sozlamalar",
        panelIndex: 2,
      }
      // ... (agar boshqa menular bo'lsa, shu yerga qo'shing)
    );
  } else {
    // SuperAdmin emas foydalanuvchilar uchun menularni qo'shish:
    menuItems.push(
      {
        key: "sales",
        to: "/sales-department",
        Icon: MdOutlineSell,
        label: "Sotuv",
        panelIndex: 1,
      },
      {
        key: "customers",
        to: "/customers",
        Icon: HiOutlineUsers,
        label: "Mijozlar",
        panelIndex: null,
      },
      {
        key: "cassier",
        to: "/cassier",
        Icon: IoWalletOutline,
        label: "Kassa",
        panelIndex: null,
      }
      // ... (agar boshqa menular bo'lsa, shu yerga qo'shing)
    );
  }

  return (
    <>
      <div className="w-[70px] sm:w-[120px] h-full relative bg-white shadow shadow-gray-200 sidebar-div flex flex-col justify-between items-stretch pb-3">
        <ul className="flex flex-col overflow-hidden">
          {menuItems?.map((item, idx) => (
            <NavLinkItem
              key={idx}
              to={item.to}
              Icon={item.Icon}
              label={item.label}
              onMouseEnter={() => {
                if (item.panelIndex !== null) {
                  setSidebarPanel(true);
                  setSidebarPanelIndex(item.panelIndex);
                } else {
                  setSidebarPanel(false);
                }
              }}
            />
          ))}
        </ul>
      </div>
      <div
        onMouseLeave={() => {
          setSidebarPanel(false)
        }}
        className={`${sidebarPanel ? "sidebar-active-bar show" : "sidebar-active-bar"
          }`}
      >
        {sidebarPanelLinks[sidebarPanelIndex]?.links.map((item, id) => (
          <ul key={id} className="flex flex-col">
            {item?.data?.map((i) => (
              <Link
                className="text-gray-500 p-[8px] px-5 font-semibold text-sm rounded-sm whitespace-nowrap hover:bg-gray-200 hover:text-primary duration-200"
                to={`/${i.path}`}
                key={i.id}
                onClick={() => {
                  setSidebarPanel(false)
                }}
              >
                {i.name}
              </Link>
            ))}
          </ul>
        ))}
      </div>
      {/* {closeSidebar && <div className="fixed w-full h-full top-0 left-0" onMouseEnter={() => setSidebarPanel(false)} ></div>} */}
    </>
  );
}

const MemoizeSidebar = memo(Sidebar);
export default MemoizeSidebar;
