import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CheckCircle2, Circle, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function Stamps() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [booths, setBooths] = useState<any[]>([]);
  const [stamps, setStamps] = useState<Set<number>>(new Set());
  const [selectedBooth, setSelectedBooth] = useState<any>(null);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);

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
    // ✅ 공개 필드만 조회 (비밀 코드 제외)
    const { data: boothsData } = await supabase
      .from("booths")
      .select("booth_id, name, description, location, teacher")
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
        toast.success(`✅ ${selectedBooth.name} 스탬프 획득! (${stamps.size + 1}/20) 🎉`);
        await loadData(user.id);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">스탬프 투어</h1>
        <p className="text-white/90 text-sm">20개 부스를 모두 완주하세요!</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-xl border-2 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">진행 상황</h2>
            <div className="text-2xl font-bold text-primary">{stamps.size} / 20</div>
          </div>
          <div className="w-full bg-muted rounded-full h-5 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500 flex items-center justify-end pr-2 shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
              )}
            </div>
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
                          👨‍🏫 {booth.teacher}
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
              <Label htmlFor="code">부스 코드 입력</Label>
              <Input
                id="code"
                type="text"
                placeholder="QR 코드, PIN 번호, 또는 퀴즈 정답"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="h-12 text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                부스에서 제공하는 QR 코드를 스캔하거나, 스태프에게 PIN 번호를 받거나, 퀴즈 정답을 입력하세요
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
