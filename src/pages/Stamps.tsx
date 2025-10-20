import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CheckCircle2, Circle, Trophy, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Stamps() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [booths, setBooths] = useState<any[]>([]);
  const [stamps, setStamps] = useState<Set<number>>(new Set());
  const [selectedBooth, setSelectedBooth] = useState<any>(null);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await loadData(user.id);
    };

    checkAuth();
  }, [navigate]);

  const loadData = async (userId: string) => {
    // ✅ 공개 뷰를 통해 필드 조회 (비밀 코드 제외)
    const { data: boothsData } = await supabase
      .from("booths_public")
      .select("*")
      .order("booth_id");
    setBooths(boothsData || []);

    const { data: stampsData } = await supabase
      .from("stamp_logs")
      .select("booth_id")
      .eq("user_id", userId);
    
    const stampSet = new Set((stampsData || []).map(s => s.booth_id));
    setStamps(stampSet);
  };

  const handleVerify = async () => {
    if (!inputCode.trim() || !selectedBooth || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("verify_stamp", {
        p_user_id: user.id,
        p_booth_id: selectedBooth.booth_id,
        p_entered: inputCode.trim(),
      });

      if (error) {
        toast.error("인증 오류가 발생했습니다");
        return;
      }

      if (data === true) {
        const newStampCount = stamps.size + 1;
        
        // Floating heart animation
        setFloatingHearts([...floatingHearts, Date.now()]);
        setTimeout(() => {
          setFloatingHearts(prev => prev.slice(1));
        }, 2000);
        
        toast.success(`✅ ${selectedBooth.name} 스탬프 획득! (${newStampCount}/20) 🎉`);
        await loadData(user.id);
        
        // Check if user completed all 20 stamps
        if (newStampCount === 20) {
          try {
            await supabase.rpc("register_lucky_draw", { p_user_id: user.id });
            toast.success("🎉 모든 부스를 완주했습니다! 행운권 추첨 대상에 등록되었습니다.");
          } catch (error) {
            console.error("Lucky draw registration failed:", error);
          }
        }
        
        setSelectedBooth(null);
        setInputCode("");
      } else {
        toast.error("❌ 인증 실패. 코드를 확인하고 다시 시도하세요!");
      }
    } catch (error) {
      toast.error("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const progress = (stamps.size / 20) * 100;
  const isComplete = stamps.size === 20;
  
  const getMilestoneMessage = (count: number) => {
    if (count >= 20) return { emoji: "🏆", message: "완주 달성!" };
    if (count >= 15) return { emoji: "🌟", message: "거의 다 왔어요!" };
    if (count >= 10) return { emoji: "⭐", message: "절반 완주!" };
    if (count >= 5) return { emoji: "💪", message: "좋은 시작이에요!" };
    return { emoji: "🎯", message: "시작해볼까요?" };
  };
  
  const milestone = getMilestoneMessage(stamps.size);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24 relative overflow-hidden">
      {/* Floating Hearts Animation */}
      {floatingHearts.map((id, index) => (
        <Heart
          key={id}
          className="absolute text-pink-500 pointer-events-none"
          fill="currentColor"
          style={{
            left: `${20 + index * 15}%`,
            animation: "float-hearts 2s ease-out forwards",
            width: "40px",
            height: "40px"
          }}
        />
      ))}
      
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">스탬프 투어</h1>
        <p className="text-white/90 text-sm">20개 부스를 모두 완주하세요!</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-xl border-2 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">진행 상황</h2>
              <span className="text-2xl">{milestone.emoji}</span>
            </div>
            <div className="text-2xl font-bold text-primary">{stamps.size} / 20</div>
          </div>
          <p className="text-sm text-muted-foreground mb-3 text-center font-semibold">
            {milestone.message}
          </p>
          <div className="w-full bg-muted rounded-full h-6 overflow-hidden mb-4 relative">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500 rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)] flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Heart collection display */}
          <div className="grid grid-cols-10 gap-2 p-3 bg-muted/30 rounded-lg mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${
                  i < stamps.size
                    ? "text-pink-500 fill-pink-500 scale-110"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {isComplete && (
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4 border-2 border-primary/30 animate-heart-pulse">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-lg text-primary">🎉 완주 축하합니다!</p>
                  <p className="text-sm text-muted-foreground">
                    경품 수령: 본관 1층 안내데스크 (16:30까지)
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Booth Cards */}
        <div className="grid gap-4">
          {booths.map((booth) => {
            const hasStamp = stamps.has(booth.booth_id);
            return (
              <Card
                key={booth.booth_id}
                className={`p-5 transition-all cursor-pointer ${
                  hasStamp
                    ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30"
                    : "hover:shadow-lg hover:border-primary/20"
                }`}
                onClick={() => !hasStamp && setSelectedBooth(booth)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                      hasStamp
                        ? "bg-gradient-to-br from-primary to-secondary animate-heart-pulse"
                        : "bg-muted"
                    }`}
                  >
                    {hasStamp ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : (
                      <Circle className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">#{booth.booth_id}</span>
                      <h3 className="font-bold text-lg">{booth.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{booth.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-secondary/30 rounded-full">
                        📍 {booth.location}
                      </span>
                      {booth.teacher && (
                        <span className="px-2 py-1 bg-accent/30 rounded-full">
                          👨‍🏫 {booth.teacher} 선생님
                        </span>
                      )}
                    </div>
                    {hasStamp && (
                      <div className="mt-2 flex items-center gap-1 text-primary text-sm font-semibold">
                        <Heart className="w-4 h-4" fill="currentColor" />
                        인증 완료!
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={!!selectedBooth} onOpenChange={() => setSelectedBooth(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedBooth?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">{selectedBooth?.description}</p>
              <p className="text-sm">📍 {selectedBooth?.location}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">PIN 번호 입력</Label>
              <Input
                id="code"
                type="text"
                placeholder="스태프에게 받은 PIN 번호를 입력하세요"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="h-12 text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                부스 스태프에게 PIN 번호를 받아 입력하세요
              </p>
            </div>

            <Button
              onClick={handleVerify}
              disabled={loading || !inputCode.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary"
            >
              {loading ? "확인 중..." : "인증하기 ♥"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}
