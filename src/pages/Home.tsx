import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Heart, Map, Stamp, Calendar, Frame, LogOut, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stampCount, setStampCount] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Get stamp count
      const { count } = await supabase
        .from("stamp_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setStampCount(count || 0);
      
      // 완주 시 축하 효과
      if (count === 20) {
        triggerConfetti();
        toast.success("🎉 완주 축하합니다! 경품 수령처로 가주세요!");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다");
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      // 더 밝고 경쾌한 축제 BGM으로 변경
      audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf26f94.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  if (!user) return null;

  const quickLinks = [
    { icon: Map, label: "체험부스 배치도", path: "/map", color: "from-primary to-secondary" },
    { icon: Stamp, label: "스탬프 투어", path: "/stamps", color: "from-secondary to-accent" },
    { icon: Frame, label: "전시 안내", path: "/exhibitions", color: "from-accent to-primary" },
    { icon: Calendar, label: "공연 순서", path: "/performances", color: "from-primary to-accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10 pb-24 font-sans">
      {/* 하트 떠다니는 배경 효과 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-heart-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary p-8 text-center shadow-[var(--shadow-glow)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative">
          <div className="flex justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMusic}
              className="text-white hover:bg-white/20"
            >
              {isMusicPlaying ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {isMusicPlaying ? "음악 끄기" : "음악 켜기"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
          
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm mb-4 animate-bounce-in shadow-[var(--shadow-glow)]">
            <Heart className="w-12 h-12 text-white" fill="currentColor" />
          </div>
          
          <h1 className="text-5xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
            2025 성덕제
          </h1>
          <p className="text-2xl text-primary-foreground/95 font-medium mb-6 drop-shadow-md flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 fill-current animate-heart-pulse" />
            Love wins all
            <Heart className="w-6 h-6 fill-current animate-heart-pulse" />
          </p>
          
          {profile && (
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 inline-block shadow-[var(--shadow-soft)] border border-white/40">
              <p className="text-white text-lg">
                <span className="font-bold text-lg">{profile.name}</span>님 환영합니다! ✨
              </p>
              <p className="text-primary-foreground/90 text-sm">학번: {profile.student_id}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stamp Progress */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-soft)] border-2 border-primary/20 animate-fade-in rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Stamp className="w-6 h-6 text-primary animate-heart-pulse" />
              스탬프 진행 상황 💖
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">획득 스탬프</span>
              <span className="font-bold text-lg text-primary">{stampCount} / 20</span>
            </div>
            
            <div className="w-full bg-muted/60 rounded-full h-5 overflow-hidden border-2 border-primary/10">
              <div
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 rounded-full shadow-[var(--shadow-glow)]"
                style={{ width: `${(stampCount / 20) * 100}%` }}
              />
            </div>
            
            {stampCount === 20 && (
              <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl p-5 border-2 border-primary/30 animate-bounce-in shadow-[var(--shadow-glow)]">
                <p className="text-center font-bold text-primary text-lg flex items-center justify-center gap-2">
                  🎉 완주 축하합니다! 경품 수령처: 본관 1층 안내데스크 (16:30까지) 🎊
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/stamps")}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[var(--shadow-glow)] rounded-2xl"
          style={{ animation: "gentle-bounce 2s ease-in-out infinite" }}
        >
          <Stamp className="w-8 h-8 mr-3" />
          스탬프 투어 시작하기 ♥✨
        </Button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card
                key={link.path}
                onClick={() => navigate(link.path)}
                className="p-6 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-soft)] border-2 border-transparent hover:border-primary/30 group rounded-3xl"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${link.color} mb-3 group-hover:animate-heart-pulse shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-semibold text-center group-hover:text-primary transition-colors">
                  {link.label}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Notice */}
        <Card className="p-6 bg-muted/30 border-l-4 border-primary rounded-3xl shadow-[var(--shadow-soft)]">
          <h3 className="font-bold text-lg mb-2 text-primary flex items-center gap-2">📢 공지사항</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 축제 기간: 오늘 하루 (13:00 ~ 16:30)</li>
            <li>• 경품 수령: 본관 1층 안내데스크 (16:30까지)</li>
            <li>• 20개 부스 완주 시 경품 증정!</li>
            <li>• 사랑으로 연결되는 오늘, 즐거운 축제 되세요 ♥</li>
          </ul>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}
