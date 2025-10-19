import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useToast } from "@/hooks/use-toast";
import boothMapImage from "@/assets/booth-map.jpg";

// 부스별 이모지 매핑
const boothEmojis: Record<number, string> = {
  1: "💬",  // 영어토론
  2: "✈️",  // KIKKER(국제교류반)
  3: "🔬",  // STEAM사회참여반
  4: "🎯",  // 학생회
  5: "🧪",  // 랩퀘스트
  6: "💌",  // 솔리언(또래상담반)
  7: "📊",  // 빅데이터투인사이트
  8: "🎨",  // ARTY 미술반
  9: "📚",  // BUKU(독서토론반)
  10: "📰", // 빛글 (학생기자반)
  11: "📖", // 한걸음
  12: "⚽", // 축구반
  13: "🏀", // 슬램덩크 (농구동아리)
  14: "🏐", // Ballin (배구동아리)
  15: "🎤", // 애드미찬양반
  16: "🤖", // 물리를 만들다
  17: "📐", // 수달(수학의달인)
  18: "🎁", // 디자인공예반
  19: "🔭", // 융합과학STEAM 주제연구반
  20: "💻", // AI·SW 코딩반
};

// 부스 좌표 (배경 지도에 맞게 조정 필요)
const boothPositions: Record<number, { x: number; y: number }> = {
  1: { x: 100, y: 120 },
  2: { x: 250, y: 100 },
  3: { x: 400, y: 130 },
  4: { x: 550, y: 110 },
  5: { x: 700, y: 140 },
  6: { x: 120, y: 280 },
  7: { x: 270, y: 260 },
  8: { x: 420, y: 290 },
  9: { x: 570, y: 270 },
  10: { x: 720, y: 300 },
  11: { x: 140, y: 440 },
  12: { x: 290, y: 420 },
  13: { x: 440, y: 450 },
  14: { x: 590, y: 430 },
  15: { x: 740, y: 460 },
  16: { x: 160, y: 600 },
  17: { x: 310, y: 580 },
  18: { x: 460, y: 610 },
  19: { x: 610, y: 590 },
  20: { x: 760, y: 620 },
};

interface Booth {
  booth_id: number;
  name: string;
  description: string;
  location: string;
  teacher: string;
}

export default function Map() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [stampedBooths, setStampedBooths] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      // 부스 정보 가져오기
      const { data: boothsData } = await supabase
        .from("booths_public")
        .select("*")
        .order("booth_id");
      setBooths(boothsData || []);

      // 내 스탬프 기록 가져오기
      const { data: stampsData } = await supabase
        .from("stamp_logs")
        .select("booth_id")
        .eq("user_id", user.id);
      
      if (stampsData) {
        const stampedIds = stampsData.map((s) => s.booth_id);
        setStampedBooths(stampedIds);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleBoothClick = (booth: Booth) => {
    if (stampedBooths.includes(booth.booth_id)) {
      toast({
        title: "이미 완료된 부스입니다!",
        description: `${booth.name}은 이미 스탬프를 받았습니다.`,
      });
      return;
    }
    setSelectedBooth(booth);
    setPinInput("");
  };

  const handleVerifyPin = async () => {
    if (!selectedBooth || !user) return;
    
    if (pinInput.length !== 6) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "PIN 번호 6자리를 입력하세요.",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.rpc("verify_stamp", {
        p_user_id: user.id,
        p_booth_id: selectedBooth.booth_id,
        p_entered: pinInput,
      });

      if (error) throw error;

      if (data) {
        const updatedStamps = [...stampedBooths, selectedBooth.booth_id];
        setStampedBooths(updatedStamps);
        
        toast({
          title: "🎉 스탬프 획득!",
          description: `${selectedBooth.name} 스탬프를 획득했습니다!`,
        });

        // 완주 체크
        if (updatedStamps.length === booths.length) {
          setShowConfetti(true);
          setTimeout(() => {
            toast({
              title: "🎊 완주 축하합니다!",
              description: "모든 부스를 완료했습니다! 행운권 추첨 대상이 되었습니다.",
            });
          }, 500);

          // 행운권 등록
          await supabase.rpc("register_lucky_draw", {
            p_user_id: user.id,
          });
        }

        setSelectedBooth(null);
        setPinInput("");
      } else {
        toast({
          variant: "destructive",
          title: "인증 실패",
          description: "PIN 번호가 올바르지 않습니다.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "인증 중 오류가 발생했습니다.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">🗺️ 부스맵</h1>
        <p className="text-white/90 text-sm">부스를 클릭하여 스탬프를 받으세요!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Interactive Map */}
        <Card className="overflow-hidden shadow-xl border-2 border-primary/20 bg-card relative">
          <div 
            className="relative w-full h-[700px] bg-center bg-contain bg-no-repeat"
            style={{ 
              backgroundImage: `url(${boothMapImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center'
            }}
          >
            {booths.map((booth) => {
              const pos = boothPositions[booth.booth_id];
              const emoji = boothEmojis[booth.booth_id];
              const isStamped = stampedBooths.includes(booth.booth_id);

              if (!pos) return null;

              return (
                <div
                  key={booth.booth_id}
                  className="absolute cursor-pointer select-none"
                  style={{ 
                    left: `${pos.x}px`, 
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleBoothClick(booth)}
                  title={booth.name}
                >
                  {isStamped ? (
                    <motion.div
                      initial={{ scale: 3, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className="text-red-600 text-5xl font-extrabold drop-shadow-lg"
                    >
                      💮
                    </motion.div>
                  ) : (
                    <motion.div 
                      whileHover={{ scale: 1.3 }} 
                      whileTap={{ scale: 0.9 }}
                      className="text-4xl drop-shadow-lg"
                    >
                      {emoji}
                    </motion.div>
                  )}
                </div>
              );
            })}

            {/* Progress Display */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-primary/20">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">진행률</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stampedBooths.length} / {booths.length}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* PIN Input Dialog */}
        {selectedBooth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooth(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2">{selectedBooth.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedBooth.description}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    PIN 번호 입력 (6자리)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border-2 rounded-lg text-center text-2xl font-mono tracking-widest focus:border-primary focus:outline-none"
                    placeholder="000000"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifyPin();
                    }}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedBooth(null)}
                    className="flex-1 px-4 py-3 rounded-lg border-2 font-semibold hover:bg-muted transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleVerifyPin}
                    disabled={isVerifying || pinInput.length !== 6}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isVerifying ? "확인 중..." : "확인"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Booth List */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📋 전체 부스 목록</h2>
          <div className="grid gap-3">
            {booths.map((booth) => {
              const isStamped = stampedBooths.includes(booth.booth_id);
              const emoji = boothEmojis[booth.booth_id];

              return (
                <Card
                  key={booth.booth_id}
                  className={`p-4 transition-all ${
                    isStamped 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:shadow-md hover:border-primary/30 cursor-pointer'
                  }`}
                  onClick={() => !isStamped && handleBoothClick(booth)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <h3 className="font-bold text-lg">{booth.name}</h3>
                          {isStamped && (
                            <span className="text-xs font-semibold text-green-600">
                              ✓ 완료
                            </span>
                          )}
                        </div>
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
                    </div>
                    {isStamped && (
                      <div className="text-4xl">💮</div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}
