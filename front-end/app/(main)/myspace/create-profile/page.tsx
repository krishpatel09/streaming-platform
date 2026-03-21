"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check, ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// WORKING AVATAR DATA - 15 items
const AVATARS = [
  {
    id: 1,
    name: "Darth Vader",
    url: "/avatar.png",
  },
  {
    id: 2,
    name: "Dory",
    url: "data:image/png;base64,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",
  },
  {
    id: 3,
    name: "Jasmine",
    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACUCAMAAABVwGAvAAABF1BMVEX7sED///8AAAD2278quNjt075Gxun7rz37rTP7rjj/tUL/s0H//vz7qir7qy7//Pn8xXz7skj92az+4b77qB/8xHfspz1TOhX8vmn+3rjf0b7+8uL8zZD/9+38u2D+5cf+7Nj9050AtNkeFQi+hTHr1cbt0LaJydT9yonenDmhcSk3Jg4+KxDGizOwey3gxqpRRjg8NCllxt3XsGQ/t855trKz3eTo9ffC4+iX09yEXSJ3VB9eQhgOCwSOZiXTlDaGdmO7pIxpWkvNtJuWg3Cok3ssJBh2Z1mogEqDWBHzzahHPzcmIh/fuY7yx5i5vZ+5soHnrk3fr1qjuaKwsorDsnlit77BzcOgys3NsGyOtaXW4tvn0qwIan8bAAALSUlEQVR4nM2cC1fayhaAgzwyARLeCEUIxBLRqigGpUetVevx3PbctlpLW8/9/7/jJiFAHjN79gR62r26VlsemY+9Zz/mKSV+a5F+NQAs68DLF9rtll4p97YGtmz1yhW91W4X8mt49Kp4ha5eHjRKpFpVVU0jtmiaqlarWqkxKOvdwi/Ey7fKxU5JJkSRpYjICiFyqVMst1bRYmy8tt4rVVUiU8h8jLKiVuWe3v6X8fRBh2ggmY9RI52B/q/h5Vs9qUqzJ0CoqHIvjpXF8fSBpAqxzXUoF8VVKIhX0DuKmOL8KlQ6FUFXFsOr1KpKPLaZKGqj8tPwujVlJTgXUKl1fwpee0tdGc4FrA7wcQaN1yyRdcA5QkrNNeN1a3G8lSWyirUwDq+CUl02m80hAYmEcxEMXntAuKrLZaX6wR/nu1g+maB6IAKv1VF5jWVzV3sXG7Zc1JF4kqR2WuvAq5Q4DpvLSYcX2xuuXLgWzqF0qJT4Bubh5ctVjmGzu3uXG3PZ3NvbOzy42q3nEP1QrpZ5aZiHtwWozkHIZQ9fbURkf/P8zUGd7yrK1kp4hRrU7eqb+/X6RRRuLtvnh1ccBao1OAmDePkiFE+ybzY2zjfZdK7scfhIEeSD8PINONpxyDxf4diXNKD+B+AVaiCdozy+LLSXZfJB9gXwQMtKufo+gu5yf9OTN2z91WLg5QdwMM4dYpTnk0Om/tQB075MvDIcjHPZc0G8AyaepJRF8SpVgM3Or1d722J059CPrbLyBwOvJbFzRS738g9KKIZlv85WnjMeZhRYdLx2h23a3BUv1tFk+7AORRilQ69f6HhFjf2k+iUfhgr4EtKfVsTjVQA6qR6PzpY9kI/a/Wh4XaDj2cbdxQQ8qrwB+GSJ1v1oeHAuy9bj9L2ZHAL9jzRweE0wHmd3hb12KdtQsa9Sxm9RvFYJNC0qlzHlAjJvKVrdR/EGkGlzUH2HESB3SGTAx+vCphVNZRH1QU9XI94RwWtAuTb7ckW6jY0roPcpEe8I4zVh067U8Wbqg4IfCXtHCK8AK29vZbqNDSi5KY0CiFeBi7w10MG5Q62AeGBQyYpWoFS5gEoDuQTh6aDycisGlZnsg6WLqrPx8jWo5+VWyRdLeQVOEym1PBOvC85X5FaPKi4ePEsULEwDeFtQISXlUCNHnuxxJja0LRZeAV6BktbS9V5BjutoTy4w8MDhj12HCgx+jt8y3zrgTBsEhkV+vCI8dhQpk6+TR6y3zjnqU4p0PLiSsh0XT3eT1K9Z78GeG6qrfHhgurWD8gGMdOkbIg2TSf2G9UFwSCQFE+8SL7/FwePElZtld3urJ5PJIeuDb3hzVlt5Cl4bHABx8Y4rC7wj06ZL6u8Yn+QEPhujTcHrwn7LwTseJm/m/751lGer75jxWd7sfbVLweuBMZmDd2Tq5txX383okvod48NXnM6n9Sh4YKUnwa7x1tSTc7yb5Fz0P+mf5vmGr2he4BXgsGLjXTHp7hwYD8+28kIYwYWHJ5cKETy4HJCAuHc/1Jd4l0N9iZe8p31+n7tytCwLFnhN7mItPWscXwdYrv10XnAJzhldgPWeK0ozgtfjrjlSxkEf7n3KGn7YProN0HnB5TbwnU0+HumF8QqchCs51l1OrlweHx/d312bug9HH96aQTpbjhxfCeZfXtdz0m4hhNfmOa4UGIO/jXAwxLy/MUP5lxeWHddth/A49UAY7x0WL+nqNxiguepbVgVzvC4nKLt49khte1b0XaPxXMRgfuOvSZMIHielzfhevsz+5bZwK4SXTHqV7OXV7sEB3zWWaW2Ox6mU53zk/a3b0q0YXdJT339yuP0Gi4p5jldGGNeW9/3kB6edIZ8oIMO/nW/9/d8SqhVJK4fweAWBK8qgn066iV6QLjkrZ+77nJpygdcL4aG+p5jpdHoYC88NzcN0GhEgJKciDeHBy48eXadv46Xt5PWnMJ5T29+l0/0BaqMTKYbw4LVbD6/m4tlB9kjQcW0Z3tw5X36P014tjIf4VR6eeYNPGn796S4eyrpKLLyZcZPDd6KOOxOn55qdWHiYvjdzDZsvpuDxIn0Ph/fRUZ+5Eh7KuBE8eHLKE7ljroqHcw0tHFhQYdkuxPor4KXRgSUSlpFJjWz1Y+M5yuvjwnIkqeFKApuv83EFvD64IraUSEmAKqgcUZRSLy5e/z2ykUhBhSlHPSHFmHj9j9gd2VoYD1PMeyJ34kU+s4ilixbzmKHQXJRYdE0Z3UJ0KIQYSC6ElOPgIUs9Fy8ykMQVfN63B3HwMFl9/vsXiwcCkxgLkTsx6Jr4zk2bxNAF8EpNcTzOlrFgA9EpIO4Emk9IDOsK2JY2gcadfgx8X5iuwllx8gtt+hFZFMxEE04cAp5Hn7xFpzXn94k6h4hj0Ke+eQsHAZE/iuHh6ijv2TJt4SCPrCZcEVRfWeQoCvEtmeIXrcLPEKDTgd2KlEdTF61EqgJHBDKbiGmZS368BdPQU/Dm/SgQVNgLprxNLOHHYPmaQnTBrSyBxXqx83ukhqIri/UZWWEt1uNGk0tB6U8o4knQVgf+ylCYr8T1j57oiUpgowi8zYb2LLlYAelqonTQNhvOJiWakAYwrmwKxTtXoE1KnC1eVLxPadMWGpz9svDj4C1egrHF7sifd9wpP/tPENGdy3rxJHqukrNBDt5eGBHlIePieTLTo2nO//9i9ChmXd72QrHEK5MvAbywvBiNq0Ixmbc5U6BolhVNOclw8DJPD7KK9l7+1lZkVSorKjn5Mp5y8VLW+MsJQRIiNgbD26o9OCI9PlupVCpj45kgXiZlpFLW80mJ8K2C2VaNqKuI/HVq2K2mLASe8ytsxOnTA+8AMm5TeqIMBxdFO7EclcyUl8l8g/FmfM5veZLhY74q5UCT8IEI8jA2vAZneJkXLDpzJ+PDSxnWZ6gLYg9EJKDjJNqjtaDz8EYMPvO7+3bKJ1/Y+sMfJwEO45ATa9mYlfH4AN0F8Ywxs+PgD+OwjzLJZLrUnac8hnvM6UJ8XxlPFjnKxDwIRp59dKnRgu97lG9BF8BLTR+o5hU7CMY4RqecBJpa4kX4lroL4RmfaH4nS4xj7EKHENWxX3lL4zrhxWToLoSXsmjeIXoIkXqEk5wE6AJ4wfA3yjDxjKdo7yPCRzhpB2BDygviWSZdd2G81DQS/OIcgI0uUir+oBLse5b9jjUPfy9GRsqymHipr6HnErrT8vAKtaAZyBeDhmeDzbBHSzq3k83jYojOeA52Gw06vA6erA9kN7keUp7T/Mj3mjH1080+MYoqL2UFYotGy2U4vMDBf/LViDQUBDa+p80AnfuR8I8KOgcpghc7cK5NKC79ozqO6CEi379Zkd8QlenyoSp8LQH/0om5/pQHfrspAwFny2KARFa7dMJ3ZQf5jGoZJd74cg1XdiQS+uzCE3mM0wxGxm7KVEr8a7Ow18XIj5EuHl+sR3lt18XMLtuh+G18Mb6S9V22k3ButKn6bLsyqDGuIm6yweMlWg3f08cx7Gw9/vD/t4EwrABeInG6iGhP1R+U9jn6mlari0LbSJ1iW0XjJc52vMf/0MTxUilVnadsY+cM3SgezwYcuY9/VD+L9z7jUfsx+9YIDyd4wV1+MrLzQkn9FAPvSXNCkzE6FbrDUAjPlsnIqqrPMXz3Wa1PjdFEsDlRvETin6I6jYE3JeSbKFwcvES+9V089BnW/1ox7kiNgefIPzsWHtGu7Xcm8S5HjYlnu/Fkx8LUT4ZhvZ6IOOt68GzJn52ORilmknNeHo1Oz37JpbILxMnpzsiyFRkUyxrtnE5imnR9eC5i4uzsbDJ5/fr1ji32X5OJ/ULid7jQ+CfLb473f5zgSMzuSi3GAAAAAElFTkSuQmCC",
  },
  {
    id: 4,
    name: "Captain America",
    url: "data:image/png;base64,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",
  },
  {
    id: 5,
    name: "Mickey Mouse",
    url: "data:image/png;base64,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",
  },
  {
    id: 6,
    name: "Groot",
    url: "data:image/png;base64,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",
  }, // Mid-point helper
  {
    id: 7,
    name: "Elsa",
    url: "data:image/png;base64,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",
  },
  {
    id: 8,
    name: "Loki",
    url: "data:image/png;base64,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",
  },
  {
    id: 9,
    name: "Scarlet Witch",
    url: "https://avatar.iran.liara.run/public/85",
  },
  { id: 10, name: "Iron Man", url: "https://avatar.iran.liara.run/public/20" },
  {
    id: 11,
    name: "Spider-Man",
    url: "https://avatar.iran.liara.run/public/21",
  },
  { id: 12, name: "Thor", url: "https://avatar.iran.liara.run/public/23" },
  { id: 13, name: "Hulk", url: "https://avatar.iran.liara.run/public/24" },
  {
    id: 14,
    name: "Black Widow",
    url: "https://avatar.iran.liara.run/public/86",
  },
  {
    id: 15,
    name: "Doctor Strange",
    url: "https://avatar.iran.liara.run/public/25",
  },
  {
    id: 16,
    name: "Black Panther",
    url: "https://avatar.iran.liara.run/public/26",
  },
];

