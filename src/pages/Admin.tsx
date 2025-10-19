import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Booth {
  booth_id: number;
  name: string;
  description: string | null;
  location: string | null;
  teacher: string | null;
  staff_pin: string;
}

interface Entry {
  id: string;
  user_id: string;
  name: string;
  student_id: string;
  completed_at: string;
}

export default function Admin() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [eligible, setEligible] = useState<Entry[]>([]);
  const [winners, setWinners] = useState<Entry[]>([]);
  const [sample, setSample] = useState<Entry[]>([]);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [rotatingPin, setRotatingPin] = useState<number | null>(null);
  const { toast } = useToast();

  const loadBooths = async () => {
    const { data, error } = await supabase
      .from("booths")
      .select("booth_id, name, description, location, teacher, staff_pin")
      .order("booth_id", { ascending: true });

    if (error) {
      console.error("Error loading booths:", error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "부스 정보를 불러오는데 실패했습니다.",
      });
      return;
    }

    setBooths(data || []);
  };

  const loadLuckyDraw = async () => {
    setLoading(true);
    const [{ data: elig }, { data: win }] = await Promise.all([
      supabase.rpc("ld_list_eligible"),
      supabase.rpc("ld_list_winners"),
    ]);
    setEligible(elig || []);
    setWinners(win || []);
    setSample([]);
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadBooths(), loadLuckyDraw()]);
    };

    loadData();
  }, []);

  const pickRandom = async () => {
    const { data, error } = await supabase.rpc("ld_pick_random", { n: count });
    if (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "무작위 선택 실패",
      });
      console.error(error);
      return;
    }
    setSample(data || []);
    toast({
      title: "임시 선택 완료",
      description: `${data?.length || 0}명이 선택되었습니다. '당첨 확정'을 눌러주세요.`,
    });
  };

  const confirmWinners = async () => {
    if (sample.length === 0) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "먼저 무작위 후보를 선택하세요.",
      });
      return;
    }
    const ids = sample.map((s) => s.id);
    const { error } = await supabase.rpc("ld_confirm_winners", { p_ids: ids });
    if (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "당첨 확정에 실패했습니다.",
      });
      console.error(error);
      return;
    }
    await loadLuckyDraw();
    toast({
      title: "🎉 당첨 확정 완료!",
      description: `${ids.length}명의 당첨자가 확정되었습니다.`,
    });
  };

  const unsetWinner = async (id: string) => {
    const { error } = await supabase.rpc("ld_unset_winner", { p_id: id });
    if (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "취소 실패",
      });
      console.error(error);
      return;
    }
    await loadLuckyDraw();
    toast({
      title: "당첨 취소",
      description: "당첨이 취소되었습니다.",
    });
  };

  const exportCSV = (rows: Entry[], filename: string) => {
    const header = ["name", "student_id", "completed_at"];
    const csv =
      header.join(",") +
      "\n" +
      rows
        .map((r) =>
          [r.name, r.student_id, new Date(r.completed_at).toISOString()].join(",")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "CSV 내보내기 완료",
      description: `${filename} 파일이 다운로드되었습니다.`,
    });
  };

  const rotatePin = async (boothId: number) => {
    try {
      setRotatingPin(boothId);
      
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { error } = await supabase
        .from("booths")
        .update({ staff_pin: newPin })
        .eq("booth_id", boothId);

      if (error) throw error;

      toast({
        title: "PIN 재발급 완료",
        description: `새 PIN: ${newPin}`,
      });

      await loadBooths();
    } catch (error) {
      console.error("Error rotating PIN:", error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "PIN 재발급 중 오류가 발생했습니다.",
      });
    } finally {
      setRotatingPin(null);
    }
  };

  const eligibleCount = eligible.length;
  const winnerCount = winners.length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🎉 성덕제 관리자 대시보드</h1>
          
          <div className="space-y-6">
            {/* Lucky Draw Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>완주자 (eligible)</CardDescription>
                  <CardTitle className="text-3xl">{eligibleCount}명</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportCSV(eligible, "eligible.csv")}
                    disabled={eligibleCount === 0}
                  >
                    CSV 내보내기
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>당첨자 (winners)</CardDescription>
                  <CardTitle className="text-3xl">{winnerCount}명</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportCSV(winners, "winners.csv")}
                    disabled={winnerCount === 0}
                  >
                    CSV 내보내기
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>추첨 인원 설정</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={Math.max(1, eligibleCount)}
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">명</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={pickRandom}
                      disabled={eligibleCount === 0 || loading}
                      size="sm"
                    >
                      🎲 무작위 선택
                    </Button>
                    <Button
                      onClick={confirmWinners}
                      variant="secondary"
                      disabled={sample.length === 0 || loading}
                      size="sm"
                    >
                      ✅ 당첨 확정
                    </Button>
                  </div>
                  {sample.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      임시 선택 {sample.length}명 — 확정 전까지 저장되지 않습니다.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Temporary Sample */}
            {sample.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>임시 선택 (확정 전)</CardTitle>
                  <CardDescription>
                    '당첨 확정'을 눌러야 DB에 저장됩니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">이름</th>
                          <th className="px-4 py-2 text-left">학번</th>
                          <th className="px-4 py-2 text-left">완주시간</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sample.map((s) => (
                          <tr key={s.id} className="border-t">
                            <td className="px-4 py-2">{s.name}</td>
                            <td className="px-4 py-2 font-mono">{s.student_id}</td>
                            <td className="px-4 py-2">{new Date(s.completed_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Winners List */}
            <Card>
              <CardHeader>
                <CardTitle>당첨자 목록</CardTitle>
                <CardDescription>
                  확정된 당첨자들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button
                    onClick={() => window.open("/admin/lucky-draw/present", "_blank")}
                    disabled={winners.length === 0}
                  >
                    🎤 발표 화면 열기
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">이름</th>
                        <th className="px-4 py-2 text-left">학번</th>
                        <th className="px-4 py-2 text-left">완주시간</th>
                        <th className="px-4 py-2 text-left">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {winners.map((w) => (
                        <tr key={w.id} className="border-t">
                          <td className="px-4 py-2">{w.name}</td>
                          <td className="px-4 py-2 font-mono">{w.student_id}</td>
                          <td className="px-4 py-2">{new Date(w.completed_at).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm("정말 당첨을 취소할까요?")) {
                                  unsetWinner(w.id);
                                }
                              }}
                            >
                              당첨 취소
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {winners.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                            아직 당첨자가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Booth Management */}
            <Card>
              <CardHeader>
                <CardTitle>부스 PIN 관리</CardTitle>
                <CardDescription>
                  각 부스의 PIN을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">부스 ID</th>
                        <th className="px-4 py-2 text-left">부스명</th>
                        <th className="px-4 py-2 text-left">위치</th>
                        <th className="px-4 py-2 text-left">담당 교사</th>
                        <th className="px-4 py-2 text-left">PIN</th>
                        <th className="px-4 py-2 text-left">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booths.map((booth) => (
                        <tr key={booth.booth_id} className="border-t">
                          <td className="px-4 py-2">{booth.booth_id}</td>
                          <td className="px-4 py-2">{booth.name}</td>
                          <td className="px-4 py-2">{booth.location || "-"}</td>
                          <td className="px-4 py-2">{booth.teacher || "-"}</td>
                          <td className="px-4 py-2 font-mono font-bold text-lg">
                            {booth.staff_pin}
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rotatePin(booth.booth_id)}
                              disabled={rotatingPin === booth.booth_id}
                            >
                              {rotatingPin === booth.booth_id ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  재발급 중...
                                </>
                              ) : (
                                "PIN 재발급"
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
