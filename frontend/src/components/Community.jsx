// src/Pages/Community/CommunityPage.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaCommentDots,
  FaBookmark,
  FaSearch,
  FaUsers,
  FaBookOpen,
  FaHandsHelping,
  FaVideo,
  FaDownload,
  FaPlus,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

import image from '../assets/images/Com.png'
import Com1 from "../assets/images/_Com1.png";
import Com2 from "../assets/images/_Com2.jpeg";
import Com3 from "../assets/images/_Com3.png";
import Vid1 from "../assets/images/Vid1.png";
import Vid2 from "../assets/images/Vid2.png";
import Vid3 from "../assets/images/Vid3.png";

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Dr. Meera Singh",
    role: "Wildlife Researcher",
    time: "2h ago",
    content:
      "Observed a positive shift in tiger movement in central India after corridor restoration. Camera traps show increased passage at night.",
    image: Com1,
    likes: 124,
    comments: 32,
    tags: ["#Conservation", "#Tigers", "#Research"],
  },
  {
    id: 2,
    author: "Arjun Patel",
    role: "Forest Ranger",
    time: "1d ago",
    content:
      "A herd of elephants moved through the newly opened corridor in Odisha earlier this week — minimal conflict reported thanks to community watch.",
    image: Com2,
    likes: 89,
    comments: 17,
    tags: ["#Elephants", "#Corridor", "#Field"],
  },
  {
    id: 3,
    author: "Ananya Rao",
    role: "Wildlife Photographer",
    time: "3d ago",
    content:
      "Captured this peacock during the monsoon in Rajasthan — vivid displays continue to surprise every season!",
    image: Com3,
    likes: 212,
    comments: 45,
    tags: ["#Photography", "#Birds", "#Monsoon"],
  },
];

const INITIAL_GROUPS = [
  {
    id: "g1",
    title: "Corridor Conservation",
    members: 482,
    desc: "Discuss wildlife corridors, field updates, and restoration projects.",
  },
  {
    id: "g2",
    title: "Citizen Science",
    members: 1205,
    desc: "Share sightings and contribute to community datasets.",
  },
  {
    id: "g3",
    title: "Coastal & Marine",
    members: 340,
    desc: "Protect coasts and marine biodiversity.",
  },
  {
    id: "g4",
    title: "Wildlife Photography",
    members: 890,
    desc: "Photography tips, showcases, and ethical practices.",
  },
];

const EDU_VIDEOS = [
  {
    id: "v1",
    title: "How Wildlife Corridors Work (Nat Geo)",
    url: "https://www.youtube.com/watch?v=Zy3P9s0G5mQ",
    thumbnail: Vid1,
    duration: "8:23",
  },
  {
    id: "v2",
    title: "Community Conservation Success Stories (WWF)",
    url: "https://www.youtube.com/watch?v=6M3q5aJMG3s",
    thumbnail: Vid2,
    duration: "6:45",
  },
  {
    id: "v3",
    title: "Marine Turtle Conservation (BBC Earth)",
    url: "https://www.youtube.com/watch?v=3N9b8B2qfRw",
    thumbnail: Vid3,
    duration: "10:12",
  },
];

const EDU_ARTICLES = [
  {
    id: "a1",
    title: "Practical Guide to Camera Traps",
    url: "https://www.nature.org/en-us/what-we-do/our-insights/perspectives/camera-trap-research/",
    snippet:
      "Learn how camera traps have revolutionized field monitoring and non-invasive surveys.",
  },
  {
    id: "a2",
    title: "Community Hatcheries: A Practical Manual",
    url: "https://www.coastalconservation.org/hatchery-manual",
    snippet:
      "Implementation and monitoring methods for community-run hatcheries.",
  },
];

