import React, { useContext } from "react";
import { DigiContext } from "../../context/DigiContext";
import NavLink from "../router/NavLink";

const AppsPart = () => {
  const {
    state,
    toggleCrmDropdown,
    toggleHrmDropdown,
    toggleEcommerceDropdown,
    toggleMainDropdown,
    toggleSubDropdown,
    layoutPosition,
    dropdownOpen,
    mainAppsDropdownRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen,
  } = useContext(DigiContext);
  const {
    isMainDropdownOpen,
    isCrmDropdownOpen,
    isHrmDropdownOpen,
    isEcommerceDropdownOpen,
    isSubDropdownOpen,
  } = state;

  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubDropdown(); // Open the sub-dropdown
    }
  };
  return (
    <li
      className="sidebar-item"
      ref={
        isExpanded ||
        isNavExpanded.isSmall ||
        layoutPosition.horizontal ||
        (layoutPosition.twoColumn && isExpanded) ||
        (layoutPosition.twoColumn && isSmallScreen)
          ? mainAppsDropdownRef
          : null
      }
    >
      <a
        role="button"
        className={`sidebar-link-group-title has-sub ${
          isMainDropdownOpen ? "show" : ""
        }`}
        onClick={toggleMainDropdown}
      >
        Cloud Vision
      </a>
      <ul
        className={`sidebar-link-group 
      ${
        layoutPosition.horizontal
          ? dropdownOpen.apps
            ? "d-block"
            : "d-none"
          : isMainDropdownOpen
          ? "d-none"
          : ""
      }
      `}
      >
        <li className="sidebar-dropdown-item">
          <li className="sidebar-dropdown-item">
            <NavLink
              href="/cloudvision/text_detection/tin-certtificate"
              className="sidebar-link"
              onClick={handleSubNavLinkClick}
            >
              <span className="nav-icon">
                <i className="fa-light fa-cart-shopping-fast"></i>
              </span>{" "}
              <span className="sidebar-txt">TIN Verify</span>
            </NavLink>
          </li>
        </li>
        <li className="sidebar-dropdown-item">
          <li className="sidebar-dropdown-item">
            <NavLink
              href="/cloudvision/text_detection/vehicle/number-plate"
              className="sidebar-link"
            >
              <span className="nav-icon">
                <i className="fa-light fa-cart-shopping-fast"></i>
              </span>{" "}
              <span className="sidebar-txt">Vehicle Number Plate</span>
            </NavLink>
          </li>
        </li>
        <li className="sidebar-dropdown-item">
          <li className="sidebar-dropdown-item">
            <NavLink
              href="/cloudvision/text_detection/nid/nid-back"
              className="sidebar-link"
            >
              <span className="nav-icon">
                <i className="fa-light fa-cart-shopping-fast"></i>
              </span>{" "}
              <span className="sidebar-txt">NID BACK</span>
            </NavLink>
          </li>
        </li>
        <li className="sidebar-dropdown-item">
          <li className="sidebar-dropdown-item">
            <NavLink
              href="/cloudvision/text_detection/trade/trade-license"
              className="sidebar-link"
            >
              <span className="nav-icon">
                <i className="fa-light fa-cart-shopping-fast"></i>
              </span>{" "}
              <span className="sidebar-txt">Trade license</span>
            </NavLink>
          </li>
        </li>

        {/* <li className="sidebar-dropdown-item">
          <NavLink href="/calendar" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{" "}
            <span className="sidebar-txt">Calendar</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/chat" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-messages"></i>
            </span>{" "}
            <span className="sidebar-txt">Chat</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink href="/email" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-envelope"></i>
            </span>{" "}
            <span className="sidebar-txt">Email</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/invoices" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-invoice"></i>
            </span>{" "}
            <span className="sidebar-txt">Invoices</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink href="/openai/basic/contacts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{" "}
            <span className="sidebar-txt">Chat Completion</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink href="/openai/basic/stream" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{" "}
            <span className="sidebar-txt">Chat Completion Stream</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default AppsPart;
