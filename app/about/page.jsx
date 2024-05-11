"use client";

import {
  initializeUserInFirestore,
  updateUserInFirestore,
  aboutPageContentRating,
  aboutPageContentFeedback,
} from "@/utils/functions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdLocalPhone } from "react-icons/md";
import { FaTiktok } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { BsChatText } from "react-icons/bs";

export default function Page() {
  const [userRating, setUserRating] = useState(null);

  const handleRate = async (value) => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      await aboutPageContentRating(value);
    }

    setUserRating(value);
  };
  useEffect(() => {
    // Check if the user has a unique identifier in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // If no identifier exists, initialize a new user
      initializeUserInFirestore("aboutPage");
    } else {
      // If an identifier already exists, update it
      updateUserInFirestore("aboutPage");
      console.log("Returning user with ID:", userId);
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount
  return (
    <>
      <div className="border-b p-2 sticky top-0 bg-white">
        <Link
          href={"/shop/today"}
          className="text-lg font-semibold max-w-[8rem]"
        >
          Kvinde Imports
        </Link>
      </div>
      <div className="mx-2 flex flex-col justify-center items-center gap-4 my-4 max-w-3xl md:mx-auto">
        <div>
          <h1 className="font-semibold text-lg text-orange-600">About us</h1>
          <p className="text-sm">
            Kvinde imports is dedicated to sourcing quality products from China.
            Here, we order and sell products at very affordable prices all to
            help each other succeed in our everyday lives and businesses. We
            order kitchenwares, personal stuff, dresses, electronics etc. Join
            us to stay updated on the latest trends and make valuable
            connections with fellow importers. Together, let's unlock new
            opportunities and achieve importation success!
          </p>
        </div>
        <div>
          <h1 className="font-semibold text-lg text-orange-600">Rules</h1>
          <p className="text-sm mb-1 border-b pb-2">No refund after payment.</p>
          <p className="text-sm mb-1 border-b pb-2">
            Know exactly what you want, especially with sizes.
          </p>
          <p className="text-sm mb-1 border-b pb-2">
            Payment should be made to only this number 0540610692 (Shani Sandah) and a screenshot sent to the number immediately after payment
            is made.
          </p>
          <p className="text-sm mb-1 border-b pb-2">
            Once you make the payment, that's when your order is validated.
          </p>
          <p className="text-sm mb-1 border-b pb-2">
            Keep in mind that shipping fees can't be determined until the items
            arrive and they are not expensive.
          </p>
          <p className="text-sm mb-1 border-b pb-2">
            It is important to note that the counting starts from when the
            container departs, not when you make the payment.
          </p>
        </div>
        <Rating onRate={handleRate} />
        <div className="bg-orange-600 p-2 rounded-lg text-white">
          <h1 className="font-semibold text-lg text-center mb-4">Contact us</h1>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Link
              href={`https://wa.me/${233202743233}/?text=${"Hi there,"}%0A%0A`}
              className="flex flex-col gap-2 justify-center items-center border rounded-md p-2"
            >
              <BsChatText className="text-2xl" />
              <span>DM</span>
            </Link>
            <Link
              href="https://chat.whatsapp.com/HyREJbyL0iW15Fxix8qdO5"
              className="flex flex-col gap-2 justify-center items-center border rounded-md p-2"
            >
              <FaWhatsapp className="text-2xl" />
              <span>WhatsApp Group</span>
            </Link>
            <Link
              href="tel:+233592771234"
              className="flex flex-col gap-2 justify-center items-center border rounded-md p-2"
            >
              <MdLocalPhone className="text-2xl" />
              <span>+233 202...</span>
            </Link>
            <Link
              target="_blank"
              href="https://www.tiktok.com/@kvinde.imports"
              className="flex flex-col gap-2 justify-center items-center border rounded-md p-2"
            >
              <FaTiktok className="text-2xl" />
              <span>TikTok</span>
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/tiwaah36/"
              className="flex flex-col gap-2 justify-center items-center border rounded-md p-2"
            >
              <IoLogoInstagram className="text-2xl" />
              <span>Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const Rating = ({ onRate }) => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleRate = async (value) => {
    setRating(value);

    const userId = localStorage.getItem("userId");
    if (userId) {
      await aboutPageContentRating(value);
    }

    onRate(value);
  };

  const handleFeedback = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      await aboutPageContentFeedback(feedback);
      setFeedbackSubmitted(true); // Set feedbackSubmitted to true after submitting feedback
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div className="w-full bg-slate-200 rounded-lg p-4">
      <div className="flex text-sm justify-center items-center flex-col">
        <h2 className="font-semibold text-base">
          Please, help us improve our content.
        </h2>
        <p>How will you rate the information above?</p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <div className="mb-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className="border border-slate-700 rounded-full hover:bg-slate-700 hover:text-white py-2 px-4 mx-2 mt-3"
              onClick={() => handleRate(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {rating && (
          <div className="mb-4">
            <p className="text-center text-sm">Thank you for rating!</p>
            <p className="text-center mb-4 font-semibold">You rated: {rating}</p>
            {!feedbackSubmitted ? ( // Check if feedback has been submitted
              <div className="border-t border-gray-400 pt-4">
                <p className="font-semibold">
                  How could it be better?
                </p>
                <p className="text-xs">
                  Please, keep in mind that this form is for feedback only and you won't receive a reply. Don't include personal information about you or someone else.
                </p>
                <textarea
                  className="w-full border border-slate-700 rounded-md p-2 mt-1 text-lg"
                  placeholder="Optional"
                  value={feedback}
                  onChange={handleFeedbackChange}
                />
                <button
                  className="border bg-blue-600 text-white py-1 px-4 mt-2 w-full"
                  onClick={handleFeedback}
                >
                  Submit
                </button>
              </div>
            ) : (
              <p className="text-green-600">Feedback submitted! Thank you.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};