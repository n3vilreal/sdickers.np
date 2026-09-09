import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sticker from "../assets/images/metro-boomin-sticker.jpeg";
import TrendingCollections from "../cards/TrendingCollections";
import Reviews from "../cards/Reviews";
import api from "../api";
import { isLoggedIn } from "../auth";
import { IoStar } from "react-icons/io5";

const trending = [
  {
    id: 1,
    title: "SPIDER VERSE",
    bgImage: "https://i.pinimg.com/736x/b5/24/5f/b5245fa999ef0323bc0cbba3f5a9d60b.jpg",
  },
  {
    id: 2,
    title: "MOVIES",
    bgImage: "https://i.pinimg.com/1200x/2a/72/33/2a723335d74f6e96fb061909942ac19d.jpg",
  },
  {
    id: 3,
    title: "ROCK BANDS",
    bgImage: "https://i.pinimg.com/736x/40/66/14/406614169646c73356383fa37e9f87af.jpg",
  },
];

let shippedNumbers = 56;
let collectorNumbers = 13;

export default function LandingPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4.5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [stars, setStars] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        api.get("/reviews"),
        api.get("/reviews/stats"),
      ]);
      setReviews(reviewsRes.data.data || []);
      const avg = statsRes.data.data?.averageRating;
      if (avg) setAverageRating(avg);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/reviews", { stars, reviewText });
      setStars(5);
      setReviewText("");
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewForm = () => {
    if (!isLoggedIn()) {
      alert("Please log in to leave a review.");
      return navigate("/login");
    }
    setShowReviewForm(true);
  };

  return (
    <>
      <div id="main" className="w-screen min-h-180 md:h-180 bg-[#111111] flex justify-center items-center px-6 py-16 md:py-0">
        <div id="container" className="w-full md:w-[50%] flex flex-col md:flex-row justify-between items-center gap-y-10 md:gap-y-0">
          <div id="left" className="flex flex-col w-full md:w-[50%] gap-y-5 items-center md:items-start text-center md:text-left">
            <span className="text-[#8a8a8a] text-[11px]">
              SDICKERS DROP 003 - SECURE THE BATCH
            </span>
            <span className="font-sans text-white text-4xl sm:text-5xl md:text-6xl font-bold">
              THE ART OF ADHESION
            </span>
            <span className="text-[#8a8a8a] text-[11px]">
              Limited-edition artist collabs printed on premium weatherproof vinyl. Each drop is finite — once it's gone, it's gone.
            </span>
            <span
              className="text-[11px] text-white font-bold border border-[#8a8a8a] w-37.5 h-10 flex justify-center items-center hover:bg-[#00ff66] hover:border-0 hover:text-black hover:cursor-pointer duration-500 ease-in-out"
              onClick={() => navigate("/marketplace")}
            >
              SHOP NEW DROP
            </span>
          </div>
          <div id="right">
            <img src={sticker} alt="sticker" className="h-48 sm:h-56 md:h-64 hover:scale-110 duration-500 ease-in-out" />
          </div>
        </div>
      </div>
      <div className="min-h-12.5 w-screen bg-[#181818] text-white flex flex-wrap justify-center text-base sm:text-xl items-center text-center font-bold gap-x-15 gap-y-2 py-3 px-4">
        <span>NEW DROP LIVE</span>
        <div className="h-[5px] w-[5px] bg-[#00ff66] rounded-full"></div>
        <span>NEW DROP LIVE</span>
        <div className="h-[5px] w-[5px] bg-[#00ff66] rounded-full"></div>
        <span>NEW DROP LIVE</span>
      </div>
      <div id="main" className="w-screen min-h-180 bg-[#111111] flex justify-center items-center px-4 py-16 md:py-0 md:h-180">
        <div className="flex flex-col items-center justify-center gap-y-5 w-full">
          <h1 className="font-sans text-white text-2xl sm:text-3xl font-bold text-center">TRENDING COLLECTIONS</h1>
          <div className="w-full">
            <div className="flex gap-x-4 overflow-x-auto md:justify-center pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              {
                trending.map((item) => (
                  <TrendingCollections
                    key={item.id}
                    title={item.title}
                    bgImage={item.bgImage}
                  />
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen bg-[#00ff66] flex justify-center items-center px-6 py-12 md:py-0 md:h-80">
        <div className="flex flex-col justify-center items-center w-full md:w-[60%] font-sans gap-y-7 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">JOIN THE CULTURE</h1>
          <p className="text-sm">Get access to Premium Drops, Exclusive Merch and Members-Only Pricing.</p>
          <div
            className="flex justify-center items-center w-44 h-12 bg-black text-xs font-semibold text-white cursor-pointer hover:border-2 hover:border-black hover:bg-[#0000002f] hover:text-black duration-500 ease-in-out"
            onClick={() => navigate(isLoggedIn() ? "/marketplace" : "/signup")}
          >
            BECOME A MEMBER
          </div>
        </div>
      </div>
      <div className="w-screen bg-[#181818] flex justify-center items-center font-sans px-6 py-12 md:py-0 md:h-[550px]">
        <div className="w-full md:w-[80%] flex flex-col items-center justify-center space-y-6">
          <div className="flex w-full flex-col sm:flex-row justify-around gap-y-8 gap-x-4 py-2">
            <div className="flex flex-col items-center justify-center gap-y-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">{shippedNumbers - 1} +</span>
              <span className="text-[#8a8a8a] text-xs">Stickers Shipped</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">{averageRating}/5</span>
              <span className="text-[#8a8a8a] text-xs">Average Rating</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">{collectorNumbers - 1} +</span>
              <span className="text-[#8a8a8a] text-xs">Active Collectors</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={openReviewForm}
              className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer"
            >
              LEAVE A REVIEW
            </button>
          </div>
          {showReviewForm && (
            <form
              onSubmit={submitReview}
              className="flex flex-col gap-y-3 w-full sm:w-[450px] bg-[#242424] rounded-2xl p-6"
            >
              <span className="text-white font-semibold text-sm">
                LEAVE A REVIEW
              </span>
              <div className="flex gap-1 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((s) => (
                  <IoStar
                    key={s}
                    onClick={() => setStars(s)}
                    className={s <= stars ? "text-[#00ff66]" : "text-[#515151]"}
                  />
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows={3}
                placeholder="Tell us what you think..."
                className="border border-[#2e2e2e] rounded-lg bg-[#111111] text-white px-4 py-2 text-sm placeholder-[#515151] outline-none focus:border-[#00ff66]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-10 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 h-10 rounded-lg border border-[#2e2e2e] text-[#8a8a8a] text-xs font-semibold hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
          <div className="flex w-full overflow-x-auto sm:justify-around h-auto gap-x-4 pb-2">
            {
              reviews.map((item) => (
                <Reviews
                  key={item.id}
                  stars={[...Array(item.stars)].map((_, index) => (
                    <IoStar key={index} />
                  ))}
                  reviewDescription={item.reviewText}
                  userName={item.userName}
                />
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
