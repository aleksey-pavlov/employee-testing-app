﻿--
-- Script was generated by Devart dbForge Studio 2022 for Oracle, Version 4.4.64.0
-- Product home page: http://www.devart.com/dbforge/oracle/studio
-- Script date 10/17/2022 9:06:47 PM
-- Server version: Oracle Database 21c Express Edition Release 21.0.0.0.0 - Production Version 21.3.0.0.0
-- Client version: 
--

SET SQLBLANKLINES ON;
SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'MM/DD/SYYYY HH24:MI:SS';
ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF TZH:TZM';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'MM/DD/SYYYY HH24:MI:SS.FF';
ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,';
ALTER SESSION SET NLS_NCHAR_CONV_EXCP = FALSE;
ALTER SESSION SET TIME_ZONE = '+03:00';

INSERT INTO EMPAPP.POSITIONS(TITLE) VALUES
('Programmer');

INSERT INTO EMPAPP.ROLES(NAME) VALUES
('Admin');

INSERT INTO EMPAPP.TESTS(TITLE, CREATEDAT, UPDATEDAT) VALUES
('Test math', 1666029694, 1666029694);

INSERT INTO EMPAPP.TEST_QUESTIONS(TEST_ID, BODY) VALUES
(1, '2+3=');

INSERT INTO EMPAPP.TEST_QUESTION_ANSWERS(QUESTION_ID, BODY, ISCORRECT) VALUES
(1, '5', 1);
INSERT INTO EMPAPP.TEST_QUESTION_ANSWERS(QUESTION_ID, BODY, ISCORRECT) VALUES
(1, '7', 0);
INSERT INTO EMPAPP.TEST_QUESTION_ANSWERS(QUESTION_ID, BODY, ISCORRECT) VALUES
(1, '4', 0);

INSERT INTO EMPAPP.USERS(NAME, LOGIN, PASSWORD, ROLE_ID, POSITION_ID, CREATEDAT, UPDATEDAT, LASTLOGINAT) VALUES
('Admin', 'admin', '202cb962ac59075b964b07152d234b70', 1, 1, 1666029663, NULL, NULL);



COMMIT;