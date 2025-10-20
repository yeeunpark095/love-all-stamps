-- Update booth information for Seogwan zone (booths 16-22)

-- 1F booths
UPDATE booths
SET 
  name = '16. 융합과학STEAM주제연구반',
  location = '서관 1층 미술1실',
  description = '융합과학 STEAM 주제연구반 활동 전시'
WHERE booth_id = 16;

UPDATE booths
SET 
  name = '17. 수달(수학의달인)',
  location = '서관 1층 미술2실',
  description = '수학의달인 동아리 전시'
WHERE booth_id = 17;

UPDATE booths
SET 
  name = '18. AI, SW 코딩반',
  location = '서관 1층 융합과학실',
  description = 'AI와 소프트웨어 코딩 작품 전시'
WHERE booth_id = 18;

-- 2F booths
UPDATE booths
SET 
  name = '19. 물리를 만들다',
  location = '서관 2층 과학1실',
  description = '물리 실험 및 작품 전시'
WHERE booth_id = 19;

UPDATE booths
SET 
  name = '20. 디자인공예반',
  location = '서관 2층 과학2실',
  description = '디자인공예반 작품 전시'
WHERE booth_id = 20;

UPDATE booths
SET 
  name = '21. 융합과학STEAM주제연구반',
  location = '서관 2층 과학3실',
  description = '융합과학 STEAM 주제연구반 활동 전시'
WHERE booth_id = 21;

-- 3F booth
UPDATE booths
SET 
  name = '22. BUKU(독서토론반)',
  location = '서관 3층 늘품관',
  description = 'BUKU 독서토론반 활동 전시'
WHERE booth_id = 22;