export default function VerifiedCommunity() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [groups] = useState(INITIAL_GROUPS);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");

  // 🔹 Add Post State
  const [newPost, setNewPost] = useState({
    author: "Guest User",
    role: "Community Member",
    content: "",
    image: null,
    tags: "",
  });

  const [showAddPost, setShowAddPost] = useState(false);

  // 🔹 Filter logic
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (
        activeTag &&
        !p.tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())
      )
        return false;
      if (!q) return true;
      return (
        p.author.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q)
      );
    });
  }, [posts, query, activeTag]);

  // 🔹 Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewPost({ ...newPost, image: URL.createObjectURL(file) });
  };

  // 🔹 Submit post
  const handleAddPost = () => {
    if (!newPost.content.trim()) return;
    const newEntry = {
      id: posts.length + 1,
      author: newPost.author,
      role: newPost.role,
      time: "Just now",
      content: newPost.content,
      image: newPost.image,
      likes: 0,
      comments: 0,
      tags: newPost.tags
        ? newPost.tags.split(",").map((t) => "#" + t.trim())
        : [],
    };
    setPosts([newEntry, ...posts]);
    setNewPost({ author: "Guest User", role: "Community Member", content: "", image: null, tags: "" });
    setShowAddPost(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fff4] to-white text-gray-900">
      {/* HEADER SECTION */}
      <header
              className="relative h-[60vh] md:h-[60vh] flex flex-col items-center justify-center bg-center bg-no-repeat"
              style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
              }}
              >
              {/* Remove all overlay — clean, natural look */}
      
              {/* Text Section */}
              <div className="relative text-center max-w-3xl px-6 mt-15 md:mt-10 text-white drop-shadow-lg">
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  FaunaFlux Community
                  </h1>
                  <p className="text-base md:text-lg leading-relaxed text-white/95">
                  Explore real wildlife insights shared by researchers, rangers, and enthusiasts.
                  <br />
                  Normal users can browse, join groups, and access educational content.
                  </p>
              </div>
              </header>
      

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-10">
        {/* LEFT PANEL */}
        <aside className="space-y-8">
          {/* SEARCH */}
          <div className="bg-white rounded-xl p-5 shadow border border-green-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Posts
            </label>
            <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <FaSearch className="text-green-600" />
              <input
                placeholder="Search by author, tag, or content"
                className="ml-2 w-full bg-transparent outline-none text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["#Tigers", "#Elephants", "#Marine", "#Photography", "#Conservation"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag((t) => (t === tag ? "" : tag))}
                  className={`text-xs px-2 py-1 rounded-md border transition ${
                    activeTag === tag
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-green-700 border-green-100 hover:bg-green-50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* COMMUNITY GROUPS */}
          <div className="bg-white rounded-xl p-5 shadow border border-green-100">
            <h3 className="font-semibold text-lg text-green-800 mb-3 flex items-center gap-2">
              <FaUsers /> Community Groups
            </h3>
            <div className="space-y-4">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="border border-green-50 rounded-md p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{g.title}</h4>
                    <span className="text-xs text-gray-500">
                      {g.members} members
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Quick actions / rules (read-only) */}
            <div className="bg-white rounded-xl p-4 shadow border border-green-100 text-sm">
                <div className="flex items-center gap-2 text-green-800 font-semibold"><FaUsers /> Community Guide</div>
                <ul className="mt-2 text-gray-600 list-disc ml-5 space-y-1">
                <li>Read and react to posts (read-only for your role).</li>
                <li>Join groups to follow updates and resources.</li>
                <li>Contribute by sharing verified research when verified.</li>
                </ul>
            </div>
        </aside>

        {/* CENTER: POSTS */}
        <main className="space-y-6">
          {/* ➕ Add Post Section */}
          <div className="bg-white rounded-xl shadow border border-green-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Create a Post
              </h2>
              <button
                onClick={() => setShowAddPost(!showAddPost)}
                className="bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-800"
              >
                <FaPlus /> {showAddPost ? "Cancel" : "Add Post"}
              </button>
            </div>

            {showAddPost && (
              <div className="space-y-4">
                <textarea
                  rows="3"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="Write your post..."
                  className="w-full p-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block text-sm text-gray-600"
                />
                <input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tags: e.target.value })
                  }
                  className="w-full p-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
                />
                {newPost.image && (
                  <div className="relative">
                    <img
                      src={newPost.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md mt-2"
                    />
                    <button
                      onClick={() =>
                        setNewPost({ ...newPost, image: null })
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      <FaTimes /> Remove
                    </button>
                  </div>
                )}
                <button
                  onClick={handleAddPost}
                  className="bg-green-700 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-green-800"
                >
                  <FaPaperPlane /> Post
                </button>
              </div>
            )}
          </div>

          {/* Existing Posts */}
          <h2 className="text-2xl font-bold text-green-800">Posts</h2>
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow border border-green-100 overflow-hidden"
            >
              <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/48?img=${post.id + 10}`}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {post.author}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {post.role} • {post.time}
                    </p>
                  </div>
                </div>
                <FaBookmark className="text-gray-400" />
              </header>

              <div className="px-5 py-4">
                <p className="text-gray-700 leading-relaxed">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.author}
                    className="w-full mt-4 rounded-md h-64 object-cover"
                  />
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600 border-t border-green-50 pt-3">
                  <span className="flex items-center gap-2">
                    <FaHeart /> {post.likes}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCommentDots /> {post.comments}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </main>

        {/* RIGHT PANEL */}
        <aside className="space-y-8">
          {/* 🎥 Educational Videos */}
          <div className="bg-white rounded-xl p-4 shadow border border-green-100">
            <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
              <FaVideo /> Educational Videos
            </h3>
            <div className="mt-4 space-y-3">
              {EDU_VIDEOS.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 hover:bg-green-100 rounded-lg p-3 transition shadow-sm"
                >
                  <div className="w-20 h-14 rounded-md overflow-hidden">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm flex-1">
                    <div className="font-medium text-gray-800 line-clamp-2">
                      {v.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {v.duration}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 📚 Educational Reads */}
          <div className="bg-white rounded-xl p-5 shadow border border-green-100">
            <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
              <FaBookOpen /> Educational Reads
            </h3>
            {EDU_ARTICLES.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-md hover:bg-green-50 transition"
              >
                <h4 className="font-medium text-gray-800 text-sm">{a.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{a.snippet}</p>
              </a>
            ))}
          </div>

          {/* 💚 Donation Section */}
          <div className="bg-white rounded-xl p-5 shadow border border-green-100">
            <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
              <FaHandsHelping /> Support Conservation
            </h3>
            <p className="text-sm text-gray-600">
              Help fund local conservation, hatcheries, and anti-poaching patrols.
            </p>
            <div className="mt-4 space-y-3">
              <a
                href="https://www.worldwildlife.org/ways-to-give"
                target="_blank"
                className="block w-full text-center bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
              >
                Donate to WWF
              </a>
              <a
                href="https://www.conservation.org/donate"
                target="_blank"
                className="block w-full text-center border border-green-700 text-green-700 px-4 py-2 rounded-md hover:bg-green-50"
              >
                Donate to Conservation.org
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}