# PostgreSQL 자주쓰는 SQL

## 컬럼 추가
alter table [tb_name] add column [column_name] ;
alter table auth_hist add column creat_dt timestamp DEFAULT now();

## comment
COMMENT ON TABLE 테이블 이름 IS '주석내용';
COMMENT ON COLUMN 테이블명.컬럼명 IS '코멘트';