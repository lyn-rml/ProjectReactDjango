import psycopg2 
# def create_tables():
#     """ Create tables in the PostgreSQL database"""
#     commands = (
#         """
#         CREATE TABLE vendors (
#             vendor_id SERIAL PRIMARY KEY,
#             vendor_name VARCHAR(255) NOT NULL
#         )
#         """,
#         """ CREATE TABLE parts (
#                 part_id SERIAL PRIMARY KEY,
#                 part_name VARCHAR(255) NOT NULL
#                 )
#         """,
#         """
#         CREATE TABLE part_drawings (
#                 part_id INTEGER PRIMARY KEY,
#                 file_extension VARCHAR(5) NOT NULL,
#                 drawing_data BYTEA NOT NULL,
#                 FOREIGN KEY (part_id)
#                 REFERENCES parts (part_id)
#                 ON UPDATE CASCADE ON DELETE CASCADE
#         )
#         """,
#         """
#         CREATE TABLE vendor_parts (
#                 vendor_id INTEGER NOT NULL,
#                 part_id INTEGER NOT NULL,
#                 PRIMARY KEY (vendor_id , part_id),
#                 FOREIGN KEY (vendor_id)
#                     REFERENCES vendors (vendor_id)
#                     ON UPDATE CASCADE ON DELETE CASCADE,
#                 FOREIGN KEY (part_id)
#                     REFERENCES parts (part_id)
#                     ON UPDATE CASCADE ON DELETE CASCADE
#         )
#         """)
conn_details = psycopg2.connect(
   host="localhost",
   database="ProjectTFC",
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
#     try:
#         config = load_config()
#         with psycopg2.connect(**config) as conn:
#             with conn.cursor() as cur:
#                 # execute the CREATE TABLE statement
#                 for command in commands:
#                     cur.execute(command)
#     except (psycopg2.DatabaseError, Exception) as error:
#         print(error)

# if __name__ == '__main__':
#     create_tables()