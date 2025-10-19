import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RefreshCw, Trophy, Shuffle } from "lucide-react";

interface Booth {
  booth_id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  teacher?: string | null;
  staff_pin?: string;
}

interface LuckyDrawEntry {
  name: string;
  student_id: string;
  completed_at: string;
}

export default function Admin() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<LuckyDrawEntry[]>([]);
  const [winnerCount, setWinnerCount] = useState("3");
  const [totalEntries, setTotalEntries] = useState(0);

  const loadBooths = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("booths")
      .select("booth_id, name, description, location, teacher, staff_pin")
      .order("booth_id", { ascending: true });
    
    setLoading(false);
    
    if (error) {
      toast.error("부스 목록을 불러오지 못했습니다.");
      console.error(error);
      return;
    }
    
    setBooths(data as Booth[]);
  };

  const loadLuckyDrawStats = async () => {
    const { count, error } = await supabase
      .from("lucky_draw_entries")
      .select("*", { count: "exact", head: true });
    
    if (!error && count !== null) {
      setTotalEntries(count);
    }
  };

  useEffect(() => {
    loadBooths();
    loadLuckyDrawStats();
  }, []);

  const drawWinners = async () => {
    const count = parseInt(winnerCount);
    if (isNaN(count) || count < 1) {
      toast.error("유효한 당첨자 수를 입력하세요.");
      return;
    }

    if (count > totalEntries) {
      toast.error(`당첨자 수가 전체 참가자 수(${totalEntries}명)보다 많습니다.`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("pick_random_winners", { n: count });
      
      if (error) {
        toast.error("추첨에 실패했습니다.");
        console.error(error);
        return;
      }
      
      setWinners(data as LuckyDrawEntry[]);
      toast.success(`${count}명의 당첨자를 추첨했습니다! 🎉`);
    } catch (error) {
      toast.error("오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
        <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
          <p className="text-white/90 text-sm">부스 PIN 관리 및 행운권 추첨</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Lucky Draw Section */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">행운권 추첨</h2>
                <p className="text-sm text-muted-foreground">
                  20개 부스 완주자: <span className="font-bold text-primary">{totalEntries}명</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <Input
                type="number"
                min="1"
                value={winnerCount}
                onChange={(e) => setWinnerCount(e.target.value)}
                placeholder="당첨자 수"
                className="w-32"
              />
              <Button
                onClick={drawWinners}
                disabled={loading || totalEntries === 0}
                className="gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                <Shuffle className="w-4 h-4" />
                추첨하기
              </Button>
              <Button
                onClick={() => { setWinners([]); loadLuckyDrawStats(); }}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                새로고침
              </Button>
            </div>

            {winners.length > 0 && (
              <div className="bg-card rounded-lg p-4 space-y-2">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  🎉 당첨자 명단
                </h3>
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
                  >
                    <div>
                      <span className="font-bold text-lg">{winner.name}</span>
                      <span className="text-muted-foreground ml-3">({winner.student_id})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(winner.completed_at).toLocaleString("ko-KR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Booth Management */}
          <Card className="p-6 bg-card/80 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">부스 PIN 관리</h2>
            <p className="text-sm text-muted-foreground mb-4">
              💡 PIN 번호는 관리자만 열람 가능합니다. 학생에게는 비노출됩니다.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-card rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <tr>
                    <th className="p-4 text-left font-bold">ID</th>
                    <th className="p-4 text-left font-bold">부스명</th>
                    <th className="p-4 text-left font-bold">위치</th>
                    <th className="p-4 text-left font-bold">담당교사</th>
                    <th className="p-4 text-left font-bold">PIN</th>
                  </tr>
                </thead>
                <tbody>
                  {booths.map((booth) => (
                    <tr key={booth.booth_id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono text-primary font-bold">{booth.booth_id}</td>
                      <td className="p-4 font-semibold">{booth.name}</td>
                      <td className="p-4 text-sm">{booth.location}</td>
                      <td className="p-4 text-sm">{booth.teacher}</td>
                      <td className="p-4 font-mono text-lg font-bold text-primary">{booth.staff_pin || "-"}</td>
                    </tr>
                  ))}
                  {booths.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        {loading ? "불러오는 중..." : "부스 데이터가 없습니다."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Navigation />
      </div>
    </AdminGuard>
  );
}
