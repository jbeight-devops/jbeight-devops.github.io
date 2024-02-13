# PostgreSQL 자주쓰는 SQL

## 컬럼 추가

~~~
alter table [tb_name] add column [column_name] ;
alter table auth_hist add column creat_dt timestamp DEFAULT now();
~~~

## comment

~~~
COMMENT ON TABLE 테이블 이름 IS '주석내용';
COMMENT ON COLUMN 테이블명.컬럼명 IS '코멘트';
~~~

## array_to_string
여러 행의 컬럼 값을 하나의 컬럼으로 조회하는 경우

~~~
select trgt_id, array_to_string(array_agg(),',') from table group by 
~~~

예제)

| CITY_TYPE | CITY |
|-----------|------|
| 광역시       | 부산   |
| 광역시       | 울산   |

select CITY_TYPE, array_to_string(array_agg(CITY),',') from table group by CITY_TYPE;

| CITY_TYPE | CITY |
|--|--|
|광역시 | 부산,울산|


> array_to_string : 배열요소를 문자열로 변환