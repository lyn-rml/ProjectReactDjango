-- to remove all data  --
TRUNCATE TABLE myapi_intern,myapi_customuser,myapi_internship,myapi_member,myapi_payment_history,myapi_person ,myapi_project,myapi_supervisor,myapi_supervisor_internship,token_blacklist_blacklistedtoken  RESTART IDENTITY CASCADE;
--if i want to update next payment  --
UPDATE myapi_payment_history
SET "Next_Payment_date" = '2025-05-30'
WHERE id = 2;