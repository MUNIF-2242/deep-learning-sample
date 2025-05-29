import { useContext, useEffect } from "react";
import Link from "next/link";
import { DigiContext } from "../../context/DigiContext";
import NavLink from "../router/NavLink";

const ComponentsPart = () => {
  const {
    componentState,
    toggleComponentMainDropdown,
    toggleAdvance,
    toggleMultipleLevel,
    toggleFirstLevel,
    toggleSecondLevel,
    toggleSubComponentDropdown,
    layoutPosition,
    dropdownOpen,
    mainComponentRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen,
  } = useContext(DigiContext);

  const {
    isMainDropdownOpen,
    advance,
    multipleLevel,
    firstLevel,
    secondLevel,
    isSubComponentDropdownOpen,
  } = componentState;

  useEffect(() => {
    localStorage.setItem("componentState", JSON.stringify(componentState));
  }, [componentState]);

  const handleSubNavLinkClick = () => {
    if (!isSubComponentDropdownOpen) {
      toggleSubComponentDropdown(); // Open the sub-dropdown
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
          ? mainComponentRef
          : null
      }
    >
      <a
        role="button"
        className={`sidebar-link-group-title has-sub ${
          isMainDropdownOpen ? "show" : ""
        }`}
        onClick={toggleComponentMainDropdown}
      >
        AWS
      </a>
      <ul
        className={`sidebar-link-group ${
          layoutPosition.horizontal
            ? dropdownOpen.component
              ? "d-block"
              : ""
            : isMainDropdownOpen
            ? "d-none"
            : ""
        }`}
      >
        <li className="sidebar-dropdown-item">
          <NavLink
            href="/aws/label_detection/profile-image"
            className="sidebar-link"
          >
            <span className="nav-icon">
              <i className="fa-light fa-table"></i>
            </span>{" "}
            <span className="sidebar-txt">Detect Labels</span>
          </NavLink>
        </li>
        {/* <li className="sidebar-dropdown-item">
          <NavLink href="/charts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-chart-simple"></i>
            </span>{" "}
            <span className="sidebar-txt">Charts</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/icon" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-compass-drafting"></i>
            </span>{" "}
            <span className="sidebar-txt">Icons</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/map" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-location-dot"></i>
            </span>{" "}
            <span className="sidebar-txt">Maps</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/fileManager" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-folder-open"></i>
            </span>{" "}
            <span className="sidebar-txt">File Manager</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default ComponentsPart;
