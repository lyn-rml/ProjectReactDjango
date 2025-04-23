import psycopg2 
conn_details = psycopg2.connect(
   host="localhost",
   database="TestTFC",
   user="postgres",
   password="lynadmin",
   port= '5432'
)
    
cursor = conn_details.cursor()
table_creation = '''
   CREATE TABLE staff_information (
       stf_id SERIAL PRIMARY KEY,
       stf_name TEXT NOT NULL
   )
'''
cursor.execute(table_creation)

conn_details.commit()
cursor.close()
conn_details.close()
