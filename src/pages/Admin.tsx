import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import QRPosterModal from "@/components/QRPosterModal";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Printer } from "lucide-react";

interface Booth {
  booth_id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  teacher?: string | null;
  staff_pin?: string;
  qr_code_value?: string;
}

export default function Admin() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [posterBooth, setPosterBooth] = useState<Booth | null>(null);

  const loadBooths = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("booths")
      .select("booth_id, name, description, location, teacher, staff_pin, qr_code_value")
      .order("booth_id", { ascending: true });
    
    setLoading(false);
    
    if (error) {
      toast.error("부스 목록을 불러오지 못했습니다.");
      console.error(error);
      return;
    }
    
    setBooths(data as Booth[]);
  };

  useEffect(() => {
    loadBooths();
  }, []);

  const rotatePin = async (booth_id: number) => {
    const { error } = await supabase.rpc("rotate_booth_pin", { p_booth_id: booth_id });
    
    if (error) {
      toast.error("PIN 회전에 실패했습니다.");
      console.error(error);
      return;
    }
    
    await loadBooths();
    toast.success(`새 PIN 발급 완료 (Booth #${booth_id})`);
  };

  const rotateQR = async (booth_id: number) => {
    const { error } = await supabase.rpc("rotate_booth_qrcode", { p_booth_id: booth_id });
    
    if (error) {
      toast.error("QR 코드 값 회전에 실패했습니다.");
      console.error(error);
      return;
    }
    
    await loadBooths();
    toast.success(`새 QR 코드 값 발급 완료 (Booth #${booth_id})`);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
        <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
          <p className="text-white/90 text-sm">부스 코드 관리 및 QR 포스터 생성</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <Card className="p-6 mb-6 bg-card/80 backdrop-blur">
            <p className="text-sm text-muted-foreground">
              💡 PIN/QR 코드는 관리자만 열람·회전 가능합니다. 학생 클라이언트에는 비노출됩니다.
            </p>
          </Card>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-card rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <tr>
                  <th className="p-4 text-left font-bold">ID</th>
                  <th className="p-4 text-left font-bold">부스명</th>
                  <th className="p-4 text-left font-bold">위치</th>
                  <th className="p-4 text-left font-bold">담당교사</th>
                  <th className="p-4 text-left font-bold">QR 코드값</th>
                  <th className="p-4 text-left font-bold">PIN</th>
                  <th className="p-4 text-left font-bold">액션</th>
                </tr>
              </thead>
              <tbody>
                {booths.map((booth) => (
                  <tr key={booth.booth_id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-primary font-bold">{booth.booth_id}</td>
                    <td className="p-4 font-semibold">{booth.name}</td>
                    <td className="p-4 text-sm">{booth.location}</td>
                    <td className="p-4 text-sm">{booth.teacher}</td>
                    <td className="p-4 font-mono text-sm">{booth.qr_code_value || "-"}</td>
                    <td className="p-4 font-mono text-sm">{booth.staff_pin || "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => rotatePin(booth.booth_id)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          PIN 회전
                        </Button>
                        <Button
                          onClick={() => rotateQR(booth.booth_id)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          QR 회전
                        </Button>
                        <Button
                          onClick={() => setPosterBooth(booth)}
                          size="sm"
                          className="gap-1 bg-gradient-to-r from-primary to-secondary"
                        >
                          <Printer className="w-3 h-3" />
                          포스터
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {booths.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      {loading ? "불러오는 중..." : "부스 데이터가 없습니다."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {posterBooth && (
          <QRPosterModal booth={posterBooth} onClose={() => setPosterBooth(null)} />
        )}

        <Navigation />
      </div>
    </AdminGuard>
  );
}