export default function CreateProfilePage() {
  const router = useRouter();
  // Start with Groot (Index 5)
  const [activeIndex, setActiveIndex] = useState(5);
  const [name, setName] = useState("");
  const [isKids, setIsKids] = useState(false);
  const [parentalLock, setParentalLock] = useState(false);
  const [contentRating, setContentRating] = useState("A");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCreate = () => {
    router.push("/myspace");
  };

  const next = () => {
    if (activeIndex < AVATARS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleAvatarClick = (index: number) => {
    setActiveIndex(index);
  };

  const currentAvatar = AVATARS[activeIndex];

  return (
    <div className="min-h-screen bg-[#0f1014] text-white flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Header */}
      <div className="w-full max-w-7xl flex items-center justify-between mt-8 mb-4 px-8">
        <div className="w-24" />
        <h1 className="text-4xl font-bold tracking-tight">Create Profile</h1>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-400 font-bold text-xl uppercase tracking-wider"
        >
          Cancel
        </Button>
      </div>

      {/* Selection Section */}
      <div className="relative w-screen flex flex-col items-center justify-center p-0 transition-all duration-700">
        {!isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in fade-in">
            <div className="w-full flex justify-between px-0">
              <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="p-0 text-white/30 hover:text-white transition-all disabled:opacity-0 pointer-events-auto"
              >
                <ChevronLeft className="w-16 h-16" />
              </button>

              <button
                onClick={next}
                disabled={activeIndex === AVATARS.length - 1}
                className="p-0 text-white/30 hover:text-white transition-all disabled:opacity-0 pointer-events-auto"
              >
                <ChevronRight className="w-16 h-16" />
              </button>
            </div>
          </div>
        )}

      {/* 2. Selection Area (Centered for both modes) */}
      <div className={`relative w-screen transition-all duration-700 flex items-center justify-center ${isExpanded ? 'h-[160px]' : 'h-[320px]'}`}>
        {/* Layer A: The Stationary Frame (Check/Pencil) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">

          <div
            className={`relative flex items-center justify-center transition-all duration-700 ${isExpanded ? 'scale-75' : ''}`}
            style={{
              width: "var(--item-size, 14rem)",
              height: "var(--item-size, 14rem)",
            }}
          >
            {/* Selection Circle (Hidden when expanded) */}
            <div className={`absolute inset-3 rounded-full border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 ${isExpanded ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />

            {/* Icon Button (Pencil/Check) */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-[#0f1014] scale-110 z-60 hover:bg-blue-500 transition-colors pointer-events-auto"
            >
              {isExpanded ? (
                <Pencil className="w-6 h-6 text-white stroke-3" />
              ) : (
                <Check className="w-8 h-8 text-white stroke-4" />
              )}
            </button>

            {/* Focused Avatar for Expanded View */}
            {isExpanded && (
              <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="w-(--item-size) h-(--item-size) relative">
                  <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-white/20">
                    <Image
                      src={AVATARS[activeIndex].url}
                      alt="Selected"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. THE SCROLLING AVATARS ROW (Hidden when expanded) */}
        {!isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center overflow-visible z-20 animate-in fade-in">
            <div
              className="flex items-center gap-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: `translateX(calc( (${(AVATARS.length - 1) / 2} - ${activeIndex}) * var(--step-dist) ))`,
              }}
            >
              {AVATARS.map((avatar, index) => {
                const isFocused = activeIndex === index;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => handleAvatarClick(index)}
                    className={`relative shrink-0 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center ${
                      isFocused
                        ? "opacity-100 scale-100"
                        : "opacity-45 scale-[0.7]"
                    }`}
                    style={{
                      width: "var(--item-size)",
                      height: "var(--item-size)",
                    }}
                  >
                    <div className="absolute inset-3 rounded-full overflow-hidden">
                      <Image
                        src={avatar.url}
                        alt={avatar.name}
                        fill
                        priority={isFocused}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. ENRICHED FORM SECTION (Interactive) */}
      <div className="mt-4 w-full max-w-lg space-y-6 pb-12 px-8 z-50">
        {/* Name Input - Premium Floating Label on Border Style */}
        <div className="relative group">
          <div className="absolute -top-3 left-6 px-2 bg-[#0f1014] z-10">
            <label className="text-sm font-medium text-zinc-500 group-focus-within:text-blue-500 transition-colors">
              Your Name
            </label>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onClick={() => setIsExpanded(true)}
            className="w-full bg-transparent border border-zinc-800 rounded-xl h-16 px-6 text-xl font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* 3. EXPANDABLE SETTINGS SECTION (Slide-up on interaction) */}
        {isExpanded && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            {/* Settings Rows */}
            <div className="space-y-6 pt-4">
              {/* Kids Mode */}
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-100">
                    Is this for Kids?
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Content rated U/A 7+ & below
                  </p>
                </div>
                <button
                  onClick={() => setIsKids(!isKids)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isKids ? "bg-blue-600" : "bg-zinc-700"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isKids ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>

              {/* Content Rating */}
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-100">
                    Select Content Rating
                  </h3>
                  <p className="text-sm text-zinc-500">
                    You will see content rated up to
                  </p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer text-zinc-100 font-bold text-lg">
                  <span>{contentRating}</span>
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                </div>
              </div>

              {/* Parental Lock */}
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-100">
                    Set a Parental Lock?
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Restrict access to adult profiles with a PIN
                  </p>
                </div>
                <button
                  onClick={() => setParentalLock(!parentalLock)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${parentalLock ? "bg-blue-600" : "bg-zinc-700"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${parentalLock ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
            </div>

            {/* Create Button */}
            <div className="pt-8">
              <Button
                onClick={handleCreate}
                disabled={!name.trim()}
                className={`w-full h-16 font-black text-xl rounded-2xl transition-all active:scale-95 shadow-2xl ${
                  name.trim()
                    ? "bg-linear-to-r from-blue-600 to-indigo-700 text-white opacity-100 shadow-blue-500/20"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                }`}
              >
                Create Your Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        :root {
          /* Mobile sizes (10rem item + 0 gap) */
          --item-size: 10rem;
          --step-dist: 10rem;
        }
        @media (min-width: 1024px) {
          :root {
            /* Desktop sizes (14rem item + 0 gap) */
            --item-size: 14rem;
            --step-dist: 14rem;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
