import pymysql

MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'tiger',
    'database': 'employee_db5',
    'autocommit': True,
    'charset': 'utf8mb4'
}

def initialize_db():
    conn = pymysql.connect(
        host=MYSQL_CONFIG['host'],
        user=MYSQL_CONFIG['user'],
        password=MYSQL_CONFIG['password'],
        charset=MYSQL_CONFIG['charset'],
        autocommit=True
    )
    try:
        with conn.cursor() as cursor:
            # Create database if not exists
            cursor.execute("CREATE DATABASE IF NOT EXISTS employee_db5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            cursor.execute("USE employee_db5;")
            
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password_hash VARCHAR(128) NOT NULL
                );
            """)
            
            # Create employees table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS employees (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    position VARCHAR(50),
                    salary FLOAT,
                    department VARCHAR(50),
                    user_id INT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """)
            
            print("Database and tables created successfully.")
    finally:
        conn.close()

if __name__ == '__main__':
    initialize_db()
