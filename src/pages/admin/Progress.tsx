import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AdminGuard from "@/components/AdminGuard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw } from "lucide-react";

type ProgressRow = {
  user_id: string;
  name: string;
  student_id: string;
  stamps: number;
  required_total: number;
  completed: boolean;
  last_stamp_at: string | null;
};

export default function AdminProgressPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 200;

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_progress", {
      p_search: query || null,
      p_page: page,
      p_page_size: pageSize,
      p_order: "completed desc, stamps desc, last_stamp_at desc nulls last, student_id asc",
    });
    setLoading(false);
    if (error) {
      console.error("Failed to fetch progress:", error);
      return;
    }
    setRows((data as ProgressRow[]) ?? []);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchRows();
  };

  const handleReset = () => {
    setQuery("");
    setPage(0);
    setTimeout(fetchRows, 100);
  };

  const pct = (r: ProgressRow) =>
    r.required_total ? Math.round((r.stamps / r.required_total) * 100) : 0;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">참가자 진행 현황</h1>
                <p className="text-sm text-muted-foreground">
                  전체 참가자의 스탬프 수집 진행 상황을 확인하세요
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                ← 관리자 홈
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="이름 또는 학번으로 검색..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-sm text-muted-foreground mb-1">총 참가자</div>
                <div className="text-3xl font-bold text-primary">{rows.length}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <div className="text-sm text-muted-foreground mb-1">완료자</div>
                <div className="text-3xl font-bold text-green-600">
                  {rows.filter((r) => r.completed).length}
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <div className="text-sm text-muted-foreground mb-1">평균 진행률</div>
                <div className="text-3xl font-bold text-amber-600">
                  {rows.length > 0
                    ? Math.round(rows.reduce((sum, r) => sum + pct(r), 0) / rows.length)
                    : 0}
                  %
                </div>
              </Card>
            </div>

            {/* Progress Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">이름</TableHead>
                    <TableHead className="font-bold">학번</TableHead>
                    <TableHead className="font-bold text-right">스탬프</TableHead>
                    <TableHead className="font-bold">진행률</TableHead>
                    <TableHead className="font-bold text-center">완료</TableHead>
                    <TableHead className="font-bold">마지막 스탬프</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.user_id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="font-mono text-sm">{r.student_id}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {r.stamps} / {r.required_total}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                r.completed ? "bg-green-500" : "bg-primary"
                              }`}
                              style={{ width: `${pct(r)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium w-10">
                            {pct(r)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {r.completed && <span className="text-2xl">✅</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.last_stamp_at
                          ? new Date(r.last_stamp_at).toLocaleString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && !loading && (
                    <TableRow>
                      <TableCell
                        className="text-center text-muted-foreground py-12"
                        colSpan={6}
                      >
                        {query ? "검색 결과가 없습니다" : "데이터가 없습니다"}
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && (
                    <TableRow>
                      <TableCell
                        className="text-center text-muted-foreground py-12"
                        colSpan={6}
                      >
                        데이터를 불러오는 중...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                페이지 <span className="font-semibold">{page + 1}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0 || loading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  disabled={loading || rows.length < pageSize}
                  onClick={() => setPage((p) => p + 1)}
                >
                  다음
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
