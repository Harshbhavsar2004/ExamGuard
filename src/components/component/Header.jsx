import React from "react";
import { Link,  } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
export default function Header() {

  return (
    <header className="flex items-center justify-between h-20 w-full px-4 md:px-6 border-b-2 border-zinc-500">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faHouse} className="text-3xl" />
        <Link to="/">
          <h1 className="font-bold ml-5 text-3xl">Secure Pariksha</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
      </div>
    </header>
  );
}
