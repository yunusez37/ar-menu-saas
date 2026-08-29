from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib

# --- MS SQL SERVER BAĞLANTI AYARLARI ---
# Kendi bilgisayarındaki bilgileri buraya girmelisin:
# Server: .\SQLEXPRESS veya bilgisayar adı (SSMS'e girerken yazdığın sunucu adı)
# Database: armenudb (SSMS'de bu veritabanını önceden oluşturmalısın)

server = 'DESKTOP-NFQ6RHC\SQLEXPRESS' # veya 'localhost' / 'SENIN_BILGISAYAR_ADIN'
database = 'armenudb'

# Eğer Windows Authentication (Windows şifresiz giriş) kullanıyorsan:
params = urllib.parse.quote_plus(
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

# Eğer SQL Server Authentication (Kullanıcı adı / Şifre - örn: sa) kullanıyorsan, üsttekini silip bunu kullan:
# username = 'sa'
# password = 'seninsifren'
# params = urllib.parse.quote_plus(
#     f'DRIVER={{ODBC Driver 17 for SQL Server}};'
#     f'SERVER={server};'
#     f'DATABASE={database};'
#     f'UID={username};'
#     f'PWD={password};'
# )

SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# connect_args = {'check_same_thread': False} kısmı MS SQL'de gerekmez, sqlite içindir.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()