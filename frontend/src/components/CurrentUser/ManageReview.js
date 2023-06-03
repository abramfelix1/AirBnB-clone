import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReviewsList from "../Reviews/ReviewsList";
import { NavLink } from "react-router-dom/";

export default function ManageReview() {
  const [startRender, setStartRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartRender(true);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return !startRender ? (
    <div className="spot-loader">
      <h1>. . .</h1>
    </div>
  ) : (
    <>
      <div className="manage-container">
        <div className="manage-header ">
          <h1>Manage Reviews</h1>
        </div>
        <ReviewsList
          manage={true}
          startRender={startRender}
          setStartRender={setStartRender}
        />
      </div>
    </>
  );
}