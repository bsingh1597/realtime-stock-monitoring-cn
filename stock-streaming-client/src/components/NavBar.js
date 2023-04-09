import React, { useEffect, useState } from "react";
import "../styles/NavBar.css";

export default function NavBar() {
//   if (props.login == "true") {
//     console.log("hi tina");
//   } else {
//     console.log("bye tina");
//   }
//   const user = sessionStorage.getItem("userType");
  return (
    <nav className="navbar">
      <div className="title">
        Stock Watch
      </div>
      {/* {user != "Admin" ? (
        <ul>
          <li>
            <div className="search">
              <input type="text" placeholder="Search..." />
              <button>search</button>
            </div>
          </li>
          <li>
            {props.login == "true" || localStorage.getItem("rememberMe") ? (
              <>
                <CustomLink to="/profile">Profile</CustomLink>
              </>
            ) : (
              <CustomLink to="/login">Login</CustomLink>
            )}
          </li>
        </ul>
      ) : null} */}
    </nav>
    
  );
}

// function CustomLink({ to, children, ...props }) {
//   //give actual full path
//   const resolvedPath = useResolvedPath(to);
//   //check if entire url is matched
//   const isActive = useMatch({ path: resolvedPath.pathname, end: true });

//   return (
//     <li className={isActive ? "active" : ""}>
//       <Link to={to} {...props}>
//         {children}
//       </Link>
//     </li>
//   );
// }
